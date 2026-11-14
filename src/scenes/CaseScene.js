import { TILE_SIZE, PLAYER_SPEED, UI_DEPTH } from '../config.js';
import case001 from '../data/cases/case001.js';
import { createCaseState } from '../systems/CaseState.js';
import {
  inputDirection,
  moveWithCollision,
  solidCheckFromRows,
  solidCheckFromFootprints,
} from '../systems/MovementSystem.js';
import { findNearestInteractable } from '../systems/InteractionSystem.js';
import {
  startDialogue,
  currentLine,
  advanceDialogue,
} from '../systems/DialogueSystem.js';
import { notebookTabs } from '../systems/NotebookSystem.js';
import InteractionPrompt from '../ui/InteractionPrompt.js';
import DialogueBox from '../ui/DialogueBox.js';
import NotebookPanel from '../ui/NotebookPanel.js';

// If the browser stalls, one frame can report a very long delta. Capping it
// keeps a single step small.
const MAX_FRAME_MS = 50;

// What the player is doing right now. Only one mode is active at a time.
const MODE_EXPLORE = 'explore'; // Walking around and interacting.
const MODE_DIALOGUE = 'dialogue'; // Reading a dialogue box.
const MODE_NOTEBOOK = 'notebook'; // Looking at the notebook.

// Loads a case map, actors, interactions, and case state.
// For now it always loads Case 001.
export default class CaseScene extends Phaser.Scene {
  constructor() {
    super('CaseScene');
  }

  create() {
    this.caseData = case001;
    this.caseState = createCaseState();
    const { rows, spawn } = this.caseData.map;

    this.drawRoom(rows);
    this.drawInteractables(this.caseData.interactables);

    // A tile is solid if it is a wall or is covered by a solid object.
    const wallAt = solidCheckFromRows(rows);
    const objectAt = solidCheckFromFootprints(this.caseData.interactables);
    this.isSolid = (tileX, tileY) => wallAt(tileX, tileY) || objectAt(tileX, tileY);

    // The exact position of the player's feet: the bottom-centre of the
    // spawn tile. It can hold fractions of a pixel; the sprite is drawn at
    // the nearest whole pixel.
    this.playerPosition = {
      x: spawn.tileX * TILE_SIZE + TILE_SIZE / 2,
      y: (spawn.tileY + 1) * TILE_SIZE,
    };

    // Bottom-centre origin: the sprite's position is where the feet are.
    this.player = this.add.image(0, 0, 'auditor').setOrigin(0.5, 1);
    this.drawPlayer();

    // The interactable currently in range (or null), and its marker.
    this.target = null;
    this.marker = this.add
      .image(0, 0, 'ui_marker')
      .setOrigin(0.5, 1)
      .setDepth(UI_DEPTH - 1)
      .setVisible(false);

    this.prompt = new InteractionPrompt(this);
    this.dialogueBox = new DialogueBox(this);
    this.notebook = new NotebookPanel(this);

    this.mode = MODE_EXPLORE;
    this.dialogue = null; // The dialogue session being read, if any.

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE,ENTER,ESC,J');
  }

  update(time, delta) {
    const pressed = this.readPresses();

    if (this.mode === MODE_EXPLORE) {
      this.updateExplore(delta, pressed);
    } else if (this.mode === MODE_DIALOGUE) {
      this.updateDialogue(pressed);
    } else if (this.mode === MODE_NOTEBOOK) {
      this.updateNotebook(pressed);
    }
  }

  // Reads which keys were pressed this frame (a press, not a hold).
  //
  // Every key is checked on every frame, whatever the mode. A press that is
  // never checked stays "pending", and would fire later at the wrong moment
  // (for example, skipping the first line of the next dialogue).
  readPresses() {
    const justDown = Phaser.Input.Keyboard.JustDown;
    const e = justDown(this.keys.E);
    const space = justDown(this.keys.SPACE);
    const enter = justDown(this.keys.ENTER);
    const escape = justDown(this.keys.ESC);
    const j = justDown(this.keys.J);
    const left = justDown(this.cursors.left);
    const a = justDown(this.keys.A);
    const right = justDown(this.cursors.right);
    const d = justDown(this.keys.D);

    return {
      interact: e || space,
      advance: enter || e || space,
      cancel: escape,
      notebook: j,
      left: left || a,
      right: right || d,
    };
  }

  // --- Explore mode -------------------------------------------------------

