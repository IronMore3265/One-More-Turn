import {
  TILE_SIZE,
  CHARACTER_WIDTH,
  CHARACTER_HEIGHT,
  PALETTE,
} from '../config.js';

// Loads assets and prepares global configuration.
//
// There are no art files yet, so this scene draws placeholder textures in
// code (plan.md section 9.8). When real PNGs exist, load them in preload()
// under the same texture keys and delete the matching placeholder.
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.createFloorTile();
    this.createWallTile();
    this.createAuditor();
    this.scene.start('CaseScene');
  }

  createFloorTile() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(PALETTE.slate);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    // One-pixel seam on the right and bottom edges so the tile grid is visible.
    g.fillStyle(PALETTE.charcoal);
    g.fillRect(TILE_SIZE - 1, 0, 1, TILE_SIZE);
    g.fillRect(0, TILE_SIZE - 1, TILE_SIZE, 1);
    g.generateTexture('tile_floor', TILE_SIZE, TILE_SIZE);
    g.destroy();
  }

  createWallTile() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(PALETTE.charcoal);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(PALETTE.slate); // Top highlight.
    g.fillRect(0, 0, TILE_SIZE, 1);
    g.fillStyle(PALETTE.blackBlue); // Bottom shadow.
    g.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
    g.generateTexture('tile_wall', TILE_SIZE, TILE_SIZE);
    g.destroy();
  }

  // Time Auditor placeholder: a 16 x 24 block with a small amber ID detail.
  createAuditor() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(PALETTE.deepNavy); // Outline.
    g.fillRect(2, 0, 12, CHARACTER_HEIGHT);
    g.fillStyle(PALETTE.paleTeal); // Body.
    g.fillRect(3, 1, 10, CHARACTER_HEIGHT - 2);
    g.fillStyle(PALETTE.warmCream); // Head.
    g.fillRect(4, 2, 8, 7);
    g.fillStyle(PALETTE.amber); // ID badge.
    g.fillRect(9, 12, 2, 2);
    g.generateTexture('auditor', CHARACTER_WIDTH, CHARACTER_HEIGHT);
    g.destroy();
  }
}
