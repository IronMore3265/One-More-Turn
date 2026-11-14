import { TILE_SIZE } from '../config.js';

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

// Loads a case map, actors, interactions, and case state.
// For now it only draws the test room and a placeholder player.
export default class CaseScene extends Phaser.Scene {
  constructor() {
    super('CaseScene');
  }

  create() {
    this.drawRoom(TEST_ROOM);

    // Bottom-centre origin: the player's position is where their feet are.
    this.player = this.add.image(10 * TILE_SIZE, 8 * TILE_SIZE, 'auditor');
    this.player.setOrigin(0.5, 1);
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
