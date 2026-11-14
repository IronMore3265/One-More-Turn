# CLAUDE.md — One More Turn

Claude is the **primary implementation AI** and owns the codebase. Gemini reviews; the human developer has final authority. See `plan.md` §14 for the full collaboration protocol.

## Before any change

- Read `plan.md` (the single source of truth) and the relevant repository files.
- For anything beyond a small patch, summarise the files you intend to change and the acceptance criteria **before** editing.
- If the plan conflicts with the current code, stop and explain the conflict before making a broad change.

## Scope

- **Case 001 (The Late Arrival, Halcyon Station) is the current implementation scope** unless the human explicitly expands it.
- Do not begin Phase 2 (reusable case framework) until Case 001 works from start to report.
- Do not add excluded systems (`plan.md` §1.3): multiplayer, combat, crafting, farming, resource loops, procedural content, open world, real-time countdown pressure, morality meter.
- Implement only the agreed task. No unrelated features.

## Contracts to preserve

- Established story, character names, IDs (`N001_*`, `CP001_0839`, `CH00x_*`, `AR_*`, …), and timeline logic.
- Rewind rule: **world state resets; knowledge state persists** (`plan.md` §2.2, §7.2, §7.5). The checkpoint snapshot must never contain knowledge fields.
- Do not silently change state contracts. Ask before changing any design decision that affects multiple cases, and record it in the decision log (`plan.md` §15).

## Technical rules

- Stack: Phaser 3 + plain HTML/CSS/JavaScript (ES modules). No build step, no backend.
- Do not replace Phaser or introduce dependencies without approval.
- Internal resolution 320 × 240, 16 × 16 tiles, 16 × 24 character frames, nearest-neighbour filtering, integer scaling.
- Colours come from the palette in `src/config.js` (`plan.md` §9.2). Amber is for interaction/important information; red is for deviations only.
- All on-screen text is drawn with the hand-made pixel font in `src/ui/pixelFont.js`, through `addText` in `src/ui/text.js`. It covers printable ASCII only (no curly quotes, long dashes, or accents); `tests/font.test.js` checks the case text.
- Cases are authored as data; conditions and effects refer to stable IDs, never display text.
- Keep code modular and beginner-readable. Systems must not depend on each other's internals.
- Prefer a small patch over a large rewrite.

## Reporting

- List the files changed and explain how to verify the change in the browser.
- Never claim tests passed unless they were actually run; report exact results.
- Commit only when the human asks.

## Running the game

Phaser is loaded from a pinned CDN URL in `index.html`, and the source uses ES modules, so the game must be served over HTTP (opening `index.html` from disk will not work):

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>.
