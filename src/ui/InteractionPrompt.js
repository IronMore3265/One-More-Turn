import { GAME_WIDTH, GAME_HEIGHT, PALETTE, UI_DEPTH } from '../config.js';
import { addText } from './text.js';

const PADDING_X = 6;
const PADDING_Y = 3;

// A thin strip along the bottom of the screen that shows what the player
// can interact with, for example "E  Inspect timetable".
export default class InteractionPrompt {
  constructor(scene) {
    this.panel = scene.add.graphics().setDepth(UI_DEPTH);
    this.text = addText(scene, PADDING_X, 0, '', PALETTE.paleAmber).setDepth(
      UI_DEPTH + 1
    );
    this.hide();
  }

  show(message) {
    this.text.setText(message);

    const height = Math.ceil(this.text.height) + PADDING_Y * 2;
    const top = GAME_HEIGHT - height;
    this.text.setY(top + PADDING_Y);

    this.panel.clear();
    this.panel.fillStyle(PALETTE.blackBlue);
    this.panel.fillRect(0, top, GAME_WIDTH, height);
    this.panel.fillStyle(PALETTE.slate); // One-pixel top border.
    this.panel.fillRect(0, top, GAME_WIDTH, 1);

    this.panel.setVisible(true);
    this.text.setVisible(true);
  }

  hide() {
    this.panel.setVisible(false);
    this.text.setVisible(false);
  }
}
