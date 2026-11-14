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
    this.createTiles();
    this.createAuditor();
    this.createProps();
    this.createUi();
    this.scene.start('CaseScene');
  }

  // Draws a texture in code. draw(g) receives a Graphics object.
  makeTexture(key, width, height, draw) {
    const g = this.make.graphics({ add: false });
    draw(g);
    g.generateTexture(key, width, height);
    g.destroy();
  }

  createTiles() {
    this.makeTexture('tile_floor', TILE_SIZE, TILE_SIZE, (g) => {
      g.fillStyle(PALETTE.slate);
      g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      // One-pixel seam on the right and bottom so the tile grid is visible.
      g.fillStyle(PALETTE.charcoal);
      g.fillRect(TILE_SIZE - 1, 0, 1, TILE_SIZE);
      g.fillRect(0, TILE_SIZE - 1, TILE_SIZE, 1);
    });

    this.makeTexture('tile_wall', TILE_SIZE, TILE_SIZE, (g) => {
      g.fillStyle(PALETTE.charcoal);
      g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(PALETTE.slate); // Top highlight.
      g.fillRect(0, 0, TILE_SIZE, 1);
      g.fillStyle(PALETTE.blackBlue); // Bottom shadow.
      g.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
    });
  }

  // Time Auditor placeholder: a 16 x 24 block with a small amber ID detail.
  createAuditor() {
    this.makeTexture('auditor', CHARACTER_WIDTH, CHARACTER_HEIGHT, (g) => {
      g.fillStyle(PALETTE.deepNavy); // Outline.
      g.fillRect(2, 0, 12, CHARACTER_HEIGHT);
      g.fillStyle(PALETTE.paleTeal); // Body.
      g.fillRect(3, 1, 10, CHARACTER_HEIGHT - 2);
      g.fillStyle(PALETTE.warmCream); // Head.
      g.fillRect(4, 2, 8, 7);
      g.fillStyle(PALETTE.amber); // ID badge.
      g.fillRect(9, 12, 2, 2);
    });
  }

  // Prop placeholders, at the sizes listed in plan.md section 9.5.
  createProps() {
    // Terminal, 32 x 32: dark block with a screen.
    this.makeTexture('prop_terminal', 32, 32, (g) => {
      g.fillStyle(PALETTE.blackBlue);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(PALETTE.charcoal);
      g.fillRect(1, 1, 30, 30);
      g.fillStyle(PALETTE.mutedTeal); // Screen.
      g.fillRect(4, 4, 24, 13);
      g.fillStyle(PALETTE.paleTeal); // Lines of text on the screen.
      g.fillRect(6, 7, 14, 1);
      g.fillRect(6, 10, 18, 1);
      g.fillRect(6, 13, 10, 1);
      g.fillStyle(PALETTE.slate); // Keyboard.
      g.fillRect(5, 21, 22, 6);
    });

    // Timetable, 16 x 32: cream board with dark lines, on a post.
    this.makeTexture('prop_timetable', 16, 32, (g) => {
      g.fillStyle(PALETTE.deepNavy);
      g.fillRect(0, 0, 16, 24);
      g.fillStyle(PALETTE.warmCream);
      g.fillRect(1, 1, 14, 22);
      g.fillStyle(PALETTE.charcoal);
      for (let y = 4; y <= 19; y += 3) {
        g.fillRect(3, y, 10, 1);
      }
      g.fillRect(6, 24, 4, 8); // Post.
    });

    // Payphone, 16 x 32: grey box with a handset and keypad.
    this.makeTexture('prop_payphone', 16, 32, (g) => {
      g.fillStyle(PALETTE.blackBlue);
      g.fillRect(1, 2, 14, 30);
      g.fillStyle(PALETTE.lightGrey);
      g.fillRect(2, 3, 12, 28);
      g.fillStyle(PALETTE.mutedTeal); // Sign at the top.
      g.fillRect(3, 4, 10, 4);
      g.fillStyle(PALETTE.charcoal); // Handset.
      g.fillRect(3, 10, 3, 12);
      g.fillStyle(PALETTE.slate); // Keypad.
      g.fillRect(8, 11, 5, 7);
      g.fillStyle(PALETTE.blackBlue); // Coin slot.
      g.fillRect(8, 22, 5, 1);
    });

    // Ticket, 16 x 16: a small cream slip lying on the floor.
    this.makeTexture('prop_ticket', 16, 16, (g) => {
      g.fillStyle(PALETTE.deepNavy);
      g.fillRect(3, 5, 10, 7);
      g.fillStyle(PALETTE.warmCream);
      g.fillRect(4, 6, 8, 5);
      g.fillStyle(PALETTE.charcoal);
      g.fillRect(5, 8, 5, 1);
    });

    // Dropped bag, 16 x 16: brown bag with a handle.
    this.makeTexture('prop_bag', 16, 16, (g) => {
      g.fillStyle(PALETTE.blackBlue);
      g.fillRect(5, 2, 6, 3); // Handle.
      g.fillRect(1, 5, 14, 11);
      g.fillStyle(PALETTE.darkBrown);
      g.fillRect(2, 6, 12, 9);
      g.fillStyle(PALETTE.warmCream); // Name tag.
      g.fillRect(9, 9, 3, 2);
    });
  }

  createUi() {
    // Amber marker shown above the object the player can interact with:
    // a small downward-pointing arrow.
    this.makeTexture('ui_marker', 7, 4, (g) => {
      g.fillStyle(PALETTE.amber);
      g.fillRect(0, 0, 7, 1);
      g.fillRect(1, 1, 5, 1);
      g.fillRect(2, 2, 3, 1);
      g.fillRect(3, 3, 1, 1);
    });
  }
}
