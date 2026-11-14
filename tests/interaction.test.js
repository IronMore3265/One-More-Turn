import test from 'node:test';
import assert from 'node:assert/strict';

import { INTERACT_RANGE } from '../src/config.js';
import {
  footprintRect,
  distanceToRect,
  findNearestInteractable,
} from '../src/systems/InteractionSystem.js';
import {
  solidCheckFromFootprints,
  solidCheckFromRows,
  bodyHitsSolid,
} from '../src/systems/MovementSystem.js';
import case001 from '../src/data/cases/case001.js';

// Tiles are 16 px. The player's position is the feet point; distance is
// measured from the centre of the 10 x 8 collision box, 4 px above it.
const crate = {
  id: 'CRATE',
  tileX: 2,
  tileY: 2,
  widthTiles: 1,
  heightTiles: 1,
  solid: true,
}; // Covers x 32-48, y 32-48.
const wideDesk = {
  id: 'DESK',
  tileX: 5,
  tileY: 2,
  widthTiles: 2,
  heightTiles: 1,
  solid: true,
}; // Covers x 80-112, y 32-48.
const paper = {
  id: 'PAPER',
  tileX: 2,
  tileY: 5,
  widthTiles: 1,
  heightTiles: 1,
  solid: false,
}; // Covers x 32-48, y 80-96.
const objects = [crate, wideDesk, paper];

test('footprintRect converts tiles to pixels', () => {
  assert.deepEqual(footprintRect(wideDesk), {
    left: 80,
    top: 32,
    right: 112,
    bottom: 48,
  });
});

test('distanceToRect is zero inside and measured to the nearest edge outside', () => {
  const rect = footprintRect(crate);
  assert.equal(distanceToRect(40, 40, rect), 0);
  assert.equal(distanceToRect(40, 58, rect), 10); // Straight below.
  assert.equal(distanceToRect(20, 40, rect), 12); // Straight left.
  assert.equal(distanceToRect(51, 52, rect), 5); // Diagonal: 3 right, 4 down.
});

test('finds an object the player is standing flush against', () => {
  // Flush below the crate: feet at y = 48 + 8.
  assert.equal(findNearestInteractable({ x: 40, y: 56 }, objects), crate);
  // Flush to its left: box right edge on x = 32.
  assert.equal(findNearestInteractable({ x: 27, y: 44 }, objects), crate);
});

test('finds nothing when the player is out of range', () => {
  assert.equal(findNearestInteractable({ x: 64, y: 120 }, objects), null);
});

test('the range limit is inclusive and exact', () => {
  // Box centre is 4 px above the feet, so feet at 48 + RANGE + 4 puts the
  // centre exactly RANGE below the crate.
  const edge = 48 + INTERACT_RANGE + 4;
  assert.equal(findNearestInteractable({ x: 40, y: edge }, objects), crate);
  assert.equal(findNearestInteractable({ x: 40, y: edge + 1 }, objects), null);
});

test('picks the nearer of two objects in range', () => {
  const left = { ...crate, id: 'LEFT', tileX: 2 }; // x 32-48
  const right = { ...crate, id: 'RIGHT', tileX: 4 }; // x 64-80
  const pair = [left, right];
  // Standing in the 16 px gap between them, below their row.
  assert.equal(findNearestInteractable({ x: 52, y: 52 }, pair).id, 'LEFT');
  assert.equal(findNearestInteractable({ x: 60, y: 52 }, pair).id, 'RIGHT');
});

test('a walk-over object is found while standing on it', () => {
  assert.equal(findNearestInteractable({ x: 40, y: 92 }, objects), paper);
});

test('an empty list of objects finds nothing', () => {
  assert.equal(findNearestInteractable({ x: 40, y: 56 }, []), null);
});

test('solid footprints block movement; walk-over ones do not', () => {
  const isSolid = solidCheckFromFootprints(objects);
  assert.equal(isSolid(2, 2), true); // Crate.
  assert.equal(isSolid(5, 2), true); // Desk, left tile.
  assert.equal(isSolid(6, 2), true); // Desk, right tile.
  assert.equal(isSolid(7, 2), false); // Just past the desk.
  assert.equal(isSolid(2, 5), false); // Paper is not solid.
  assert.equal(isSolid(0, 0), false);
});

// --- Case 001 data checks -------------------------------------------------

test('Case 001 has the five core interactables with unique IDs', () => {
  const ids = case001.interactables.map((item) => item.id);
  assert.deepEqual([...ids].sort(), [
    'C001_BAG_INSPECT',
    'C001_PAYPHONE_USE',
    'C001_TERMINAL_INSPECT',
    'C001_TICKET_INSPECT',
    'C001_TIMETABLE_INSPECT',
  ]);
});

test('every Case 001 interactable sits on floor tiles and has prompt text', () => {
  const wallAt = solidCheckFromRows(case001.map.rows);
  for (const item of case001.interactables) {
    for (let y = item.tileY; y < item.tileY + item.heightTiles; y++) {
      for (let x = item.tileX; x < item.tileX + item.widthTiles; x++) {
        assert.equal(wallAt(x, y), false, `${item.id} overlaps a wall at ${x},${y}`);
      }
    }
    assert.ok(item.name && item.verb && item.texture, `${item.id} is missing a field`);
    assert.ok(item.description.length > 0, `${item.id} has no description`);
  }
});

test('Case 001 interactable footprints do not overlap each other', () => {
  const seen = new Map();
  for (const item of case001.interactables) {
    for (let y = item.tileY; y < item.tileY + item.heightTiles; y++) {
      for (let x = item.tileX; x < item.tileX + item.widthTiles; x++) {
        const key = `${x},${y}`;
        assert.equal(seen.has(key), false, `${item.id} overlaps ${seen.get(key)}`);
        seen.set(key, item.id);
      }
    }
  }
});

test('the Case 001 spawn point is on open floor', () => {
  const { rows, spawn } = case001.map;
  const wallAt = solidCheckFromRows(rows);
  const objectAt = solidCheckFromFootprints(case001.interactables);
  const isSolid = (x, y) => wallAt(x, y) || objectAt(x, y);
  const feet = { x: spawn.tileX * 16 + 8, y: (spawn.tileY + 1) * 16 };
  assert.equal(bodyHitsSolid(feet.x, feet.y, isSolid), false);
});
