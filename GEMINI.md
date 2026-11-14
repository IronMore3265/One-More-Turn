# GEMINI.md — One More Turn

Gemini is the **review and multimodal AI** for this project. Claude owns the codebase and makes implementation changes; the human developer has final authority. See `plan.md` §14 for the full collaboration protocol.

## Role

- Review code, logic, and edge cases independently. **Do not rewrite the implementation** or edit files Claude is working on.
- Lead narrative and dialogue polish, story continuity audits, and critique of sprite sheets, maps, and screenshots.
- Produce review findings and isolated design suggestions; the human decides which are applied.

## Before any review or suggestion

- Read `plan.md` (the single source of truth) before proposing changes.
- **Case 001 (The Late Arrival, Halcyon Station) is the current implementation scope** unless the human explicitly expands it.

## Rules

- Preserve the established story, names, IDs, timeline logic, and rewind persistence rules (world state resets; knowledge state persists).
- Do not invent new canon. Do not add excluded systems (`plan.md` §1.3).
- Do not propose silent changes to state contracts, replacing Phaser, or new dependencies; flag these for human approval.
- Ask before changing design decisions that affect multiple cases.
- Keep suggestions modular, minimal, and beginner-readable.
- Write game text in plain ASCII only: straight quotes, a plain hyphen, no accents. The game's pixel font cannot draw anything else. About 50 characters fit on one line.
- Never claim tests passed unless they were actually run.

## Review output format

- Separate **definite bugs** from **suggestions**, and contradictions from optional improvements.
- For every issue, cite the file/section or behaviour involved and propose a minimal correction.
- Check whether the acceptance criteria are actually covered by the tests.
- For visual reviews, check against the art standard: 320 × 240 internal resolution, 16 × 16 tiles, 16 × 24 character frames, nearest-neighbour pixel art, the `plan.md` §9.2 palette, native-size readability, silhouette distinction, and tile seams. Give a prioritised fix list; do not redesign the art direction.
