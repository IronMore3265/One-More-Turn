import { GAME_WIDTH, GAME_HEIGHT, PALETTE, UI_DEPTH } from '../config.js';

const PADDING_X = 6;
const PADDING_Y = 3;

// A text strip along the bottom of the screen. It shows the interaction
// prompt ("E  Inspect timetable") and, for now, the object's description.
export default class InteractionPrompt {
  constructor(scene) {
    this.panel = scene.add.graphics().setDepth(UI_DEPTH);
    this.text = scene.add
      .text(PADDING_X, 0, '', {
        fontFamily: 'monospace',
        fontSize: '8px',
        wordWrap: { width: GAME_WIDTH - PADDING_X * 2 },
      })
      .setDepth(UI_DEPTH + 1);
    this.hide();
  }

  // colour is a palette number such as PALETTE.paleAmber.
  show(message, colour = PALETTE.paleAmber) {
    this.text.setText(message);
    this.text.setColor('#' + colour.toString(16).padStart(6, '0'));

    // The strip grows upwards to fit the text.
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
