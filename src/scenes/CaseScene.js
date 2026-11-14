import { TILE_SIZE, PLAYER_SPEED } from '../config.js';
import {
  inputDirection,
  moveWithCollision,
  solidCheckFromRows,
} from '../systems/MovementSystem.js';

// Temporary test room: 20 x 15 tiles fills the 320 x 240 screen exactly.
//   # = wall    . = floor
// This will be replaced by the Halcyon Station map from the Case 001 data.
const TEST_ROOM = [
  '####################',
  '#..................#',
  '#..................#',
  '#..................#',
  '#.....####.........#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#............#.....#',
  '#............#.....#',
  '#............#.....#',
  '#..................#',
  '#..................#',
  '####################',
];

// If the browser stalls, one frame can report a very long delta. Capping it
// keeps a single step small.
const MAX_FRAME_MS = 50;

// Loads a case map, actors, interactions, and case state.
// For now it draws the test room and lets the player walk around it.
export default class CaseScene extends Phaser.Scene {
  constructor() {
    super('CaseScene');
  }

  create() {
    this.drawRoom(TEST_ROOM);
    this.isSolid = solidCheckFromRows(TEST_ROOM);

    // The exact position of the player's feet. It can hold fractions of a
    // pixel; the sprite is drawn at the nearest whole pixel.
    this.playerPosition = { x: 10 * TILE_SIZE, y: 8 * TILE_SIZE };

    // Bottom-centre origin: the sprite's position is where the feet are.
    this.player = this.add.image(0, 0, 'auditor').setOrigin(0.5, 1);
    this.drawPlayer();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
  }

  update(time, delta) {
    const direction = inputDirection({
      left: this.cursors.left.isDown || this.wasd.A.isDown,
      right: this.cursors.right.isDown || this.wasd.D.isDown,
      up: this.cursors.up.isDown || this.wasd.W.isDown,
      down: this.cursors.down.isDown || this.wasd.S.isDown,
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

  drawPlayer() {
    this.player.setPosition(
      Math.round(this.playerPosition.x),
      Math.round(this.playerPosition.y)
    );
  }

  drawRoom(rows) {
    rows.forEach((row, tileY) => {
      [...row].forEach((cell, tileX) => {
        const key = cell === '#' ? 'tile_wall' : 'tile_floor';
        this.add.image(tileX * TILE_SIZE, tileY * TILE_SIZE, key).setOrigin(0, 0);
      });
    });
  }
}
