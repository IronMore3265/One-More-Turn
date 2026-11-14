import test from 'node:test';
import assert from 'node:assert/strict';

import {
  inputDirection,
  solidCheckFromRows,
  bodyHitsSolid,
  moveWithCollision,
} from '../src/systems/MovementSystem.js';

// A 7 x 6 room with one pillar. Tiles are 16 px; the collision box is
// 10 wide and 8 tall, sitting on the character's feet position.
const ROOM = [
  '#######',
  '#.....#',
  '#.....#',
  '#..#..#',
  '#.....#',
  '#######',
];
const isSolid = solidCheckFromRows(ROOM);

const NO_KEYS = { left: false, right: false, up: false, down: false };

// Walks in one direction for many small steps, like holding a key down.
function walk(start, dx, dy, steps) {
  let position = start;
  for (let i = 0; i < steps; i++) {
    position = moveWithCollision(position, dx, dy, isSolid);
  }
  return position;
}

test('no keys pressed gives no movement', () => {
  assert.deepEqual(inputDirection(NO_KEYS), { x: 0, y: 0 });
});

test('a single key gives a full-speed straight direction', () => {
  assert.deepEqual(inputDirection({ ...NO_KEYS, right: true }), { x: 1, y: 0 });
  assert.deepEqual(inputDirection({ ...NO_KEYS, up: true }), { x: 0, y: -1 });
});

test('opposite keys cancel out', () => {
  assert.deepEqual(
    inputDirection({ left: true, right: true, up: false, down: false }),
    { x: 0, y: 0 }
  );
});

test('diagonal movement is not faster than straight movement', () => {
  const direction = inputDirection({ ...NO_KEYS, right: true, down: true });
  const length = Math.hypot(direction.x, direction.y);
  assert.ok(Math.abs(length - 1) < 1e-9, `length was ${length}`);
});

test('anything outside the map is solid', () => {
  assert.equal(isSolid(-1, 0), true);
  assert.equal(isSolid(0, -1), true);
  assert.equal(isSolid(7, 2), true);
  assert.equal(isSolid(2, 6), true);
  assert.equal(isSolid(1, 1), false);
});

test('the collision box is at the feet, not the whole sprite', () => {
  // Feet just below the top wall: the 24 px sprite overlaps the wall tile,
  // but the 8 px box does not.
  assert.equal(bodyHitsSolid(40, 24, isSolid), false);
  // One pixel higher and the box enters the wall.
  assert.equal(bodyHitsSolid(40, 23, isSolid), true);
});

test('moves freely across open floor', () => {
  assert.deepEqual(moveWithCollision({ x: 40, y: 40 }, 3, 2, isSolid), {
    x: 43,
    y: 42,
  });
});

test('stops flush against a wall on the right', () => {
  const end = walk({ x: 40, y: 40 }, 1.5, 0, 200);
  assert.deepEqual(end, { x: 96 - 5, y: 40 }); // Wall starts at x = 96.
});

test('stops flush against a wall on the left', () => {
  const end = walk({ x: 40, y: 40 }, -1.5, 0, 200);
  assert.deepEqual(end, { x: 16 + 5, y: 40 }); // Wall ends at x = 16.
});

test('stops flush against a wall above', () => {
  const end = walk({ x: 40, y: 40 }, 0, -1.5, 200);
  assert.deepEqual(end, { x: 40, y: 16 + 8 }); // Wall ends at y = 16.
});

test('stops flush against a wall below', () => {
  const end = walk({ x: 40, y: 40 }, 0, 1.5, 200);
  assert.deepEqual(end, { x: 40, y: 80 }); // Wall starts at y = 80.
});

test('is blocked by a pillar in the middle of the room', () => {
  // Pillar tile (3, 3) covers x 48-64, y 48-64. Walk right into its side.
  const end = walk({ x: 24, y: 60 }, 1.5, 0, 200);
  assert.deepEqual(end, { x: 48 - 5, y: 60 });
});

test('slides along a wall when walking diagonally into it', () => {
  // Pressed against the right wall, moving right and down.
  const end = moveWithCollision({ x: 91, y: 40 }, 2, 2, isSolid);
  assert.deepEqual(end, { x: 91, y: 42 });
});

test('a very large step cannot jump over a wall', () => {
  const end = moveWithCollision({ x: 88, y: 40 }, 500, 0, isSolid);
  assert.deepEqual(end, { x: 91, y: 40 });
});

test('never ends up inside a solid tile, whatever the path', () => {
  // A fixed zig-zag of awkward fractional steps around the whole room.
  const steps = [
    [2.7, 1.3],
    [-3.1, 2.9],
    [1.9, -3.3],
    [-2.3, -1.7],
    [3.9, 3.9],
    [-0.7, 3.1],
  ];
  let position = { x: 40, y: 40 };
  for (let i = 0; i < 3000; i++) {
    const [dx, dy] = steps[i % steps.length];
    const turn = Math.floor(i / 250) % 2 === 0 ? 1 : -1;
    position = moveWithCollision(position, dx * turn, dy, isSolid);
    assert.equal(
      bodyHitsSolid(position.x, position.y, isSolid),
      false,
      `inside a wall at step ${i}: ${JSON.stringify(position)}`
    );
  }
});
