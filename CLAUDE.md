# Verified Security Pack Product Spec And Implementation Guide

## Product Thesis

Developers increasingly use agentic coding tools for real engineering work, including security-sensitive changes. The risk is not that the tool cannot write code. The risk is that it can move through auth, token, dependency, and database changes without enough friction at the moments where judgment matters.

Verified Security Pack is a prototype for a Claude Code guardrail layer that appears at the moment of risk. It detects security-sensitive work, adds scoped planning and simulated checks, checkpoints before risky actions, blocks destructive database operations behind human approval, and produces a PR-ready artifact for review.

This prototype is a product simulation. It does not run real security scans, certify code, mutate a real repository, or execute database commands.

## Target User

Primary user:

- A developer using Claude Code to make application changes that touch authentication, token storage, dependencies, or database migrations.

Secondary user:

- A reviewer, professor, evaluator, or engineering lead who wants to understand whether the agent's work was scoped, checked, gated, and explainable.

Primary job to be done:

- "Help me move fast on security-sensitive code without accidentally skipping the checks, approvals, and rationale that responsible engineering work requires."

## Problem Statement

Security-sensitive tasks often look like normal feature work until the agent is already deep into the code. In the demo scenario, a refresh-token refactor touches:

- Auth route behavior
- Token storage
- Dependency risk
- PostgreSQL migrations
- A destructive cleanup statement

Without a guardrail layer, an agent could produce a plausible implementation while hiding the most important questions:

- Did it notice this was auth-sensitive?
- Did it avoid logging secrets?
- Did it checkpoint before risky work?
- Did it block irreversible database actions?
- Did it produce a review artifact that explains what happened?

## Solution Concept

Verified Security Pack adds a guided security workflow around risky coding tasks:

1. Detect security-sensitive work from code, dependency, and migration signals.
2. Offer a Pack at the moment of need.
3. Add a scoped plan before implementation.
4. Run simulated checks and show what would be verified.
5. Create checkpoints before risky edits or migrations.
6. Block destructive actions until a human approves.
7. Generate a PR-ready artifact with scope, checks, decision history, and reviewer rationale.

The demo shows this concept in two surfaces:

- A Claude Code desktop-style GUI.
- A terminal-native CLI flow.

Both surfaces tell the same story and should stay aligned.

## Demo Scenario

Project: `payments-api`

Task prompt:

```text
Refactor our refresh-token flow in src/auth/refresh.ts. Replace auth_tokens_v1 with the new auth_sessions store. Ship before Friday.
```

Core security moment:

```sql
DROP TABLE IF EXISTS auth_tokens_v1;
```

The destructive SQL must always be shown as blocked before the final human decision.

## Demo Narrative

The product story has five scenes:

1. **Entry Point**
   - The user is already mid-work.
   - The prompt is prefilled.
   - No typing is required.

2. **Security Pack Trigger**
   - Claude inspects repo context.
   - Signals include auth code, token storage, dependencies, and destructive migration content.
   - The Pack appears because the task has crossed into security-sensitive work.

3. **Guarded Work**
   - Claude switches into a scoped plan.
   - The demo shows schema validation, removal of unsafe token logging, checkpointing, and simulated checks.
   - The code delta is intentionally small and readable.

4. **Approval Gate**
   - The destructive database action is blocked.
   - No database write is executed.
   - The user can approve or reject.

5. **PR Artifact**
   - The final artifact summarizes title, risk, checks, gate decision, and reviewer note.
   - The artifact should feel useful for review, not just decorative.

## Routes

- `/` - landing page with GUI and CLI choices.
- `/gui` - Claude Code desktop-style GUI demo.
- `/cli` - terminal-native CLI demo.
- `/demo` - compatibility alias for the CLI demo.
- Unknown paths fall back to the landing page through the app path switch.

Vercel uses `vercel.json` to rewrite all routes to `index.html` so direct links work in production.

## UX Principles

### Global

- The demo must be understandable without narration.
- One obvious primary action should be visible at each moment.
- The main flow should work by pressing `Enter`.
- `R` resets the active demo.
- A Landing control should always let users return to route selection.
- The final scene must clearly say that pressing `Enter` restarts the demo.
- Simulated outputs must be labeled as simulated and must not imply real certification.

### GUI Demo

The GUI should imitate a Claude Code desktop surface:

- Dark app shell.
- Left sidebar.
- Code tab selected.
- Project title in the top bar.
- Large center workspace.
- Bottom composer/status area.
- Prefilled task at the start.

The GUI should feel alive through:

- Submitted prompt animation.
- Thinking/working rows.
- Live status pill.
- Tool-call rows with running, complete, and blocked states.
- Code diff reveal.
- Approval gate emphasis.
- Final artifact assembly.

