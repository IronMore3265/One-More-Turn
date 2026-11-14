import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCaseState,
  evaluateCondition,
  applyEffects,
} from '../src/systems/CaseState.js';
import {
  addEvidence,
  addFact,
  hasEvidence,
  hasFact,
  notebookTabs,
} from '../src/systems/NotebookSystem.js';
import {
  selectVariant,
  startDialogue,
  currentLine,
  advanceDialogue,
} from '../src/systems/DialogueSystem.js';
import case001 from '../src/data/cases/case001.js';

// A tiny made-up case, so these tests do not depend on Case 001's wording.
const miniCase = {
  evidence: {
    E_KEY: { name: 'Key', description: 'A small brass key.' },
    E_NOTE: { name: 'Note', description: 'A folded note.' },
  },
  facts: {
    F_LOCKED: { text: 'The door is locked.' },
    F_OWNER: { text: 'The key belongs to the clerk.' },
  },
};

const keyDialogue = [
  {
    condition: { hasEvidence: 'E_KEY' },
    lines: [{ text: 'You already have the key.' }],
  },
  {
    lines: [
      { speaker: 'CLERK', text: 'Take it.' },
      { text: 'A small brass key.' },
    ],
    effects: [{ addEvidence: 'E_KEY' }, { addFact: 'F_OWNER' }],
  },
];

// Reads a whole dialogue and returns the text of every line.
function readAll(session) {
  const texts = [currentLine(session).text];
  while (advanceDialogue(session)) {
    texts.push(currentLine(session).text);
  }
  return texts;
}

// Interacts with a Case 001 object by ID and reads its dialogue to the end.
function inspect(caseState, interactableId) {
  const interactable = case001.interactables.find(
    (item) => item.id === interactableId
  );
  return readAll(startDialogue(interactable.dialogue, caseState, case001));
}

// --- Case state -----------------------------------------------------------

test('a new case state is empty and keeps world and knowledge apart', () => {
  const state = createCaseState();
  assert.deepEqual(state.world, {
    worldFlags: {},
    characterStates: {},
    objectStates: {},
    currentNodeId: null,
  });
  assert.deepEqual(state.knowledge, {
    knownEvidence: [],
    knownFacts: [],
    visitedNodes: [],
    rewindCount: 0,
  });
});

test('two case states do not share data', () => {
  const first = createCaseState();
  const second = createCaseState();
  addEvidence(first, 'E_KEY');
  first.world.worldFlags.DOOR_OPEN = true;
  assert.deepEqual(second, createCaseState());
});

// --- Notebook -------------------------------------------------------------

test('evidence is added once and never duplicated', () => {
  const state = createCaseState();
  assert.equal(addEvidence(state, 'E_KEY'), true);
  assert.equal(addEvidence(state, 'E_KEY'), false);
  assert.deepEqual(state.knowledge.knownEvidence, ['E_KEY']);
  assert.equal(hasEvidence(state, 'E_KEY'), true);
  assert.equal(hasEvidence(state, 'E_NOTE'), false);
});

test('facts are added once and never duplicated', () => {
  const state = createCaseState();
  assert.equal(addFact(state, 'F_LOCKED'), true);
  assert.equal(addFact(state, 'F_LOCKED'), false);
  assert.deepEqual(state.knowledge.knownFacts, ['F_LOCKED']);
  assert.equal(hasFact(state, 'F_LOCKED'), true);
  assert.equal(hasFact(state, 'F_OWNER'), false);
});

test('evidence and facts are stored separately', () => {
  const state = createCaseState();
  addEvidence(state, 'E_KEY');
  addFact(state, 'F_LOCKED');
  assert.deepEqual(state.knowledge.knownEvidence, ['E_KEY']);
  assert.deepEqual(state.knowledge.knownFacts, ['F_LOCKED']);
});

test('the notebook has an Evidence tab and an Observations tab', () => {
  const state = createCaseState();
  addEvidence(state, 'E_NOTE');
  addEvidence(state, 'E_KEY');
  addFact(state, 'F_LOCKED');

  const [evidenceTab, observationsTab] = notebookTabs(miniCase, state);

  assert.equal(evidenceTab.title, 'Evidence');
  assert.deepEqual(evidenceTab.entries, [
    { title: 'Note', text: 'A folded note.' }, // In the order found.
    { title: 'Key', text: 'A small brass key.' },
  ]);
  assert.equal(observationsTab.title, 'Observations');
  assert.deepEqual(observationsTab.entries, [{ text: 'The door is locked.' }]);
});

test('an empty notebook has empty tabs with a message to show', () => {
  const tabs = notebookTabs(miniCase, createCaseState());
  for (const tab of tabs) {
    assert.deepEqual(tab.entries, []);
    assert.ok(tab.emptyText.length > 0);
  }
});

// --- Conditions -----------------------------------------------------------

test('no condition counts as true', () => {
  assert.equal(evaluateCondition(undefined, createCaseState()), true);
});

