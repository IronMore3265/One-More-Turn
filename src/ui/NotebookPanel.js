import { GAME_WIDTH, GAME_HEIGHT, PALETTE, UI_DEPTH } from '../config.js';
import { addText } from './text.js';

const MARGIN = 8; // Gap between the panel and the screen edge.
const PADDING = 8; // Gap between the panel edge and its contents.

const PANEL_X = MARGIN;
const PANEL_Y = MARGIN;
const PANEL_WIDTH = GAME_WIDTH - MARGIN * 2;
const PANEL_HEIGHT = GAME_HEIGHT - MARGIN * 2;

const TITLE_Y = PANEL_Y + PADDING - 2;
const TABS_Y = TITLE_Y + 13;
const BODY_Y = TABS_Y + 16;
const FOOTER_Y = PANEL_Y + PANEL_HEIGHT - PADDING - 8;
const TAB_GAP = 12;

const DEPTH = UI_DEPTH + 10;

// The notebook: a full-screen panel with one tab per kind of knowledge.
// It only draws what it is given; the contents come from
// systems/NotebookSystem.js (notebookTabs).
export default class NotebookPanel {
  constructor(scene) {
    this.scene = scene;
    this.tabs = [];
    this.tabLabels = [];
    this.activeTab = 0;

    this.panel = scene.add.graphics().setDepth(DEPTH);
    this.panel.fillStyle(PALETTE.slate); // Border.
    this.panel.fillRect(PANEL_X, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
    this.panel.fillStyle(PALETTE.blackBlue);
    this.panel.fillRect(PANEL_X + 1, PANEL_Y + 1, PANEL_WIDTH - 2, PANEL_HEIGHT - 2);
    this.panel.fillStyle(PALETTE.slate); // Line under the tabs.
    this.panel.fillRect(PANEL_X + PADDING, BODY_Y - 5, PANEL_WIDTH - PADDING * 2, 1);

    const textX = PANEL_X + PADDING;
    this.title = addText(scene, textX, TITLE_Y, 'NOTEBOOK', PALETTE.amber);
    this.body = addText(
      scene,
      textX,
      BODY_Y,
      '',
      PALETTE.warmCream,
      PANEL_WIDTH - PADDING * 2
    );
    this.footer = addText(
      scene,
      textX,
      FOOTER_Y,
      'Left / Right: change tab     J or Esc: close',
      PALETTE.lightGrey
    );
    for (const text of [this.title, this.body, this.footer]) {
      text.setDepth(DEPTH + 1);
    }

    this.close();
  }

  // tabs: [{ title, emptyText, entries: [{ title?, text }] }]
  open(tabs) {
    this.tabs = tabs;
    if (this.activeTab >= tabs.length) this.activeTab = 0;

    // One label per tab, laid out left to right.
    this.destroyTabLabels();
    let x = PANEL_X + PADDING;
    for (const tab of tabs) {
      // Padded with a space each side: render() swaps these for [brackets]
      // on the active tab, so the label keeps the same width.
      const label = addText(this.scene, x, TABS_Y, ` ${tab.title} `, PALETTE.lightGrey);
      label.setDepth(DEPTH + 1);
      this.tabLabels.push(label);
      x += label.width + TAB_GAP;
    }

    this.isOpen = true;
    this.setVisible(true);
    this.render();
  }

  close() {
    this.isOpen = false;
    this.destroyTabLabels();
    this.setVisible(false);
  }

  // direction: +1 for the next tab, -1 for the previous one. Wraps around.
  changeTab(direction) {
    const count = this.tabs.length;
    this.activeTab = (this.activeTab + direction + count) % count;
    this.render();
  }

  render() {
    this.tabLabels.forEach((label, index) => {
      const active = index === this.activeTab;
      label.setTint(active ? PALETTE.paleAmber : PALETTE.lightGrey);
      label.setText(active ? `[${this.tabs[index].title}]` : ` ${this.tabs[index].title} `);
    });

    const tab = this.tabs[this.activeTab];
    if (tab.entries.length === 0) {
      this.body.setText(tab.emptyText);
      return;
    }
    // Entries with a title show it in capitals above the text.
    // Entries without one are shown as a bulleted list.
    const blocks = tab.entries.map((entry) =>
      entry.title ? `${entry.title.toUpperCase()}\n${entry.text}` : `- ${entry.text}`
    );
    this.body.setText(blocks.join('\n\n'));
  }

  destroyTabLabels() {
    this.tabLabels.forEach((label) => label.destroy());
    this.tabLabels = [];
  }

  setVisible(visible) {
    this.panel.setVisible(visible);
    this.title.setVisible(visible);
    this.body.setVisible(visible);
    this.footer.setVisible(visible);
  }
}
