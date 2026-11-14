import { TILE_SIZE, PLAYER_SPEED, PALETTE, UI_DEPTH } from '../config.js';
import case001 from '../data/cases/case001.js';
import {
  inputDirection,
  moveWithCollision,
  solidCheckFromRows,
  solidCheckFromFootprints,
} from '../systems/MovementSystem.js';
import { findNearestInteractable } from '../systems/InteractionSystem.js';
import InteractionPrompt from '../ui/InteractionPrompt.js';

// If the browser stalls, one frame can report a very long delta. Capping it
// keeps a single step small.
const MAX_FRAME_MS = 50;

// Loads a case map, actors, interactions, and case state.
// For now it always loads Case 001.
export default class CaseScene extends Phaser.Scene {
  constructor() {
    super('CaseScene');
  }

  create() {
    this.caseData = case001;
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

    // The interactable currently in range (or null), its marker and prompt.
    this.target = null;
    this.marker = this.add
      .image(0, 0, 'ui_marker')
      .setOrigin(0.5, 1)
      .setDepth(UI_DEPTH - 1)
      .setVisible(false);
    this.prompt = new InteractionPrompt(this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE');
  }

  update(time, delta) {
    this.updateMovement(delta);
    this.updateInteraction();
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

  updateInteraction() {
    const target = findNearestInteractable(
      this.playerPosition,
      this.caseData.interactables
    );
    if (target !== this.target) {
      this.target = target;
      this.showTarget();
    }

    const pressed =
      Phaser.Input.Keyboard.JustDown(this.keys.E) ||
      Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    if (pressed && this.target) {
      this.onInteract(this.target);
    }
  }

  // Shows the marker and prompt for the current target, or hides them.
  showTarget() {
    if (!this.target) {
      this.marker.setVisible(false);
      this.prompt.hide();
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

  // Called when the player interacts with an object.
  // PLACEHOLDER: shows the description text. The dialogue and evidence
  // systems will take over from here.
  onInteract(interactable) {
    this.prompt.show(interactable.description, PALETTE.warmCream);
  }

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
