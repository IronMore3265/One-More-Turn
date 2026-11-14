# ONE MORE TURN --- Complete Game Development Plan

**Universe:** THE CONTINUITY\
**Genre:** Solo, top-down 2D narrative investigation adventure\
**Platform:** Browser (desktop-first)\
**Engine:** Phaser 3 + HTML/CSS/JavaScript\
**Visual style:** 1990s 8-bit-inspired pixel art\
**Document purpose:** Single source of truth for design, implementation,
art production, testing, and AI-assisted development.

> **Production rule:** Build and prove Case 001 before expanding the
> game. The six-case arc is the intended complete game, but the first
> playable milestone is a small, polished Case 001 prototype.

------------------------------------------------------------------------

## 1. Product vision

### 1.1 High concept

The player is a newly hired **Time Auditor** working for **The
Continuity**, an organisation outside ordinary time that monitors
events, branches, and approved timelines.

The player investigates authored timeline deviations, gathers evidence,
reconstructs what happened, rewinds to a checkpoint, and makes a
different intervention. Knowledge survives a rewind even when the world
state does not.

At first, the player believes their job is to correct broken timelines.
Over time, they discover that The Continuity often suppresses branches
because they are unpredictable and difficult to control---not
necessarily because they are harmful.

**Central idea:** There is always another turn. There is never a
guarantee that the next choice will be better.

### 1.2 Design pillars

1.  **Investigation before intervention.** Players should understand a
    situation before choosing how to alter it.
2.  **Knowledge survives time.** Rewinding resets the world, not what
    the player has learned.
3.  **Consequences are authored and legible.** Branches are designed
    outcomes, not a simulated universe.
4.  **No simple morality score.** Choices can protect one person while
    disadvantaging another; the game asks players to interpret outcomes.
5.  **Small spaces, meaningful detail.** Each case is a compact,
    hand-authored location.
6.  **The institution is part of the mystery.** Reports and official
    records gradually reveal the values of The Continuity.

### 1.3 Explicit non-goals

Do not add: - Multiplayer or co-op. - Farming, city-building, crafting,
or survival systems. - Resource-management loops. - Combat. - Procedural
worlds or procedural dialogue. - Infinite timeline simulation. -
Open-world exploration. - Real-time countdown pressure as a core
mechanic. - A morality meter or universal "good ending" score.

------------------------------------------------------------------------

## 2. Player experience and core loop

### 2.1 Core loop

1.  Receive a case assignment.
2.  Enter a compact location.
3.  Explore and speak with characters.
4.  Inspect objects and collect evidence.
5.  Review observations and timeline nodes.
6.  Infer what caused the deviation.
7.  Rewind to a defined checkpoint.
8.  Change one or more circumstances or interventions.
9.  Observe the resulting branch.
10. Submit a report.

### 2.2 Rewind philosophy

Rewind is not a conventional undo button. It is a way to test an
interpretation.

**Reset on rewind:** - Player and NPC positions. - Temporary character
states. - World flags. - Object states. - Current timeline node. -
Temporary choices and branch consequences.

**Persist on rewind:** - Discovered evidence. - Learned facts. - Visited
timeline nodes. - Rewind count. - Case knowledge and unlocked
observations.

A rewind should never erase the player's understanding. The player can
use persistent knowledge to make a more informed intervention on the
next attempt.

### 2.3 Player controls

  Input               Action
  ------------------- ----------------------
  WASD / Arrow keys   Move
  E / Space           Interact
  Enter               Advance dialogue
  Escape              Close panel/dialogue
  J                   Open notebook
  T                   Open timeline
  R                   Rewind to checkpoint

Controls must be remappable later, but remapping is not an MVP
requirement.

------------------------------------------------------------------------

## 3. World and narrative structure

### 3.1 The Continuity

The Continuity exists outside ordinary time. It indexes events, observes
branches, and selects timelines considered administratively viable.

Its official language is calm, procedural, and impersonal. It tends to
describe people as passengers, subjects, outcomes, deviations, and
variables.

The player initially accepts this language. Each case reveals a gap
between the official record and lived experience.

### 3.2 Narrative progression

-   **Cases 001--002:** The player sees that official timelines omit
    important human context.
-   **Case 003:** The player learns that preventing a delay can create a
    worse outcome.
-   **Case 004:** The player discovers that human memory can preserve
    evidence of a deleted branch.
-   **Case 005:** The player sees The Continuity suppress a beneficial
    but unpredictable history.
-   **Case 006:** The player discovers the institution's selection rules
    and decides whether to preserve, release, or amend them.

### 3.3 Hub structure

The Continuity office is the main hub between cases. For the MVP, use a
simple menu or placeholder office screen. A fully explorable hub is
later production work.

------------------------------------------------------------------------

## 4. Complete six-case story outline

The six cases form one authored progression. Each ordinary case can be
completed with any supported outcome; the final case and endings depend
on accumulated archive discoveries.

