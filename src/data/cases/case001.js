// Case 001 - The Late Arrival (Halcyon Station). See plan.md sections 4 and 8.
//
// Cases are authored as data. The engine reads this file; nothing here
// should contain game logic.

export default {
  id: 'case001',
  title: 'The Late Arrival',
  location: 'Halcyon Station',

  map: {
    // TEMPORARY test room (20 x 15 tiles = 320 x 240). It will be replaced by
    // the five-area Halcyon Station layout.
    //   # = wall    . = floor
    rows: [
      '####################',
      '####################',
      '#..................#',
      '#..................#',
      '#..................#',
      '#.....####.........#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#............#.....#',
      '#............#.....#',
      '#............#.....#',
      '#..................#',
      '#..................#',
      '####################',
    ],
    // The tile the player starts on.
    spawn: { tileX: 9, tileY: 8 },
  },

  // Objects the player can interact with.
  //
  //   id            Stable ID. Dialogue, evidence and conditions refer to this.
  //   name, verb    Shown in the interaction prompt ("Inspect timetable").
  //   texture       Texture key for the sprite.
  //   tileX, tileY  Top-left tile of the footprint (the floor area it covers).
  //   widthTiles, heightTiles
  //                 Size of the footprint. The sprite is drawn with its bottom
  //                 edge on the bottom of the footprint, so a tall sprite
  //                 rises above its footprint.
  //   solid         True if the footprint blocks movement.
  //   description   PLACEHOLDER text shown on interaction until the dialogue
  //                 and evidence systems exist.
  interactables: [
    {
      id: 'C001_TERMINAL_INSPECT',
      name: 'Terminal',
      verb: 'Inspect',
      texture: 'prop_terminal',
      tileX: 2,
      tileY: 2,
      widthTiles: 2,
      heightTiles: 1,
      solid: true,
      description:
        'CASE 001. Deviation: passenger Elias did not board the 08:45 departure.',
    },
    {
      id: 'C001_TIMETABLE_INSPECT',
      name: 'Timetable',
      verb: 'Inspect',
      texture: 'prop_timetable',
      tileX: 12,
      tileY: 2,
      widthTiles: 1,
      heightTiles: 1,
      solid: true,
      description: 'Platform 1. Next departure: 08:45.',
    },
    {
      id: 'C001_PAYPHONE_USE',
      name: 'Payphone',
      verb: 'Use',
      texture: 'prop_payphone',
      tileX: 17,
      tileY: 2,
      widthTiles: 1,
      heightTiles: 1,
      solid: true,
      description:
        'A card by the phone reads: "Lost someone? Ask at the entrance."',
    },
    {
      id: 'C001_TICKET_INSPECT',
      name: 'Ticket',
      verb: 'Inspect',
      texture: 'prop_ticket',
      tileX: 4,
      tileY: 9,
      widthTiles: 1,
      heightTiles: 1,
      solid: false,
      description: 'A single ticket for the 08:45. Issued 08:38 to Elias.',
    },
    {
      id: 'C001_BAG_INSPECT',
      name: 'Bag',
      verb: 'Inspect',
      texture: 'prop_bag',
      tileX: 16,
      tileY: 10,
      widthTiles: 1,
      heightTiles: 1,
      solid: true,
      description: 'A small dropped bag. The name tag says "Niko".',
    },
  ],
};
