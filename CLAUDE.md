# CLAUDE.md

## Project Goal

Build a GitHub-ready prototype suite for the Verified Security Pack concept. The suite must communicate the product promise clearly in a 4-minute live demo: Claude Code detects security-sensitive work, offers a curated Security Pack, adds security-aware planning, gates destructive actions, and produces a PR-ready artifact.

## Primary Audience

The main audience is the professor and evaluators watching a live product-management demo. The product should also be understandable if someone opens it cold, but live-demo clarity has priority.

## Product Narrative

Use the `payments-api` refresh-token migration scenario as the hero path:

- The project contains auth middleware, refresh-token logic, PostgreSQL migrations, and OWASP-relevant dependencies.
- The user asks Claude to replace `auth_tokens_v1` with `auth_sessions`.
- The Verified Security Pack adds curated checks, scoped tool use, checkpoints, Plan Mode security context, human approval gates, and a shareable PR security rationale.
- The destructive action is `DROP TABLE auth_tokens_v1`; it must always require explicit human approval in the Pack-enabled flow.

## UX Guardrails

- Keep `/demo` as the hero experience.
- Optimize for a 4-minute walkthrough with one obvious primary action per step.
- Disable impossible actions instead of letting users break the scenario.
- Provide recovery controls: reset, replay run, previous/next step, command palette, and jump to PR artifact.
- Preserve both approval and rejection paths for the destructive gate.
- Label simulated checks clearly. Never imply the prototype is running real security scans or certifying production security.

## Autocomplete Behavior

- Keep the default task prefilled so the demo works with zero typing.
- Provide quick-pick task templates for refresh-token migration, payment webhook hardening, and admin role audit.
- Offer suggestions for file paths, migration names, auth/security terms, and full task templates.
- Support keyboard selection in the composer suggestions.
- Empty input should still show helpful suggested tasks.

## Implementation Constraints

- Use React + TypeScript in a Vite app.
- Keep scenario content in typed data objects rather than scattering hardcoded strings through components.
- Model the guided demo as a finite set of states.
- Keep components reusable across routes where practical.
- Avoid backend dependencies. This is a static, deployable product prototype.

## Acceptance Criteria

- `npm run build` succeeds.
- All routes render directly: `/`, `/demo`, `/desktop`, `/cli`, `/handoff`.
- `/demo` can be completed from start to PR artifact without typing.
- Approval and rejection paths produce coherent PR artifacts.
- Autocomplete suggestions appear while typing and support keyboard selection.
- Desktop, projector-size, and mobile layouts do not overlap or clip primary text.
