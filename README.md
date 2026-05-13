# Verified Security Pack Prototype Suite

This repo contains a polished demo suite for the MGMT 275 Product Delivery final project. The prototype shows how a Verified Security Pack could make Claude Code safer and clearer for security-sensitive work such as auth, token, and database migration changes.

## Demo Goal

The primary path is a 4-minute live walkthrough:

1. Open the launcher and start the guided demo.
2. Show security-sensitive project detection.
3. Inspect and enable the Verified Security Pack.
4. Review the security-aware plan.
5. Run the simulated agent.
6. Resolve the destructive database approval gate.
7. End on the PR artifact.

The prototype is a product simulation. It does not run real security scans or certify code.

## Routes

- `/` - launcher and suite overview
- `/demo` - guided interactive dummy app with guardrails and autocomplete
- `/desktop` - desktop-app prototype surface for T1/T2/control comparison
- `/cli` - terminal-native prototype surface
- `/handoff` - concise grading/demo handoff page

Legacy standalone HTML files are still present in the project root for reference.

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

## Demo Controls

The guided demo keeps users inside valid states. Buttons are disabled when an action would not make sense, the approval gate cannot be resolved before the simulated destructive step appears, and the command palette exposes safe shortcuts for presenter recovery.

The task composer includes a prefilled task, quick-pick templates, and autocomplete suggestions for file paths, migration names, auth/security terms, and full task templates.
