import { evaluateCondition, applyEffects } from './CaseState.js';

// Dialogue: choosing what is said, and stepping through it.
//
// Plain functions with no Phaser dependency. Drawing the text is the job of
// ui/DialogueBox.js.
//
// A dialogue in the case data is a list of variants. The FIRST variant whose
// condition is true is used, so put specific variants before general ones
// and end with one that has no condition.
//
//   [
//     { condition: { hasEvidence: 'E001_TICKET' }, lines: [...] },
//     { lines: [...], effects: [{ addEvidence: 'E001_TICKET' }] },
//   ]
//
// A line is { speaker?, text }.

// Returns the first variant whose condition is true, or null.
export function selectVariant(variants, caseState) {
  return (
    variants.find((variant) =>
      evaluateCondition(variant.condition, caseState)
    ) ?? null
  );
}

// Starts a dialogue: picks the variant, applies its effects, and returns a
// session to step through. Returns null if no variant applies.
//
// If the effects added anything to the notebook, a final notice line is
// appended so the player sees what they gained.
export function startDialogue(variants, caseState, caseData) {
  const variant = selectVariant(variants, caseState);
  if (!variant) return null;

  const added = applyEffects(variant.effects, caseState);
  const notice = noticeLine(added, caseData);

  return {
    lines: notice ? [...variant.lines, notice] : [...variant.lines],
    index: 0,
  };
}

// The line currently being shown.
export function currentLine(session) {
  return session.lines[session.index];
}

// Moves to the next line. Returns false when the dialogue has finished.
export function advanceDialogue(session) {
  if (session.index >= session.lines.length - 1) return false;
  session.index += 1;
  return true;
}

// Builds the "added to notebook" line, or null if nothing was added.
function noticeLine(added, caseData) {
  const parts = [];

  if (added.evidence.length > 0) {
    const names = added.evidence.map((id) => caseData.evidence[id].name);
    parts.push(`Evidence added: ${names.join(', ')}.`);
  }
  if (added.facts.length === 1) {
    parts.push('Observation noted.');
  } else if (added.facts.length > 1) {
    parts.push(`${added.facts.length} observations noted.`);
  }

  if (parts.length === 0) return null;
  return { speaker: 'NOTEBOOK', text: parts.join(' '), notice: true };
}
