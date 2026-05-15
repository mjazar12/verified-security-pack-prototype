# CLAUDE.md

## Project Goal

Build a GitHub-ready prototype for the Verified Security Pack concept. The demo must communicate the product promise clearly in a short live walkthrough: Claude Code detects security-sensitive work, offers a curated Security Pack, adds security-aware planning, gates destructive actions, and produces a PR-ready artifact.

## Primary Audience

The main audience is the professor and evaluators watching a product-management demo. Live-demo clarity is more important than exploratory breadth.

## Product Narrative

Use the `payments-api` refresh-token migration scenario as the only hero path:

- The project contains auth middleware, refresh-token logic, PostgreSQL migrations, and OWASP-relevant dependencies.
- The presenter submits a prefilled task asking Claude to replace `auth_tokens_v1` with `auth_sessions`.
- The Verified Security Pack appears at the moment of need and adds checks, scoped planning, a destructive-action approval gate, and a shareable PR rationale.
- The destructive action is `DROP TABLE IF EXISTS auth_tokens_v1;`; it must always be shown as blocked before the final human decision.

## UX Guardrails

- `/` should be a simple landing page with GUI and CLI choices.
- `/gui` should imitate the provided Claude Code desktop screenshot: dark app shell, left sidebar, Code tab selected, top project title, empty center workspace, and bottom composer/status area.
- `/cli` and `/demo` should preserve the terminal-native flow.
- Optimize both demos for pressing `Enter` through the entire story without typing.
- Keep recovery simple: `R` resets, and a visible button mirrors the current keyboard action.
- The final scene of each demo must clearly say that pressing `Enter` restarts the demo.
- Both demo routes should include visible navigation back to the landing page.
- The CLI may include optional depth behind a transcript toggle, but the default flow should stay scene-based and sparse.
- Label the experience as simulated. Never imply the prototype is running real security scans or certifying production security.

## Implementation Constraints

- Use React + TypeScript in a Vite app.
- Keep the app static and deployable with no backend dependency.
- Do not add React Router unless route needs grow beyond the current lightweight path switch.
- Keep shared scenario copy and diff data in `src/data/scenario.ts` so GUI and CLI stay aligned.
- Avoid reintroducing dense dashboards, command palettes, or artifact side panels until the GUI and CLI core flows are polished.

## Acceptance Criteria

- `npm run build` succeeds.
- `/`, `/gui`, `/cli`, and `/demo` render directly and after refresh.
- Pressing `Enter` advances through all GUI and CLI scenes.
- Pressing `R` resets the active demo.
- The gate scene clearly pauses on `DROP TABLE IF EXISTS auth_tokens_v1;`.
- The GUI starts as an empty Claude Code desktop-style session with a prefilled composer.