### Case 001 --- The Late Arrival

**Location:** Halcyon Station\
**Time:** Morning; the critical departure is 08:45\
**Main characters:** Elias, Mara, Niko, and the player

Elias arrives at Halcyon Station intending to catch the 08:45 train for
an important interview. Niko drops a bag and becomes separated from
their companion. Elias stops to help Niko and misses the train. The
official timeline treats Elias's missed departure as a deviation and
ignores the welfare event.

**The discovery:** Approved timelines measure passenger arrival and
schedule compliance while excluding secondary welfare.

**Map areas:** - Staff room / timeline terminal. - Ticket hall. -
Entrance. - Waiting room. - Platform 1.

**Important objects:** - Timetable. - Ticket. - Dropped bag. - Payphone
/ help desk. - Bench / waiting-room notice. - Terminal. - Train and
platform clock.

**Key timeline:** - 08:30 --- Elias arrives. - 08:38 --- Ticket
obtained. - 08:40 --- Niko's bag is dropped; the deviation begins. -
08:41 --- Elias helps Niko. - 08:45 --- Train departs.

**Branch outcomes:** - Walk past: Elias boards; Niko remains distressed
and separated. - Help Niko: Elias misses his interview; Niko is reunited
with their companion. - Rewind to 08:39 and ask Mara to watch the
entrance: Elias can help Niko while Mara coordinates the reunion; both
are helped. This is the intended inference, not a morality-score
solution.

**Persistent knowledge:** Evidence and facts discovered before rewind
remain available after rewind.

**Report line:** "Secondary welfare event excluded from evaluation."

**MVP acceptance:** The player can discover the situation, rewind, ask
Mara to watch the entrance, and observe the combined outcome.

### Case 002 --- The Wrong Platform

**Location:** Bellweather Central Station\
**Time:** 21:14--21:44\
**Main characters:** Mara Venn, Jon Bell, station attendant Elias

Mara boards Platform 4 instead of Platform 2 after Jon warns her about a
signal fault. The warning appears to be misinformation, but it is
incomplete rather than random. The signal fault and inspection hold
explain why forcing her onto Platform 2 is not necessarily the right
intervention.

**Map areas:** Concourse, Platform 2, Platform 4, staff corridor.

**Evidence:** - Platform assignment. - Clock discrepancy. - Mara's
destination. - Signal warning. - Signal fault. - Inspection hold.

**Timeline nodes:** - `N002_ARRIVAL` - `N002_WARNING` -
`N002_BOARD_CHECK` - `N002_MOVE` - `N002_WAIT` - `N002_P4_BOARD` -
`N002_NEXT_TRAIN` - `N002_FORCE_P2`

**Checkpoint:** `CP002_2114`

**Choices:** - `CH002_STOP_JON`: Stop the warning; Mara goes to Platform
2, but the train is held because of the fault. - `CH002_WARN_MARA`: Tell
Mara about the fault; she waits and misses the first train. -
`CH002_EXPLAIN`: Let Jon explain and confirm the situation with Elias;
Mara takes the next safe train. Intended solution.

**Report:** Passenger testimony is excluded from the final causal
record.

### Case 003 --- The Perfect Timeline

**Location:** Northbridge Station\
**Time:** 18:42--18:45\
**Main characters:** Daniel, Mrs. Vale, ticket clerk

Daniel misses a train because he helps Mrs. Vale retrieve a dropped bag.
The train later suffers an accident. Preventing the delay puts Daniel on
the train.

**The discovery:** Missing an opportunity can prevent a worse outcome. A
timeline that looks efficient is not necessarily a better human outcome.

**Map areas:** Entrance, concourse, platform.

**Evidence:** - Bag contents. - Train time. - Time reading. - Future
accident report. - Meeting destination.

**Timeline checkpoint:** `CP003_1842`

**Choices:** - `CH003_HURRY`: Hurry Daniel; he boards and enters the
accident branch. - `CH003_PREVENT_BAG`: Prevent the bag incident; he
boards and enters the accident branch. - `CH003_ALLOW_HELP`: Let him
help; he misses the train and avoids the accident. Intended solution. -
`CH003_WARN`: Warn Daniel; he refuses to board but becomes distressed.

**Report:** "HUMAN OUTCOME: NOT EVALUATED."

### Case 004 --- The Missing Minute

**Location:** Apartment 17, Greybridge\
**Time:** 23:58--00:01\
**Main characters:** Oliver Reed, Nora; Oliver's brother is heard only
through a recording

Oliver claims his deceased brother called one minute after midnight. The
official record says Oliver was alone and asleep.

**The discovery:** Evidence of a deleted branch can survive in human
memory.

**Map areas:** Hallway, living room, kitchen, bedroom.

**Evidence:** - Missing minute. - Corrupted call. - Brother's message. -
Family photo. - Midnight broadcast. - Unsent letter.

