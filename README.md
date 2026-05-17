# Verified Security Pack Prototype

**Live demo:** https://verified-security-pack-prototype.vercel.app/

Verified Security Pack is a product prototype for developers working on security-sensitive code. It shows how Claude Code could detect risky auth, token, dependency, and database work, then add guardrails before the user accidentally ships an unsafe change.

This is a simulated prototype. It does not run real security scans, mutate a real repository, execute database commands, or certify production security.

## What To Try

- **Recommended path:** open `/gui` or click **GUI demo** from the landing page. This shows the concept inside a Claude Code desktop-style interface.
- **Technical path:** open `/cli` or click **CLI demo**. This shows the same story in a terminal-native Claude Code flow.
- **Compatibility route:** `/demo` aliases to the CLI demo.

## User And Problem

**User:** developers using Claude Code to work on security-sensitive application code.

**Problem:** normal coding tasks can quietly become high-risk when they touch authentication, token storage, dependencies, or destructive database migrations. Without explicit guardrails, an agentic coding tool can move too quickly through steps that should be checked, checkpointed, or approved by a human.

**Solution:** Verified Security Pack appears at the moment of risk. It adds scoped planning, simulated security checks, checkpoints, destructive-action approval gates, and a PR-ready rationale that reviewers can inspect.

## Demo Narrative

Both demos use the same `payments-api` refresh-token migration:

1. **Entry prompt:** the user starts mid-work with a prefilled task to replace `auth_tokens_v1` with `auth_sessions`.
2. **Detection:** Claude detects auth, token, dependency, and destructive migration signals.
3. **Guarded work:** the Pack adds a safer plan, checkpointing, simulated checks, and a focused code delta.
4. **Approval gate:** `DROP TABLE IF EXISTS auth_tokens_v1;` is blocked until a human approves or rejects it.
5. **PR artifact:** the demo ends with a review-ready summary covering scope, checks, gate decision, and security rationale.

## Key Features

- Security-sensitive work detection based on repo and migration signals.
- Guided plan before edits, including scoped work and checkpointing.
- Terminal-native and GUI-native versions of the same product story.
- Human approval gate for destructive database actions.
- Final PR artifact that explains risk, checks, and decision history.
- Explicit simulation labeling so the prototype does not overclaim real validation.

## Controls

| Control | Behavior |
| --- | --- |
| `Enter` | Advance the active demo. If output is streaming, finish the current scene first. |
| `R` | Reset the active demo to the first scene. |
| `T` | Toggle compact transcript preview in the CLI demo. |
| **Landing** | Return to the landing page to switch between GUI and CLI. |
| **Reject gate** | On the approval scene, reject the destructive migration and carry that decision into the artifact. |

On the final scene, pressing `Enter` restarts the active demo from the beginning.

## Technical Overview

- Built with Vite, React, and TypeScript.
- Uses lightweight path switching in `src/App.tsx`; no router dependency is required.
- Shared product copy, scenario data, diff lines, and gate copy live in `src/data/scenario.ts`.
- Main routes:
  - `src/routes/LandingRoute.tsx`
  - `src/routes/GuiRoute.tsx`
  - `src/routes/DemoRoute.tsx`
  - `src/routes/CliRoute.tsx`
- Global styling lives in `src/styles/app.css`.
- `vercel.json` rewrites all routes to `index.html` so direct links like `/gui`, `/cli`, and `/demo` work on Vercel.

## Local Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The default dev server is `http://127.0.0.1:5173/`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Deployment

The app is static and deploys cleanly on Vercel.

Recommended Vercel settings:

- Framework preset: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

The committed `vercel.json` file provides the SPA route fallback:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Product And Implementation Spec

See `CLAUDE.md` for the full product context, implementation guide, UX guardrails, security-claim boundaries, and acceptance criteria.
