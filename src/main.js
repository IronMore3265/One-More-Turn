import { GAME_WIDTH, GAME_HEIGHT, PALETTE } from './config.js';
import BootScene from './scenes/BootScene.js';
import CaseScene from './scenes/CaseScene.js';

// The game always renders at 320 x 240. The canvas is then enlarged by the
// biggest whole-number factor that fits the window, so every game pixel
// covers the same number of screen pixels (no blurry or uneven pixels).
function integerZoom() {
  const dpr = window.devicePixelRatio || 1;
  const fit = Math.min(
    (window.innerWidth * dpr) / GAME_WIDTH,
    (window.innerHeight * dpr) / GAME_HEIGHT
  );
  return Math.max(1, Math.floor(fit)) / dpr;
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: PALETTE.blackBlue,
  pixelArt: true, // Nearest-neighbour filtering, no anti-aliasing.
  scale: {
    mode: Phaser.Scale.NONE,
    zoom: integerZoom(),
  },
  scene: [BootScene, CaseScene],
});

window.addEventListener('resize', () => {
  game.scale.setZoom(integerZoom());
});
