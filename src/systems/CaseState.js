import {
  addEvidence,
  addFact,
  hasEvidence,
  hasFact,
} from './NotebookSystem.js';

// Case state, conditions, and effects. See plan.md section 7.
//
// Plain functions with no Phaser dependency, so they can be unit tested.

// Creates the state for one play-through of a case.
//
// The state is split in two, and the split matters:
//   world      Resets when the player rewinds.
//   knowledge  Survives a rewind. A rewind must never touch it.
export function createCaseState() {
  return {
    world: {
      worldFlags: {},
      characterStates: {},
      objectStates: {},
      currentNodeId: null,
    },
    knowledge: {
      knownEvidence: [],
      knownFacts: [],
      visitedNodes: [],
      rewindCount: 0,
    },
  };
}

// Checks a condition from the case data against the case state.
//
// A condition is an object with exactly one key:
//   { hasEvidence: 'E001_TICKET' }      The evidence is in the notebook.
//   { hasFact: 'F001_DEPARTURE_0845' }  The fact has been learned.
//   { worldFlag: 'SOME_FLAG' }          The world flag is set.
//   { visitedNode: 'N001_ARRIVAL' }     The timeline node has been visited.
//   { not: condition }                  The inner condition is false.
//   { all: [condition, ...] }           Every inner condition is true.
//   { any: [condition, ...] }           At least one inner condition is true.
//
// No condition at all (undefined) counts as true.
export function evaluateCondition(condition, caseState) {
  if (condition === undefined) return true;

  const [type, value] = onlyEntry(condition, 'condition');
  switch (type) {
    case 'hasEvidence':
      return hasEvidence(caseState, value);
    case 'hasFact':
      return hasFact(caseState, value);
    case 'worldFlag':
      return caseState.world.worldFlags[value] === true;
    case 'visitedNode':
      return caseState.knowledge.visitedNodes.includes(value);
    case 'not':
      return !evaluateCondition(value, caseState);
    case 'all':
      return value.every((inner) => evaluateCondition(inner, caseState));
    case 'any':
      return value.some((inner) => evaluateCondition(inner, caseState));
    default:
      throw new Error(`Unknown condition type: ${type}`);
  }
}

// Applies a list of effects from the case data to the case state.
//
// An effect is an object with exactly one key:
//   { addEvidence: 'E001_TICKET' }
//   { addFact: 'F001_DEPARTURE_0845' }
//   { setFlag: 'SOME_FLAG' }
//
// Returns the IDs that were newly added, so the game can tell the player:
//   { evidence: [...], facts: [...] }
// Evidence or facts the player already has are not added (or reported) again.
export function applyEffects(effects = [], caseState) {
  const added = { evidence: [], facts: [] };

  for (const effect of effects) {
    const [type, value] = onlyEntry(effect, 'effect');
    switch (type) {
      case 'addEvidence':
        if (addEvidence(caseState, value)) added.evidence.push(value);
        break;
      case 'addFact':
        if (addFact(caseState, value)) added.facts.push(value);
        break;
      case 'setFlag':
        caseState.world.worldFlags[value] = true;
        break;
      default:
        throw new Error(`Unknown effect type: ${type}`);
    }
  }

  return added;
}

// Conditions and effects must have exactly one key. This catches typos in
// the case data early instead of silently ignoring part of an entry.
function onlyEntry(object, kind) {
  const entries = Object.entries(object);
  if (entries.length !== 1) {
    throw new Error(
      `A ${kind} must have exactly one key: ${JSON.stringify(object)}`
    );
  }
  return entries[0];
}
