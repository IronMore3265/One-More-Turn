import { TILE_SIZE, BODY_HEIGHT, INTERACT_RANGE } from '../config.js';

// Nearby object detection.
//
// Plain functions with no Phaser dependency, so they can be unit tested
// with Node (see tests/interaction.test.js).

// The floor area an object covers, in pixels.
export function footprintRect(object) {
  return {
    left: object.tileX * TILE_SIZE,
    top: object.tileY * TILE_SIZE,
    right: (object.tileX + object.widthTiles) * TILE_SIZE,
    bottom: (object.tileY + object.heightTiles) * TILE_SIZE,
  };
}

// Distance in pixels from a point to the nearest edge of a rectangle.
// Zero if the point is inside it.
export function distanceToRect(x, y, rect) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

// Returns the closest interactable within range of the player, or null.
// Distance is measured from the centre of the player's collision box
// (position is the feet point, see MovementSystem.js) to the footprint.
export function findNearestInteractable(
  position,
  interactables,
  range = INTERACT_RANGE
) {
  const centreX = position.x;
  const centreY = position.y - BODY_HEIGHT / 2;

  let nearest = null;
  let nearestDistance = Infinity;
  for (const interactable of interactables) {
    const distance = distanceToRect(
      centreX,
      centreY,
      footprintRect(interactable)
    );
    if (distance <= range && distance < nearestDistance) {
      nearest = interactable;
      nearestDistance = distance;
    }
  }
  return nearest;
}