  updateExplore(delta, pressed) {
    this.updateMovement(delta);

    const target = findNearestInteractable(
      this.playerPosition,
      this.caseData.interactables
    );
    if (target !== this.target) {
      this.target = target;
      this.showTarget();
    }

    if (pressed.interact && this.target) {
      this.onInteract(this.target);
    } else if (pressed.notebook) {
      this.openNotebook();
    }
  }

  updateMovement(delta) {
    const direction = inputDirection({
      left: this.cursors.left.isDown || this.keys.A.isDown,
      right: this.cursors.right.isDown || this.keys.D.isDown,
      up: this.cursors.up.isDown || this.keys.W.isDown,
      down: this.cursors.down.isDown || this.keys.S.isDown,
    });

    const seconds = Math.min(delta, MAX_FRAME_MS) / 1000;
    const step = PLAYER_SPEED * seconds;

    this.playerPosition = moveWithCollision(
      this.playerPosition,
      direction.x * step,
      direction.y * step,
      this.isSolid
    );
    this.drawPlayer();
  }

  // Shows the marker and prompt for the current target, or hides them.
  showTarget() {
    if (!this.target) {
      this.hideTarget();
      return;
    }

    const sprite = this.interactableSprites.get(this.target.id);
    this.marker.setPosition(
      sprite.x + sprite.width / 2,
      sprite.y - sprite.height - 2
    );
    this.marker.setVisible(true);
    this.prompt.show(`E  ${this.target.verb} ${this.target.name.toLowerCase()}`);
  }

  hideTarget() {
    this.marker.setVisible(false);
    this.prompt.hide();
  }

  // Called when the player interacts with an object: starts its dialogue.
  onInteract(interactable) {
    const session = startDialogue(
      interactable.dialogue,
      this.caseState,
      this.caseData
    );
    if (!session) return;

    this.dialogue = session;
    this.mode = MODE_DIALOGUE;
    this.hideTarget();
    this.dialogueBox.show(currentLine(session));
  }

  // --- Dialogue mode ------------------------------------------------------

  updateDialogue(pressed) {
    if (pressed.cancel) {
      this.closeDialogue();
    } else if (pressed.advance) {
      if (advanceDialogue(this.dialogue)) {
        this.dialogueBox.show(currentLine(this.dialogue));
      } else {
        this.closeDialogue();
      }
    }
  }

  closeDialogue() {
    this.dialogue = null;
    this.dialogueBox.hide();
    this.returnToExplore();
  }

  // --- Notebook mode ------------------------------------------------------

  openNotebook() {
    this.mode = MODE_NOTEBOOK;
    this.hideTarget();
    this.notebook.open(notebookTabs(this.caseData, this.caseState));
  }

  updateNotebook(pressed) {
    if (pressed.cancel || pressed.notebook) {
      this.notebook.close();
      this.returnToExplore();
    } else if (pressed.left) {
      this.notebook.changeTab(-1);
    } else if (pressed.right) {
      this.notebook.changeTab(1);
    }
  }

  returnToExplore() {
    this.mode = MODE_EXPLORE;
    this.showTarget();
  }

  // --- Drawing ------------------------------------------------------------

  drawPlayer() {
    const x = Math.round(this.playerPosition.x);
    const y = Math.round(this.playerPosition.y);
    this.player.setPosition(x, y);
    // Things lower on the screen are drawn in front of things higher up.
    this.player.setDepth(y);
  }

  drawRoom(rows) {
    rows.forEach((row, tileY) => {
      [...row].forEach((cell, tileX) => {
        const key = cell === '#' ? 'tile_wall' : 'tile_floor';
        this.add.image(tileX * TILE_SIZE, tileY * TILE_SIZE, key).setOrigin(0, 0);
      });
    });
  }

  // Draws each object with its bottom-left corner on the bottom-left corner
  // of its footprint.
  drawInteractables(interactables) {
    this.interactableSprites = new Map();
    for (const interactable of interactables) {
      const x = interactable.tileX * TILE_SIZE;
      const y = (interactable.tileY + interactable.heightTiles) * TILE_SIZE;
      // Flat objects the player can walk over stay on the floor, under the
      // player. Solid objects are sorted by their bottom edge, like the player.
      const sprite = this.add
        .image(x, y, interactable.texture)
        .setOrigin(0, 1)
        .setDepth(interactable.solid ? y : 1);
      this.interactableSprites.set(interactable.id, sprite);
    }
  }
}