test('hasEvidence and hasFact conditions follow the notebook', () => {
  const state = createCaseState();
  assert.equal(evaluateCondition({ hasEvidence: 'E_KEY' }, state), false);
  assert.equal(evaluateCondition({ hasFact: 'F_LOCKED' }, state), false);
  addEvidence(state, 'E_KEY');
  addFact(state, 'F_LOCKED');
  assert.equal(evaluateCondition({ hasEvidence: 'E_KEY' }, state), true);
  assert.equal(evaluateCondition({ hasFact: 'F_LOCKED' }, state), true);
});

test('worldFlag and visitedNode conditions read the right part of the state', () => {
  const state = createCaseState();
  assert.equal(evaluateCondition({ worldFlag: 'DOOR_OPEN' }, state), false);
  assert.equal(evaluateCondition({ visitedNode: 'N_START' }, state), false);
  state.world.worldFlags.DOOR_OPEN = true;
  state.knowledge.visitedNodes.push('N_START');
  assert.equal(evaluateCondition({ worldFlag: 'DOOR_OPEN' }, state), true);
  assert.equal(evaluateCondition({ visitedNode: 'N_START' }, state), true);
});

test('not, all and any combine conditions', () => {
  const state = createCaseState();
  addEvidence(state, 'E_KEY');
  const has = { hasEvidence: 'E_KEY' };
  const missing = { hasEvidence: 'E_NOTE' };

  assert.equal(evaluateCondition({ not: has }, state), false);
  assert.equal(evaluateCondition({ not: missing }, state), true);
  assert.equal(evaluateCondition({ all: [has, { not: missing }] }, state), true);
  assert.equal(evaluateCondition({ all: [has, missing] }, state), false);
  assert.equal(evaluateCondition({ any: [missing, has] }, state), true);
  assert.equal(evaluateCondition({ any: [missing, missing] }, state), false);
});

test('a misspelt or malformed condition is an error, not a silent pass', () => {
  const state = createCaseState();
  assert.throws(() => evaluateCondition({ hasEvidense: 'E_KEY' }, state));
  assert.throws(() =>
    evaluateCondition({ hasEvidence: 'E_KEY', hasFact: 'F_LOCKED' }, state)
  );
});

// --- Effects --------------------------------------------------------------

test('effects add evidence and facts and report what was new', () => {
  const state = createCaseState();
  const effects = [{ addEvidence: 'E_KEY' }, { addFact: 'F_OWNER' }];

  assert.deepEqual(applyEffects(effects, state), {
    evidence: ['E_KEY'],
    facts: ['F_OWNER'],
  });
  // The second time, nothing is new and nothing is duplicated.
  assert.deepEqual(applyEffects(effects, state), { evidence: [], facts: [] });
  assert.deepEqual(state.knowledge.knownEvidence, ['E_KEY']);
  assert.deepEqual(state.knowledge.knownFacts, ['F_OWNER']);
});

test('setFlag changes the world, not the knowledge', () => {
  const state = createCaseState();
  applyEffects([{ setFlag: 'DOOR_OPEN' }], state);
  assert.deepEqual(state.world.worldFlags, { DOOR_OPEN: true });
  assert.deepEqual(state.knowledge, createCaseState().knowledge);
});

test('no effects is fine; an unknown effect is an error', () => {
  const state = createCaseState();
  assert.deepEqual(applyEffects(undefined, state), { evidence: [], facts: [] });
  assert.throws(() => applyEffects([{ addEvidense: 'E_KEY' }], state));
});

// --- Dialogue -------------------------------------------------------------

test('the first variant whose condition is true is selected', () => {
  const state = createCaseState();
  assert.equal(selectVariant(keyDialogue, state), keyDialogue[1]);
  addEvidence(state, 'E_KEY');
  assert.equal(selectVariant(keyDialogue, state), keyDialogue[0]);
});

test('no matching variant means no dialogue', () => {
  const onlyConditional = [
    { condition: { hasEvidence: 'E_KEY' }, lines: [{ text: 'Hello.' }] },
  ];
  const state = createCaseState();
  assert.equal(selectVariant(onlyConditional, state), null);
  assert.equal(startDialogue(onlyConditional, state, miniCase), null);
});

test('a dialogue advances line by line and then finishes', () => {
  const session = startDialogue(keyDialogue, createCaseState(), miniCase);

  assert.deepEqual(currentLine(session), { speaker: 'CLERK', text: 'Take it.' });
  assert.equal(advanceDialogue(session), true);
  assert.equal(currentLine(session).text, 'A small brass key.');
  assert.equal(advanceDialogue(session), true); // The notebook notice.
  assert.equal(advanceDialogue(session), false); // Finished.
  assert.equal(advanceDialogue(session), false); // Stays finished.
});

test('starting a dialogue applies its effects and ends with a notice', () => {
  const state = createCaseState();
  const session = startDialogue(keyDialogue, state, miniCase);

  assert.equal(hasEvidence(state, 'E_KEY'), true);
  assert.equal(hasFact(state, 'F_OWNER'), true);

  const notice = session.lines[session.lines.length - 1];
  assert.deepEqual(notice, {
    speaker: 'NOTEBOOK',
    text: 'Evidence added: Key. Observation noted.',
    notice: true,
  });
});