**Checkpoint:** `CP004_2358`

**Choices:** - `CH004_STOP_CALL`: Prevent the ring; Oliver sleeps but
remains distressed. - `CH004_ALLOW_CALL`: Allow the call; Oliver
receives comfort, and the branch becomes visible. - `CH004_NORA`:
Disconnect the phone so Nora speaks with Oliver. Intended solution; it
provides human support without recreating the original call.

**Report:** The event is absent from the official record; the reference
event was deleted before indexing.

### Case 005 --- The Unwritten Day

**Location:** Old Bellweather\
**Date/time:** 12 October, 14:00\
**Main characters:** Mira and Tom

Residents remember a festival celebrating the library's reopening.
Official history says the library was demolished and the festival never
happened.

**The discovery:** The Continuity suppresses unpredictability even when
it benefits people.

**Map areas:** Town square, library entrance, market, side street.

**Evidence:** - Festival marks. - Library notice. - Festival flyer. -
Library photo. - Repair receipt. - Demolition record.

**Checkpoint:** `CP005_BEFORE_DEMOLITION`

**Choices:** - `CH005_ALLOW_DEMOLITION`: The approved sequence occurs;
the library and festival disappear. - `CH005_STOP_DEMOLITION`: Save the
library; the festival survives but the branch becomes difficult to
monitor. - `CH005_SAVE_RECORDS`: Preserve records but not the building;
the building is demolished, but residents retain the history. Intended
solution.

**Report:** "PREDICTABILITY RISK: HIGH. HUMAN BENEFIT: NON-QUANTIFIABLE.
RECOMMENDATION: SUPPRESS."

### Case 006 --- One More Turn

**Location:** Continuity headquarters, outside ordinary time\
**Characters:** Director Vale, Archive Operator, silent Auditor

The player discovers that The Continuity selects futures it can control,
not necessarily the best futures.

**Map areas:** Auditor's office, records corridor, central archive,
control chamber.

**Evidence interactions:** - `C006_DESK_INSPECT` →
`E006_PERSONAL_CASE_FILES` - `C006_TERMINAL_INSPECT` →
`E006_AUDITOR_EVALUATION` - `C006_EMPLOYEE_INSPECT` →
`E006_APPOINTMENT_RECORD` - `C006_PROTOCOL_INSPECT` →
`AR_SELECTION_PROTOCOL` - `C006_LEDGER_INSPECT` → `AR_ERASURE_LEDGER` -
`C006_ASSIGNMENT_INSPECT` → `AR_ORIGINAL_ASSIGNMENT`

**Archive records:** - `AR_SELECTION_PROTOCOL`: Approved sequences are
selected by continuity stability, predictability, and administrative
viability; human outcome is not mandatory. - `AR_ERASURE_LEDGER`:
Branches are removed if future outcomes exceed acceptable variance;
positive local outcomes do not guarantee retention. -
`AR_ORIGINAL_ASSIGNMENT`: Auditor 07 was predicted to show high
compliance, but independent judgement was observed; continue
observation.

**Timeline nodes:** - `N006_FIRST_BRANCH` - `N006_SELECTION` -
`N006_ERASURE` - `N006_APPOINTMENT` - `N006_DISCOVERY` -
`N006_FINAL_CHOICE`

**Checkpoint:** `CP006_BEFORE_PROTOCOL`

**Final choices:** - `CH006_PRESERVE` --- Ending A, **The Approved
Future**. Reactivate the master selection protocol. - `CH006_RELEASE`
--- Ending B, **The Open Future**. Disable selection and release
branches. Requires `AR_ERASURE_LEDGER`. - `CH006_AMEND` --- Ending C,
**The Unfinished Future**. Amend selection rules. Requires all three
archive records.

**Ending A --- The Approved Future** - Stability: 100%. - Human outcome:
not evaluated. - Auditor is promoted. - Office resets; Case 001 waits
again.

**Ending B --- The Open Future** - Stability: unknown. - Possible
futures are uncounted. - Master selection is disabled. - Timeline
branches extend beyond the screen.

**Ending C --- The Unfinished Future** - Stability: conditional. - Human
outcome: under review. - Selection is modified: harmful branches may
still be closed, but unpredictability alone is no longer grounds for
deletion. - The final case question becomes: "Who is affected, and what
do they stand to lose?"

**Epilogue line:** "There is always another turn. There is never a
guarantee."

------------------------------------------------------------------------

## 5. MVP scope: Case 001 only

The first playable build is not the whole game. It is one complete,
small case that proves the core loop.

### 5.1 Required MVP content

-   One 320 × 240 game canvas.
-   One Halcyon Station map.
-   One controllable Time Auditor.
-   Elias, Mara, and Niko.
-   Five core interactables: timetable, ticket, bag, payphone/help desk,
    and terminal.
