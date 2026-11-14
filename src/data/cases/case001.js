// Case 001 - The Late Arrival (Halcyon Station). See plan.md sections 4 and 8.
//
// Cases are authored as data. The engine reads this file; nothing here
// should contain game logic.
//
// NOTE: all dialogue, evidence and fact wording below is first-draft
// placeholder text, written from plan.md. It is awaiting a narrative pass.

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

  // Evidence: physical or documentary things. Shown in the notebook's
  // Evidence tab. Survives a rewind.
  evidence: {
    E001_TICKET: {
      name: 'Ticket',
      description: 'Single ticket for the 08:45 departure. Issued at 08:38 to Elias.',
    },
    E001_DROPPED_BAG: {
      name: 'Dropped bag',
      description: 'A small bag left on the floor. The name tag reads NIKO.',
    },
    E001_STAFF_NOTICE: {
      name: 'Staff notice',
      description:
        'Taped beside the payphone. Staff will watch the entrance for a separated companion, on request.',
    },
  },

  // Facts: things the player has learned. Shown in the notebook's
  // Observations tab. Survives a rewind.
  facts: {
    F001_OFFICIAL_DEVIATION: {
      text: 'The official record lists one deviation: Elias did not board the 08:45.',
    },
    F001_DEPARTURE_0845: {
      text: 'The train leaves Platform 1 at 08:45.',
    },
    F001_ELIAS_JOURNEY: {
      text: 'Elias bought his ticket at 08:38. He meant to be on the 08:45.',
    },
    F001_NIKO_BAG: {
      text: 'Someone called Niko dropped a bag and did not come back for it.',
    },
    F001_STAFF_CAN_WATCH_ENTRANCE: {
      text: 'Station staff will watch the entrance for a separated companion, if someone asks.',
    },
    F001_BAG_NOT_RECORDED: {
      text: 'The official record has no entry for the dropped bag.',
    },
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
  //   dialogue      List of variants. The first whose condition is true is
  //                 used, so the last one should have no condition.
  //                 See systems/DialogueSystem.js and systems/CaseState.js.
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
      dialogue: [
        {
          // The player knows about the bag and checks the record for it.
          condition: {
            all: [
              { hasFact: 'F001_OFFICIAL_DEVIATION' },
              { hasEvidence: 'E001_DROPPED_BAG' },
              { not: { hasFact: 'F001_BAG_NOT_RECORDED' } },
            ],
          },
          lines: [
            { speaker: 'TERMINAL', text: 'QUERY: dropped bag, Halcyon Station, 08:40.' },
            { speaker: 'TERMINAL', text: 'RESULT: No matching event in the approved record.' },
          ],
          effects: [{ addFact: 'F001_BAG_NOT_RECORDED' }],
        },
        {
          condition: { hasFact: 'F001_OFFICIAL_DEVIATION' },
          lines: [
            {
              speaker: 'TERMINAL',
              text: 'DEVIATION: Passenger Elias did not board the 08:45 departure. No further entries.',
            },
          ],
        },
        {
          lines: [
            { speaker: 'TERMINAL', text: 'CASE 001. THE LATE ARRIVAL. Halcyon Station.' },
            {
              speaker: 'TERMINAL',
              text: 'DEVIATION: Passenger Elias did not board the 08:45 departure.',
            },
            {
              speaker: 'TERMINAL',
              text: 'ASSIGNMENT: Establish the cause. Restore the approved sequence.',
            },
          ],
          effects: [{ addFact: 'F001_OFFICIAL_DEVIATION' }],
        },
      ],
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
      dialogue: [
        {
          condition: { hasFact: 'F001_DEPARTURE_0845' },
          lines: [{ text: 'Platform 1. 08:45. On time.' }],
        },
        {
          lines: [
            { text: 'DEPARTURES. One line is underlined in pencil.' },
            { text: 'Platform 1. 08:45. On time.' },
          ],
          effects: [{ addFact: 'F001_DEPARTURE_0845' }],
        },
      ],
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
      dialogue: [
        {
          condition: { hasEvidence: 'E001_STAFF_NOTICE' },
          lines: [{ text: 'The line is dead. The notice is still taped beside it.' }],
        },
        {
          lines: [
            { text: 'The line is dead. A notice is taped beside the phone.' },
            {
              speaker: 'NOTICE',
              text: 'LOST OR SEPARATED? Station staff can watch the entrance for your companion. Please ask.',
            },
          ],
          effects: [
            { addEvidence: 'E001_STAFF_NOTICE' },
            { addFact: 'F001_STAFF_CAN_WATCH_ENTRANCE' },
          ],
        },
      ],
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
      dialogue: [
        {
          condition: { hasEvidence: 'E001_TICKET' },
          lines: [{ text: 'Single. 08:45. Issued 08:38 to Elias.' }],
        },
        {
          lines: [
            { text: 'A single ticket for the 08:45.' },
            { text: 'Issued at 08:38 to a passenger named Elias. Seven minutes to spare.' },
          ],
          effects: [
            { addEvidence: 'E001_TICKET' },
            { addFact: 'F001_ELIAS_JOURNEY' },
          ],
        },
      ],
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
      dialogue: [
        {
          condition: { hasEvidence: 'E001_DROPPED_BAG' },
          lines: [{ text: 'The bag is still here. The name tag reads NIKO.' }],
        },
        {
          lines: [
            { text: 'A small bag, dropped in a hurry.' },
            { text: 'The name tag reads NIKO. Nobody has come back for it.' },
          ],
          effects: [
            { addEvidence: 'E001_DROPPED_BAG' },
            { addFact: 'F001_NIKO_BAG' },
          ],
        },
      ],
    },
  ],
};
