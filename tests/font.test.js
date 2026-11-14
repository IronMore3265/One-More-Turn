import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GLYPHS,
  FONT_CHARS,
  GLYPH_WIDTH,
  GLYPH_HEIGHT,
  unsupportedCharacters,
} from '../src/ui/pixelFont.js';
import case001 from '../src/data/cases/case001.js';

test('the font covers every printable ASCII character exactly once, in order', () => {
  let expected = '';
  for (let code = 32; code <= 126; code++) {
    expected += String.fromCharCode(code);
  }
  assert.equal(FONT_CHARS, expected);
});

test('every glyph is a 5 x 9 grid of filled and empty pixels', () => {
  for (const glyph of GLYPHS) {
    assert.equal(glyph.rows.length, GLYPH_HEIGHT, `"${glyph.char}" row count`);
    for (const row of glyph.rows) {
      assert.match(
        row,
        new RegExp(`^[.#]{${GLYPH_WIDTH}}$`),
        `"${glyph.char}" has a bad row: "${row}"`
      );
    }
  }
});

test('only the space is blank, and no two glyphs look the same', () => {
  const seen = new Map();
  for (const glyph of GLYPHS) {
    const shape = glyph.rows.join('\n');
    if (glyph.char !== ' ') {
      assert.ok(shape.includes('#'), `"${glyph.char}" is blank`);
    }
    assert.equal(
      seen.has(shape),
      false,
      `"${glyph.char}" looks the same as "${seen.get(shape)}"`
    );
    seen.set(shape, glyph.char);
  }
});

test('only the glyphs meant to hang below the line use the bottom two rows', () => {
  const hanging = GLYPHS.filter(
    (glyph) => glyph.rows[7].includes('#') || glyph.rows[8].includes('#')
  ).map((glyph) => glyph.char);
  assert.deepEqual(hanging, [',', ';', 'g', 'j', 'p', 'q', 'y']);
});

test('unsupportedCharacters finds characters the font cannot draw', () => {
  assert.deepEqual(unsupportedCharacters('Platform 1.\n08:45'), []);
  assert.deepEqual(unsupportedCharacters('café — “quoted”'), [
    'é',
    '—',
    '“',
    '”',
  ]);
});

test('all Case 001 text can be drawn by the font', () => {
  const texts = [case001.title, case001.location];
  for (const evidence of Object.values(case001.evidence)) {
    texts.push(evidence.name, evidence.description);
  }
  for (const fact of Object.values(case001.facts)) {
    texts.push(fact.text);
  }
  for (const item of case001.interactables) {
    texts.push(item.name, item.verb);
    for (const variant of item.dialogue) {
      for (const line of variant.lines) {
        texts.push(line.text, line.speaker ?? '');
      }
    }
  }

  for (const text of texts) {
    assert.deepEqual(
      unsupportedCharacters(text),
      [],
      `The font cannot draw part of: "${text}"`
    );
  }
});