-   Dialogue and interaction system.
-   Three persistent evidence items.
-   Four or five timeline nodes.
-   One rewind checkpoint.
-   Three interventions/outcomes.
-   One case report.
-   Restart/replay capability.

The bench, station clock, train, and signage can be simple map props; do
not make every decorative prop a complex interaction.

### 5.2 Two-day prototype target

**Day 1** - Create Phaser project and 320 × 240 scene. - Add movement
and wall collision. - Add interactable objects. - Add dialogue. - Add
notebook/evidence tracking. - Add timeline panel and checkpoint
representation.

**Day 2** - Implement rewind. - Implement three interventions and
consequences. - Ensure evidence persists through rewind. - Add report
screen. - Polish the map and interactions. - Run the acceptance tests.

Saving is optional for the first two-day proof. Add it after the loop
works.

### 5.3 MVP completion criteria

The prototype is complete when: - It runs in a desktop browser. - The
player can move around the station. - Walls block movement correctly. -
All required objects can be inspected. - Dialogue conditions work. -
Evidence is added to the notebook. - Timeline nodes can be reviewed. -
Rewind restores the world checkpoint. - Evidence and facts persist after
rewind. - Three distinct outcomes can be reached. - The report
accurately reflects the chosen outcome. - The player can restart the
case.

------------------------------------------------------------------------

## 6. Technical architecture

### 6.1 Recommended stack

-   HTML for the page shell.
-   CSS for layout and scaling around the game canvas.
-   JavaScript for game logic and data.
-   Phaser 3 for rendering, input, scenes, animation, and collisions.
-   `localStorage` for simple local save data.
-   JSON or JavaScript data modules for authored cases.

Avoid introducing a backend, database, multiplayer service, or complex
framework for the MVP.

### 6.2 Suggested project structure

``` text
one-more-turn/
  index.html
  style.css
  assets/
    sprites/
      player/
      characters/
      props/
      ui/
    tiles/
    backgrounds/
    audio/
  src/
    main.js
    config.js
    scenes/
      BootScene.js
      MenuScene.js
      OfficeScene.js
      CaseScene.js
    systems/
      MovementSystem.js
      InteractionSystem.js
      DialogueSystem.js
      TimelineSystem.js
      RewindSystem.js
      NotebookSystem.js
      SaveSystem.js
    data/
      cases/
        case001.js
        case002.js
        case003.js
        case004.js
        case005.js
        case006.js
    ui/
      DialogueBox.js
      NotebookPanel.js
      TimelinePanel.js
      CaseReport.js
```

This is a target structure, not a demand to create every file on day
one. For the MVP, keep modules small and create only the systems that
Case 001 uses.

### 6.3 Scene responsibilities

-   `BootScene`: load assets and initialise global configuration.
-   `MenuScene`: title screen and start/continue options.
-   `OfficeScene`: case selection and hub transition.
-   `CaseScene`: load a case map, actors, interactions, and case state.

### 6.4 System responsibilities

-   `MovementSystem`: directional input, movement speed, collision.
-   `InteractionSystem`: nearby object detection and interaction
    dispatch.
-   `DialogueSystem`: dialogue display and condition evaluation.
-   `TimelineSystem`: timeline node navigation and history.
-   `RewindSystem`: checkpoint restoration and persistent knowledge.
-   `NotebookSystem`: evidence, observations, and timeline entries.
-   `SaveSystem`: serialise and restore case progress.

Do not make systems depend on each other's internal implementation
details. Pass case state and event callbacks through clear interfaces.

------------------------------------------------------------------------

## 7. State model and data contracts

### 7.1 Global state

Suggested global fields: - `activeCaseId` - `completedCases` -
`caseProgress` - `currentEnding` - `archiveRecords` - `playerPosition` -
`gameMode`

### 7.2 Case state

Separate state into two groups.

**World state --- reset on rewind** - `worldFlags` - `characterStates` -
`objectStates` - `currentNodeId` - Temporary branch choices.

**Knowledge state --- persists on rewind** - `knownEvidence` -
`knownFacts` - `visitedNodes` - `rewindCount`

`finalChoice` can be revised until the case is completed.

### 7.3 Timeline node contract

Each timeline node should contain: - `id` - `timeLabel` - `title` -
`description` - `next` - `condition` - `effects` - `checkpointId` (when
applicable)

Conditions and effects should refer to stable IDs, not display text.

### 7.4 Condition helpers

Use a small set of reusable condition checks: - `hasEvidence(id)` -
`hasFact(id)` - `worldFlag(id)` - `visitedNode(id)` - `choiceIs(id)` -
`archiveRecord(id)`

The same condition logic should drive dialogue, object availability, and
timeline visibility where appropriate.

### 7.5 Rewind procedure