Do not turn the GUI into a dashboard. Keep the center activity stream as the main experience.

### CLI Demo

The CLI should remain terminal-native:

- No fake GUI cards inside the terminal.
- Scene-based screens, not one long transcript.
- Bash, Read, Update, Result, checkpoint, and PR artifact blocks should look plausible in a terminal.
- Optional depth can live behind the `T` transcript toggle.
- Keep default output sparse enough for a live walkthrough.

## Controls

| Control | Behavior |
| --- | --- |
| `Enter` | Advance the active demo. If output is still revealing, finish the current scene first. |
| `R` | Reset to the first scene. |
| `T` | Toggle transcript preview in the CLI demo. |
| Landing | Return to the landing page. |
| Reject gate | Reject the destructive action and carry that decision into the final artifact. |

## Security Claim Boundaries

The prototype must never claim or imply that it:

- Runs real Semgrep, CodeQL, dependency, or secret scans.
- Certifies code as secure.
- Executes database migrations.
- Writes to a real repository.
- Connects to production systems.
- Guarantees OWASP compliance.

Allowed language:

- "simulated checks"
- "prototype output"
- "PR-ready rationale"
- "approval gate"
- "security-sensitive signals"

Avoid language like:

- "verified secure"
- "certified"
- "production-safe"
- "guaranteed"
- "real scan result"

## Implementation Overview

Stack:

- Vite
- React
- TypeScript
- Static deployment on Vercel

Important files:

- `src/App.tsx` - lightweight route switch for `/`, `/gui`, `/cli`, and `/demo`.
- `src/data/scenario.ts` - shared prompt, scene labels, diff lines, security signals, SQL gate, and summary copy.
- `src/routes/LandingRoute.tsx` - landing page and demo selection.
- `src/routes/GuiRoute.tsx` - Claude Code desktop-style GUI demo.
- `src/routes/DemoRoute.tsx` - CLI demo implementation.
- `src/routes/CliRoute.tsx` - CLI route alias.
- `src/styles/app.css` - global styles for landing, GUI, and CLI.
- `vercel.json` - SPA fallback rewrite for deployed routes.

Routing intentionally avoids React Router because the app only needs a few static demo paths.

## Data And State Model

Shared scenario data should live in `src/data/scenario.ts` so GUI and CLI stay consistent.

Core shared concepts:

- `scenarioPrompt`
- `demoScenes`
- `repoSignals`
- `triggerRows`
- `refreshDiff`
- `approvalSql`
- `summaryItems`
- `gateDecisionText`

Both demos should model state with:

- `sceneIndex`
- `gateDecision`
- reveal/progress state for staged output

Do not duplicate product copy across GUI and CLI when it can be shared safely.

## Visual Design Guidance

Avoid:

- Marketing hero pages for the main demo routes.
- Dense dashboards.
- Extra panels that compete with the main story.
- Decorative gradient/orb backgrounds.
- UI that requires guessing what to click.

Prefer:

- Quiet, work-focused surfaces.
- Short labels.
- Stable dimensions.
- Clear status and progress.
- One main action per scene.
- Realistic terminal and Claude Code visual language.

## Acceptance Criteria

Functional:

- `npm run build` succeeds.
- `/` renders the landing page.
- `/gui` renders the GUI demo directly and after refresh.
- `/cli` renders the CLI demo directly and after refresh.
- `/demo` aliases to the CLI demo.
- Unknown paths fall back to the landing page.

Interaction:

- `Enter` advances GUI and CLI demos.
- If a scene is revealing output, `Enter` finishes that output before advancing.
- `R` resets the active demo.
- CLI `T` toggles transcript preview.
- Approval and reject paths both produce coherent final artifacts.
- Final scene clearly indicates that `Enter` restarts the demo.

Narrative:

- Both GUI and CLI show the same five-step story.
- The destructive SQL gate is clearly blocked before approval.
- The final artifact includes risk, checks, gate decision, and reviewer note.
- Simulation limits are visible and accurate.

## Maintenance Checklist

Before committing:

1. Run `npm run build`.
2. Check `/`, `/gui`, `/cli`, and `/demo`.
3. Search for private placeholder text.
4. Confirm no private recording scripts are staged.
5. Confirm Security Pack claims are framed as simulated.
6. Keep GUI and CLI story beats aligned.

Before deploying:

1. Push to GitHub `main`.
2. Confirm Vercel build succeeds.
3. Open the live `/gui` route directly.
4. Open the live `/cli` route directly.
5. Verify Vercel rewrite behavior is working.
