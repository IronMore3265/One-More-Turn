// Shared constants. See plan.md section 9 for the art standard.

export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 240;
export const TILE_SIZE = 16;

export const CHARACTER_WIDTH = 16;
export const CHARACTER_HEIGHT = 24;

// Characters collide with a small box at their feet, not the whole sprite,
// so they can stand close in front of walls and props.
export const BODY_WIDTH = 10;
export const BODY_HEIGHT = 8;

export const PLAYER_SPEED = 64; // Pixels per second (4 tiles).

// Palette from plan.md section 9.2.
export const PALETTE = {
  deepNavy: 0x172333, // Outlines and shadows
  charcoal: 0x303943, // Walls and equipment
  slate: 0x52616a, // Secondary surfaces
  mutedTeal: 0x477c7a, // Station details
  paleTeal: 0x83aaa0, // Highlights
  amber: 0xe0a84a, // Important information
  paleAmber: 0xf3d28a, // UI emphasis
  mutedRed: 0xa84f4f, // Deviations and warnings
  warmCream: 0xd9d0b8, // Paper and signage
  lightGrey: 0xa8adb0, // Metal and neutral details
  darkBrown: 0x59463c, // Bag and wood
  blackBlue: 0x101820, // Deepest outline
};