1.  Read the selected checkpoint snapshot.
2.  Restore world flags.
3.  Restore character positions and states.
4.  Restore object states.
5.  Restore the current timeline node.
6.  Retain known evidence.
7.  Retain known facts.
8.  Retain visited timeline nodes.
9.  Increment `rewindCount`.
10. Re-evaluate dialogue and interaction conditions.
11. Refresh notebook and timeline UI.

The checkpoint snapshot should not contain persistent knowledge fields.

### 7.6 Case data design

Cases should be authored as data, not hard-coded as one-off scene
scripts. A case definition should describe: - Case metadata. - Map and
spawn position. - Characters. - Interactables. - Evidence and facts. -
Timeline nodes. - Checkpoints. - Choices and their effects. - Report
text. - Completion conditions.

The engine should interpret this data. Do not build a general-purpose
narrative authoring platform; keep the schema only as flexible as the
six planned cases require.

------------------------------------------------------------------------

## 8. Case 001 implementation specification

### 8.1 Map zones

Use one compact tile map with five connected areas: 1. Staff room /
timeline terminal. 2. Ticket hall. 3. Entrance. 4. Waiting room. 5.
Platform 1.

The player should be able to understand the station from its layout. Use
signs and doors to establish room transitions, not a large map.

### 8.2 Interaction and evidence plan

Required interactions: - Inspect timetable to learn the 08:45
departure. - Inspect ticket to establish Elias's intended journey. -
Inspect dropped bag to discover Niko's problem. - Use payphone/help desk
to learn how the companion can be contacted or located. - Inspect
terminal to view the official timeline and case assignment.

The notebook should record evidence separately from conclusions. The
player should infer that Mara can help coordinate the entrance while
Elias assists Niko.

### 8.3 Case 001 timeline

Use a small authored timeline: - `N001_ARRIVAL` --- 08:30 arrival. -
`N001_TICKET` --- 08:38 ticket obtained. - `N001_BAG_DROP` --- 08:40
dropped bag / deviation. - `N001_HELP` --- 08:41 assistance. -
`N001_DEPARTURE` --- 08:45 train departure.

Use a named checkpoint around 08:39, before the intervention becomes
irreversible. Suggested ID: `CP001_0839`.

### 8.4 Intervention outcomes

The first build needs three meaningful paths: 1. Do not intervene / walk
past: Elias boards; Niko remains distressed. 2. Let Elias help without
coordinating: Niko is reunited; Elias misses the interview. 3. Rewind
and ask Mara to watch the entrance before Elias helps: both needs are
addressed.

Do not frame the third path as a universal moral answer. It is the
result of noticing a resource already present in the scene: Mara can
help.

### 8.5 Report

The report should record: - The official deviation. - Evidence
discovered. - The selected intervention. - The human consequences. - The
official assessment.

Include the institutional language: "Secondary welfare event excluded
from evaluation."

------------------------------------------------------------------------

## 9. Sprite and tile asset plan

### 9.1 Technical art standard

  Property              Specification
  --------------------- -----------------------------------
  Internal resolution   320 × 240 px
  Tile size             16 × 16 px
  Character frame       16 × 24 px
  Player pivot          Bottom-centre
  Character collision   Approximately 10 × 8 px near feet
  Scaling               Integer scaling where possible
  Filtering             Nearest-neighbour
  Export                PNG
  Frame metadata        JSON atlas metadata where useful

Keep character collision at the feet rather than using the full visible
sprite rectangle.

### 9.2 Palette

  Name         HEX         Use
  ------------ ----------- ---------------------------
  Deep navy    `#172333`   Outlines and shadows
  Charcoal     `#303943`   Walls and equipment
  Slate        `#52616A`   Secondary surfaces
  Muted teal   `#477C7A`   Station details
  Pale teal    `#83AAA0`   Highlights
  Amber        `#E0A84A`   Important information
  Pale amber   `#F3D28A`   UI emphasis
  Muted red    `#A84F4F`   Deviations and warnings
  Warm cream   `#D9D0B8`   Paper and signage
  Light grey   `#A8ADB0`   Metal and neutral details
  Dark brown   `#59463C`   Bag and wood
  Black-blue   `#101820`   Deepest outline

Use amber sparingly for interaction and important information. Use red
for deviations, not decoration.

### 9.3 Environment atlas

Create a 128 × 128 px atlas: 8 columns × 8 rows of 16 × 16 tiles (64
cells).

Suggested row grouping: - Row 0: plain, worn, tiled, marked floor
variations. - Row 1: straight walls, corners, edges, window. - Row 2:
doorways, entrances, thresholds, glass doors. - Row 3: platform floor,
tracks, platform edges, safety markings. - Row 4: furniture bases and
counter pieces. - Row 5: wall-mounted details and signage. - Row 6:
stains, cracks, debris, floor marks. - Row 7: terminal area, restricted
area, timeline anomaly.

MVP inventory: roughly 25--35 useful tiles. Empty atlas cells are fine.

### 9.4 Character sheets

