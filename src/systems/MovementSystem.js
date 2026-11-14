import { TILE_SIZE, BODY_WIDTH, BODY_HEIGHT } from '../config.js';

// Movement and wall collision.
//
// These are plain functions with no Phaser dependency, so they can be unit
// tested with Node (see tests/movement.test.js).
//
// A character's position is the bottom-centre of its sprite (its feet).
// Its collision box is BODY_WIDTH x BODY_HEIGHT, sitting on that point:
//
//        left = x - BODY_WIDTH / 2      right  = x + BODY_WIDTH / 2
//        top  = y - BODY_HEIGHT         bottom = y

const HALF_WIDTH = BODY_WIDTH / 2;

// One step must be shorter than a tile, or a character could jump over a wall.
const MAX_STEP = TILE_SIZE - 1;

// Turns pressed keys into a direction. Opposite keys cancel out, and
// diagonals are shortened so they are not faster than straight lines.
//   keys: { left, right, up, down } (booleans)
export function inputDirection(keys) {
  let x = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  let y = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
  if (x !== 0 && y !== 0) {
    x *= Math.SQRT1_2;
    y *= Math.SQRT1_2;
  }
  return { x, y };
}

// Builds an isSolid(tileX, tileY) function from map rows such as '#..#'.
// Only '.' is walkable. Anything outside the map counts as solid.
export function solidCheckFromRows(rows) {
  return (tileX, tileY) => {
    const row = rows[tileY];
    return row === undefined || row[tileX] !== '.';
  };
}

// Builds an isSolid(tileX, tileY) function from objects that have a
// footprint: { tileX, tileY, widthTiles, heightTiles, solid }.
// Objects with solid: false do not block movement.
export function solidCheckFromFootprints(objects) {
  const solidTiles = new Set();
  for (const object of objects) {
    if (!object.solid) continue;
    for (let y = object.tileY; y < object.tileY + object.heightTiles; y++) {
      for (let x = object.tileX; x < object.tileX + object.widthTiles; x++) {
        solidTiles.add(`${x},${y}`);
      }
    }
  }
  return (tileX, tileY) => solidTiles.has(`${tileX},${tileY}`);
}

// True if the collision box of a character standing at (x, y) overlaps a
// solid tile.
export function bodyHitsSolid(x, y, isSolid) {
  const firstTileX = Math.floor((x - HALF_WIDTH) / TILE_SIZE);
  const lastTileX = Math.ceil((x + HALF_WIDTH) / TILE_SIZE) - 1;
  const firstTileY = Math.floor((y - BODY_HEIGHT) / TILE_SIZE);
  const lastTileY = Math.ceil(y / TILE_SIZE) - 1;

  for (let tileY = firstTileY; tileY <= lastTileY; tileY++) {
    for (let tileX = firstTileX; tileX <= lastTileX; tileX++) {
      if (isSolid(tileX, tileY)) return true;
    }
  }
  return false;
}

// Moves a character by (dx, dy) pixels and returns the new { x, y }.
//
// Each axis is moved separately. If an axis is blocked, the character stops
// flush against the wall on that axis but keeps moving on the other one, so
// walking diagonally into a wall slides along it.
export function moveWithCollision(position, dx, dy, isSolid) {
  let { x, y } = position;
  dx = clampStep(dx);
  dy = clampStep(dy);

  if (dx !== 0) {
    const nextX = x + dx;
    if (!bodyHitsSolid(nextX, y, isSolid)) {
      x = nextX;
    } else if (dx > 0) {
      // Blocked on the right: put the box's right edge on the wall's left edge.
      const wallTileX = Math.ceil((nextX + HALF_WIDTH) / TILE_SIZE) - 1;
      x = wallTileX * TILE_SIZE - HALF_WIDTH;
    } else {
      // Blocked on the left: put the box's left edge on the wall's right edge.
      const wallTileX = Math.floor((nextX - HALF_WIDTH) / TILE_SIZE);
      x = (wallTileX + 1) * TILE_SIZE + HALF_WIDTH;
    }
  }

  if (dy !== 0) {
    const nextY = y + dy;
    if (!bodyHitsSolid(x, nextY, isSolid)) {
      y = nextY;
    } else if (dy > 0) {
      // Blocked below: put the box's bottom edge on the wall's top edge.
      const wallTileY = Math.ceil(nextY / TILE_SIZE) - 1;
      y = wallTileY * TILE_SIZE;
    } else {
      // Blocked above: put the box's top edge on the wall's bottom edge.
      const wallTileY = Math.floor((nextY - BODY_HEIGHT) / TILE_SIZE);
      y = (wallTileY + 1) * TILE_SIZE + BODY_HEIGHT;
    }
  }

  return { x, y };
}

function clampStep(step) {
  return Math.max(-MAX_STEP, Math.min(MAX_STEP, step));
}
