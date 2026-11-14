// Evidence and observations: what the player knows.
//
// Everything here reads or writes caseState.knowledge, which survives a
// rewind. Plain functions with no Phaser dependency.
//
// Evidence is a physical or documentary thing (a ticket, a bag).
// A fact is something learned (an observation). The notebook keeps the two
// apart on purpose: see plan.md section 10.2.

export function hasEvidence(caseState, id) {
  return caseState.knowledge.knownEvidence.includes(id);
}

export function hasFact(caseState, id) {
  return caseState.knowledge.knownFacts.includes(id);
}

// Adds evidence to the notebook. Returns true if it was new, false if the
// player already had it (nothing is added twice).
export function addEvidence(caseState, id) {
  if (hasEvidence(caseState, id)) return false;
  caseState.knowledge.knownEvidence.push(id);
  return true;
}

// Adds a learned fact. Returns true if it was new.
export function addFact(caseState, id) {
  if (hasFact(caseState, id)) return false;
  caseState.knowledge.knownFacts.push(id);
  return true;
}

// Builds the notebook contents for display, in the order things were found.
//
// Returns a list of tabs:
//   { title, emptyText, entries: [{ title?, text }] }
export function notebookTabs(caseData, caseState) {
  return [
    {
      title: 'Evidence',
      emptyText: 'No evidence collected yet.',
      entries: caseState.knowledge.knownEvidence.map((id) => ({
        title: caseData.evidence[id].name,
        text: caseData.evidence[id].description,
      })),
    },
    {
      title: 'Observations',
      emptyText: 'Nothing noted yet.',
      entries: caseState.knowledge.knownFacts.map((id) => ({
        text: caseData.facts[id].text,
      })),
    },
  ];
}
