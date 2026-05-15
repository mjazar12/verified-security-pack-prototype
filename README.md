# Verified Security Pack Prototype

This repo contains a static Vite + React prototype for the MGMT 275 Product Delivery final project. It demonstrates a simulated Claude Code workflow where security-sensitive work is detected, guarded, checkpointed, gated, and summarized for review.

The prototype is a product simulation. It does not run real security scans, mutate a real repo, or certify code.

## Demo Paths

- `/` - professor-facing landing page with GUI and CLI demo choices
- `/gui` - Claude Code desktop-style GUI demo
- `/cli` - terminal-native CLI demo
- `/demo` - compatibility alias for the CLI demo

## Demo Goal

Both demos tell the same `payments-api` refresh-token migration story:

1. The user starts mid-work with a prefilled task.
2. Claude detects auth, token, dependency, and destructive database-migration risk signals.
3. The Verified Security Pack adds checks, checkpoints, and a safer plan.
4. A human approval gate blocks `DROP TABLE IF EXISTS auth_tokens_v1;`.
5. The demo ends on a PR-ready artifact with the gate decision and security rationale.

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

## Vercel Routing

`vercel.json` rewrites all routes to `index.html` so direct links such as `/gui`, `/cli`, and `/demo` work on Vercel.

## Demo Controls

- `Enter` advances the GUI and CLI demos.
- On the final scene, `Enter` restarts the active demo from the beginning.
- The visible primary button mirrors `Enter`.
- `R` resets to the first scene.
- In the CLI demo, `T` toggles a compact transcript preview.
- The demo controls include a Landing link for switching between GUI and CLI.
- At the approval gate, the secondary button can reject the destructive migration instead of approving it.