**Time Auditor** - 16 × 24 px frames. - One idle frame for each
direction. - Four walk frames per direction. - Small amber ID detail. -
Full directional movement.

**Elias** - 16 × 24 px. - Idle in the directions needed by the map. -
Four-frame walk only if he moves visibly.

**Mara** - 16 × 24 px. - Idle down and side. - One turn or interaction
pose. - Full walking is not required if she stays at her post.

**Niko** - Approximately 16 × 20 px. - Idle and worried pose. - Walking
only if the implemented scene needs it.

Use a shared character base and palette swaps where practical. Do not
animate characters who do not need to move.

### 9.5 Props

Create separate sprites for: - Timetable (16 × 32). - Ticket (16 ×
16). - Dropped bag (16 × 16). - Payphone (16 × 32). - Help desk (32 ×
32). - Bench (32 × 16). - Terminal (32 × 32). - Station clock (16 ×
16). - Platform sign (32 × 16). - Train silhouette (at least 64 × 32).

Use an amber marker or outline overlay for highlighted objects instead
of duplicating every sprite in a highlighted state.

### 9.6 UI assets

Build compact panels for: - Dialogue. - Interaction prompt. -
Notebook. - Timeline. - Case report.

Icons: - Evidence. - Timeline node. - Rewind. - Report. -
Warning/deviation. - Locked/unavailable. - Selection cursor.

Use text rendering for labels and descriptions. Do not bake long text
into sprites.

### 9.7 Suggested asset organisation

``` text
assets/
  sprites/
    player/auditor.png
    characters/elias.png
    characters/mara.png
    characters/niko.png
    props/halcyon_props.png
    ui/ui_atlas.png
  tiles/halcyon_station.png
  backgrounds/halcyon_station_bg.png
  audio/
    music/
    sfx/
```

Use lowercase snake_case and stable animation frame names such as
`walk_down_00` through `walk_down_03`.

### 9.8 Placeholder strategy

Correct dimensions and collision footprints matter more than finished
art: - Auditor: coloured 16 × 24 rectangle. - Elias: brown
placeholder. - Mara: teal placeholder. - Niko: shorter red/brown
placeholder. - Terminal: dark 32 × 32 block. - Timetable: cream
rectangle with dark lines. - Ticket: cream 16 × 16 block. - Bag: brown
16 × 16 block. - Train: static silhouette. - UI icons: simple 8 × 8
symbols.

### 9.9 Art production order

1.  Floor tile, wall tile, platform edge, player placeholder.
2.  Test room at actual 320 × 240 size.
3.  Complete station tile atlas and map.
4.  Finish player walk cycle.
5.  Add NPCs.
6.  Add required props.
7.  Add dialogue, notebook, timeline, and report panels.
8.  Polish only after the case is playable.

------------------------------------------------------------------------

## 10. UI, audio, and presentation

### 10.1 UI layout

-   Keep the game canvas as the primary focus.
-   Use a small dialogue box near the bottom.
-   Notebook and timeline should be panels, not permanent HUD clutter.
-   Use a consistent amber selection marker.
-   Keep text short and legible at the target resolution.

### 10.2 Notebook tabs

-   Evidence: physical or documentary evidence.
-   Observations: conclusions and learned facts.
-   Timeline: visited nodes and event order.

Do not mix evidence with interpretations. The distinction supports the
investigation mechanic.

### 10.3 Audio

MVP: - One quiet station ambience loop. - One interaction sound. - One
evidence-discovered sound. - One rewind sound. - One report/confirmation
sound.

Later: - Hub theme. - Investigation theme. - Finale theme.

Audio must support the quiet, slightly lonely tone. Avoid loud arcade
feedback.

------------------------------------------------------------------------

## 11. Save system

Use `localStorage` with a versioned save object.

Suggested top-level fields: - `saveVersion: 1` - `activeCaseId` -
`completedCases` - `caseProgress` - `archiveRecords` - `currentEnding`

Save at: - Case transitions. - Checkpoint creation. - Report
submission. - Important archive unlocks.

Do not save every frame. Add defensive handling for missing or
incompatible save data. A reset-save option is useful for testing.

------------------------------------------------------------------------

## 12. Testing and acceptance

### 12.1 Core system tests

-   Player cannot walk through solid walls.
-   Interactions trigger only within range.
-   Dialogue advances and closes correctly.
-   Evidence is added once and does not duplicate.
-   Timeline conditions update after discoveries.
-   Rewind restores the checkpoint world state.
-   Evidence, facts, and visited nodes survive rewind.
-   Rewind count increments.
-   Report matches the actual branch outcome.
-   Restart produces a clean case state.

### 12.2 Case 001 branch tests

**Branch A --- Walk past** - Elias boards. - Niko remains distressed /
unreunited. - Report reflects schedule success and excluded welfare.