test('repeating an interaction shows the repeat text and adds nothing', () => {
  const state = createCaseState();
  startDialogue(keyDialogue, state, miniCase);
  const second = startDialogue(keyDialogue, state, miniCase);

  assert.deepEqual(readAll(second), ['You already have the key.']);
  assert.deepEqual(state.knowledge.knownEvidence, ['E_KEY']);
  assert.deepEqual(state.knowledge.knownFacts, ['F_OWNER']);
});

test('starting a dialogue does not change the case data', () => {
  const before = JSON.stringify(keyDialogue);
  const session = startDialogue(keyDialogue, createCaseState(), miniCase);
  readAll(session);
  assert.equal(JSON.stringify(keyDialogue), before);
});

// --- Case 001 content -----------------------------------------------------

test('Case 001 defines exactly three evidence items', () => {
  assert.deepEqual(Object.keys(case001.evidence).sort(), [
    'E001_DROPPED_BAG',
    'E001_STAFF_NOTICE',
    'E001_TICKET',
  ]);
});

test('every Case 001 dialogue ends with a variant that always applies', () => {
  for (const item of case001.interactables) {
    assert.ok(item.dialogue.length > 0, `${item.id} has no dialogue`);
    const last = item.dialogue[item.dialogue.length - 1];
    assert.equal(last.condition, undefined, `${item.id} can have nothing to say`);
    for (const variant of item.dialogue) {
      assert.ok(variant.lines.length > 0, `${item.id} has a variant with no lines`);
      for (const line of variant.lines) {
        assert.ok(line.text.length > 0, `${item.id} has an empty line`);
      }
    }
  }
});

test('every ID used in Case 001 dialogue is defined in the case data', () => {
  // Collects the IDs mentioned by a condition, including nested ones.
  function collect(condition, found) {
    if (condition === undefined) return;
    const [[type, value]] = Object.entries(condition);
    if (type === 'hasEvidence') found.evidence.push(value);
    else if (type === 'hasFact') found.facts.push(value);
    else if (type === 'not') collect(value, found);
    else if (type === 'all' || type === 'any') value.forEach((c) => collect(c, found));
  }

  const used = { evidence: [], facts: [] };
  for (const item of case001.interactables) {
    for (const variant of item.dialogue) {
      collect(variant.condition, used);
      for (const effect of variant.effects ?? []) {
        if (effect.addEvidence) used.evidence.push(effect.addEvidence);
        if (effect.addFact) used.facts.push(effect.addFact);
      }
    }
  }

  for (const id of used.evidence) {
    assert.ok(case001.evidence[id], `Evidence ${id} is not defined`);
  }
  for (const id of used.facts) {
    assert.ok(case001.facts[id], `Fact ${id} is not defined`);
  }
});

test('inspecting all five Case 001 objects fills the notebook', () => {
  const state = createCaseState();
  for (const item of case001.interactables) {
    inspect(state, item.id);
  }
  assert.deepEqual([...state.knowledge.knownEvidence].sort(), [
    'E001_DROPPED_BAG',
    'E001_STAFF_NOTICE',
    'E001_TICKET',
  ]);
  assert.deepEqual([...state.knowledge.knownFacts].sort(), [
    'F001_DEPARTURE_0845',
    'F001_ELIAS_JOURNEY',
    'F001_NIKO_BAG',
    'F001_OFFICIAL_DEVIATION',
    'F001_STAFF_CAN_WATCH_ENTRANCE',
  ]);
});

test('inspecting every Case 001 object twice adds nothing new', () => {
  const state = createCaseState();
  for (const item of case001.interactables) {
    inspect(state, item.id);
  }
  // The terminal has one follow-up (tested below); take it first.
  inspect(state, 'C001_TERMINAL_INSPECT');
  const before = JSON.stringify(state);

  for (const item of case001.interactables) {
    const texts = inspect(state, item.id);
    assert.ok(
      texts.every((text) => !text.includes('added') && !text.includes('noted')),
      `${item.id} showed a notebook notice on a repeat visit`
    );
  }
  assert.equal(JSON.stringify(state), before);
});

test('the terminal reveals the missing bag record only once the bag is known', () => {
  const state = createCaseState();

  // First visit: the case assignment.
  inspect(state, 'C001_TERMINAL_INSPECT');
  assert.equal(hasFact(state, 'F001_OFFICIAL_DEVIATION'), true);

  // Without the bag, a second visit teaches nothing new.
  inspect(state, 'C001_TERMINAL_INSPECT');
  assert.equal(hasFact(state, 'F001_BAG_NOT_RECORDED'), false);

  // After finding the bag, the terminal can be queried about it.
  inspect(state, 'C001_BAG_INSPECT');
  const texts = inspect(state, 'C001_TERMINAL_INSPECT');
  assert.ok(texts.some((text) => text.includes('No matching event')));
  assert.equal(hasFact(state, 'F001_BAG_NOT_RECORDED'), true);
});
