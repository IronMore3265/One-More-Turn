import { GAME_WIDTH, GAME_HEIGHT, PALETTE, UI_DEPTH } from '../config.js';
import { addText } from './text.js';

const MARGIN = 4; // Gap between the box and the screen edge.
const PADDING = 6; // Gap between the box edge and the text.
const BOX_HEIGHT = 52;
const SPEAKER_HEIGHT = 11; // Vertical space taken by the speaker name.

const BOX_X = MARGIN;
const BOX_Y = GAME_HEIGHT - MARGIN - BOX_HEIGHT;
const BOX_WIDTH = GAME_WIDTH - MARGIN * 2;

const DEPTH = UI_DEPTH + 10;

// The dialogue box near the bottom of the screen. It only draws a line;
// choosing and stepping through lines is done by systems/DialogueSystem.js.
export default class DialogueBox {
  constructor(scene) {
    this.panel = scene.add.graphics().setDepth(DEPTH);
    this.panel.fillStyle(PALETTE.slate); // Border.
    this.panel.fillRect(BOX_X, BOX_Y, BOX_WIDTH, BOX_HEIGHT);
    this.panel.fillStyle(PALETTE.blackBlue);
    this.panel.fillRect(BOX_X + 1, BOX_Y + 1, BOX_WIDTH - 2, BOX_HEIGHT - 2);

    this.speaker = addText(
      scene,
      BOX_X + PADDING,
      BOX_Y + PADDING - 2,
      '',
      PALETTE.amber
    ).setDepth(DEPTH + 1);

    this.body = addText(
      scene,
      BOX_X + PADDING,
      0,
      '',
      PALETTE.warmCream,
      BOX_WIDTH - PADDING * 2
    ).setDepth(DEPTH + 1);

    // Small arrow in the corner: "press Enter to continue".
    this.arrow = scene.add
      .image(BOX_X + BOX_WIDTH - PADDING, BOX_Y + BOX_HEIGHT - 4, 'ui_marker')
      .setOrigin(1, 1)
      .setDepth(DEPTH + 1);

    this.hide();
  }

  // line is { speaker?, text, notice? } from the case data.
  show(line) {
    this.speaker.setText(line.speaker ?? '');
    this.body.setText(line.text);
    // Notebook notices are tinted so they stand apart from the story text.
    this.body.setTint(line.notice ? PALETTE.paleAmber : PALETTE.warmCream);
    // Without a speaker name, the text starts at the top of the box.
    const top = BOX_Y + PADDING - 2;
    this.body.setY(line.speaker ? top + SPEAKER_HEIGHT : top);

    this.setVisible(true);
  }

  hide() {
    this.setVisible(false);
  }

  setVisible(visible) {
    this.panel.setVisible(visible);
    this.speaker.setVisible(visible);
    this.body.setVisible(visible);
    this.arrow.setVisible(visible);
  }
}