**Branch B --- Help** - Elias assists Niko. - Elias misses the
interview. - Report reflects the trade-off.

**Branch C --- Coordinate** - Player rewinds. - Player asks Mara to
watch the entrance. - Elias helps Niko. - Mara coordinates the
reunion. - Both are helped. - Evidence discovered before rewind remains
in the notebook.

### 12.3 Full-game acceptance tests

-   Cases unlock in order: 001 → 002 → 003 → 004 → 005 → 006.
-   Each ordinary case can complete through its supported authored
    outcomes.
-   Case 006 archive requirements are enforced.
-   Ending A is available through `CH006_PRESERVE`.
-   Ending B requires `AR_ERASURE_LEDGER`.
-   Ending C requires all three archive records.
-   Ending labels and epilogue text match the selected ending.
-   Save/load does not corrupt case progress.

------------------------------------------------------------------------

## 13. Production roadmap

### Phase 0 --- Setup

-   Create repository.
-   Create Phaser boot scene.
-   Confirm canvas scaling and pixel filtering.
-   Add a simple test map.

### Phase 1 --- Case 001 vertical slice

-   Movement and collision.
-   Interactions and dialogue.
-   Evidence and notebook.
-   Timeline.
-   Checkpoint and rewind.
-   Three branch outcomes.
-   Case report.

### Phase 2 --- Reusable case framework

-   Extract case data schema.
-   Separate world state and persistent knowledge.
-   Build generic case loader.
-   Add save/load.
-   Add case transition flow.

### Phase 3 --- Cases 002 and 003

These reinforce the player's understanding of incomplete warnings,
causal chains, and the danger of optimizing for schedule efficiency.

### Phase 4 --- Cases 004 and 005

These introduce deleted-branch memory and the institutional suppression
of beneficial unpredictability.

### Phase 5 --- Case 006 and endings

Build the archive investigation, final choice gates, and three endings.

### Phase 6 --- Polish

-   Art consistency.
-   Audio.
-   Accessibility and readability.
-   Save robustness.
-   Browser testing.
-   Performance and bug fixing.

### Scope protection

Do not begin Phase 2 until Case 001 works from start to report. Do not
build all six maps before the first case loop is proven.

------------------------------------------------------------------------

## 14. AI collaboration plan: Claude and Gemini

Use both AIs as specialised collaborators, not competing project owners.
Keep this document and the repository as the source of truth.

### 14.1 Division of responsibility

  -----------------------------------------------------------------------
  Workstream              Primary AI              Secondary AI / check
  ----------------------- ----------------------- -----------------------
  Phaser project          Claude                  Gemini reviews
  architecture                                    architecture

  JavaScript              Claude                  Gemini reviews logic
  implementation                                  and edge cases

  Debugging and           Claude                  Gemini diagnoses
  refactoring                                     independently from
                                                  error/log

  Unit and branch tests   Claude drafts and runs  Gemini proposes missing
                                                  cases

  Case data               Claude                  Gemini checks
  implementation                                  consistency with design

  Narrative and dialogue  Gemini                  Claude checks
  polish                                          implementation
                                                  conditions

  Story continuity audit  Gemini                  Claude checks IDs and
                                                  state effects

  Sprite-sheet and map    Gemini                  Claude checks technical
  screenshot critique                             dimensions

  Visual reference        Gemini                  Human approves final
  analysis                                        art direction

  Tile atlas and asset    Claude structures files Gemini critiques visual
  naming                                          consistency

  Final integration and   Claude                  Gemini performs
  release checklist                               adversarial review

  Product decisions and   Human                   Both provide
  final approval                                  recommendations
  -----------------------------------------------------------------------

**Claude owns the codebase.** Only one AI should make implementation
changes in a given task. Gemini should normally review, critique,
inspect visuals, or produce isolated design suggestions---not edit the
same files concurrently.

Claude Code is particularly useful when it can inspect the repository,
edit files, run tests, and iterate on failures. Gemini's multimodal and
long-context capabilities are useful for reviewing screenshots, sprite
sheets, maps, and large design references. Exact features vary by model,
product, and subscription; use the capabilities actually available in
the accounts.

### 14.2 The handoff protocol

For every feature:

1.  Human chooses the task and acceptance criteria.
2.  Claude reads the relevant plan and repository files.
3.  Claude proposes a small implementation plan before editing.
4.  Claude implements only the agreed scope.
5.  Claude runs the relevant tests and reports changed files.
6.  Gemini receives the task description, relevant files/diff, and test
    output for an independent review.
7.  Human accepts or rejects review findings.
8.  Claude applies approved corrections.
9.  Human runs the browser build and confirms behaviour.
10. Update this plan or a decision log if a design contract changed.

Never ask Gemini and Claude to implement the same feature in parallel
and then merge both versions without review.

### 14.3 Persistent AI project instructions

Create `CLAUDE.md` for Claude and `GEMINI.md` (or a project-specific
Gemini instruction document) for Gemini. Both should state:

