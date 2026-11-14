import { FONT_KEY } from './pixelFont.js';

// Shared text helper, so every panel uses the same font.

// Adds a text object to a scene, drawn in the game's pixel font.
//   colour     A palette number, for example PALETTE.warmCream.
//              Change it later with text.setTint(colour).
//   wrapWidth  Optional. Lines longer than this many pixels are wrapped.
export function addText(scene, x, y, content, colour, wrapWidth) {
  const text = scene.add.bitmapText(x, y, FONT_KEY, content).setTint(colour);
  if (wrapWidth) {
    text.setMaxWidth(wrapWidth);
  }
  return text;
}