-   Read `plan.md` before proposing changes.
-   Case 001 is the current implementation scope unless the human
    explicitly expands it.
-   Preserve the established story, names, IDs, timeline logic, and
    rewind persistence rules.
-   Do not add excluded systems.
-   Do not silently change state contracts.
-   Do not replace Phaser or introduce dependencies without approval.
-   Keep code modular and beginner-readable.
-   Explain files changed and how to test.
-   Never claim tests passed unless they were actually run.
-   Ask before changing design decisions that affect multiple cases.

### 14.4 Prompt templates

**Claude --- implement one feature**

> Read `plan.md` and the current repository. Implement only:
> \[FEATURE\]. Keep the change within the Case 001 MVP. First summarise
> the files you intend to change and the acceptance criteria. Preserve
> the existing state contracts and IDs. Do not add unrelated features or
> dependencies. After implementation, run the relevant tests, report
> exact results, list changed files, and explain how I can verify it in
> the browser. If the plan conflicts with the current code, stop and
> explain the conflict before making a broad change.

**Gemini --- independent code review**

> Review this feature against `plan.md`. Do not rewrite the
> implementation. Look for logic errors, missed edge cases, state
> reset/persistence mistakes, Phaser-specific risks, and scope creep.
> Separate definite bugs from suggestions. For every issue, cite the
> file/section or behaviour involved and propose a minimal correction.
> Check whether the acceptance criteria are actually covered by the
> tests.

**Gemini --- visual asset review**

> Review these screenshots/sprite sheets against the art direction in
> `plan.md`: 320×240 internal resolution, 16×16 tiles, 16×24 standard
> character frames, nearest-neighbour pixel art,
> navy/charcoal/amber/muted teal/red palette. Check native-size
> readability, silhouette distinction, palette consistency, tile seams,
> collision/readability implications, and whether the art is
> over-detailed for the target resolution. Give a prioritised fix list;
> do not redesign the art direction.

**Gemini --- narrative continuity review**

> Audit the proposed case content against the six-case story in
> `plan.md`. Check character motivations, event order,
> evidence-to-conclusion logic, timeline IDs, rewind consequences,
> report language, and continuity foreshadowing. Do not invent new
> canon. List contradictions and ambiguities separately from optional
> improvements.

**Claude --- fix approved review findings**

> Apply only these approved review findings: \[PASTE FINDINGS\]. Do not
> apply suggestions marked optional. Preserve the public IDs and data
> contracts. Run tests and report which findings were fixed and which
> could not be reproduced.

### 14.5 AI operating rules

-   One source of truth: repository + `plan.md`.
-   Keep changes small enough to review.
-   Ask for plans before large edits.
-   Require actual test output.
-   Use Git commits before substantial AI changes.
-   Never paste secrets, API keys, or private credentials into prompts.
-   Do not accept a large rewrite when a small patch will solve the
    problem.
-   Human approval is required for story, scope, architecture, and
    ending changes.

------------------------------------------------------------------------

## 15. Project decision log

Record decisions here when the project evolves. Do not silently
overwrite established design.

  Decision                    Current choice
  --------------------------- -------------------------------------------------
  Game title                  ONE MORE TURN
  Universe                    THE CONTINUITY
  Player role                 Newly hired Time Auditor
  Genre                       Top-down 2D narrative investigation adventure
  Platform                    Browser
  Engine                      Phaser 3
  Language                    HTML/CSS/JavaScript
  Visual direction            1990s 8-bit-inspired pixel art
  Internal resolution         320 × 240
  Tile size                   16 × 16
  MVP                         Case 001 only
  First case                  The Late Arrival
  First location              Halcyon Station
  Rewind                      World resets; knowledge persists
  Case progression            001 → 002 → 003 → 004 → 005 → 006
  Endings                     Approved Future, Open Future, Unfinished Future
  Primary implementation AI   Claude
  Review / multimodal AI      Gemini
  Final authority             Human developer

------------------------------------------------------------------------

## 16. Immediate next actions

Do these in order:

1.  Create the project folder and Git repository.
2.  Put this file at the repository root as `plan.md`.
3.  Create `CLAUDE.md` and `GEMINI.md` using the AI operating rules
    above.
4.  Start a Phaser 3 project with one scene and a 320 × 240 logical
    canvas.
5.  Create a test room using one floor tile, one wall tile, and a
    placeholder player.
6.  Verify pixel-perfect scaling in the browser.
7.  Implement player movement and collision.
8.  Add the five core Case 001 interactables.
9.  Implement dialogue and evidence.
10. Implement timeline, checkpoint, rewind, and the three outcomes.
11. Finish the case report and acceptance tests.
12. Only then extract reusable systems and begin Case 002.

**The immediate goal is not to make the whole game. It is to make one
small case feel complete, understandable, and worth playing.**
