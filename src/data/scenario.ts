export type DemoStepId =
  | "detect"
  | "inspect"
  | "enable"
  | "plan"
  | "execute"
  | "gate"
  | "pr";

export type DemoArm = "control" | "t1_auto" | "t2_settings";
export type GateDecision = "approved" | "rejected" | null;

export type SuggestionKind = "template" | "file" | "migration" | "security" | "command";

export interface Suggestion {
  label: string;
  value: string;
  kind: SuggestionKind;
}

export interface TaskTemplate {
  id: string;
  label: string;
  task: string;
  risk: string;
}

export interface ScenarioCheck {
  title: string;
  description: string;
  category: "check" | "gate" | "artifact";
}

export const defaultTask =
  "Refactor our refresh-token flow in src/auth/refresh.ts. Replace auth_tokens_v1 with the new auth_sessions store. Ship before Friday.";

export const demoSteps: Array<{
  id: DemoStepId;
  label: string;
  title: string;
  time: string;
  cue: string;
}> = [
  {
    id: "detect",
    label: "Detect",
    title: "Security-sensitive project detected",
    time: "0:00",
    cue: "Open with the user problem: average developers do not know which safety checks to configure before touching auth code."
  },
  {
    id: "inspect",
    label: "Inspect Pack",
    title: "Show what the Pack adds",
    time: "0:35",
    cue: "Show that the Pack is transparent before activation: checks, tools, approval gates, and blocked behavior."
  },
  {
    id: "enable",
    label: "Enable",
    title: "One-click activation",
    time: "1:05",
    cue: "Explain the product thesis: the feature finds the user at the moment of need."
  },
  {
    id: "plan",
    label: "Plan",
    title: "Security-aware Plan Mode",
    time: "1:35",
    cue: "Point out the difference between generic planning and domain-aware planning."
  },
  {
    id: "execute",
    label: "Execute",
    title: "Simulated agent run",
    time: "2:15",
    cue: "Show checkpoints, tests, scans, and clear progress without pretending real scans are running."
  },
  {
    id: "gate",
    label: "Approval Gate",
    title: "Human approval before destructive DB action",
    time: "2:55",
    cue: "This is the sharpest proof point: checkpoint rollback cannot restore a dropped table."
  },
  {
    id: "pr",
    label: "PR Ready",
    title: "Shareable PR artifact",
    time: "3:35",
    cue: "Close on the team value: reviewers see the security rationale and gate decision."
  }
];

export const taskTemplates: TaskTemplate[] = [
  {
    id: "refresh-token",
    label: "Refresh-token migration",
    task: defaultTask,
    risk: "Auth flow, token handling, destructive migration"
  },
  {
    id: "webhook",
    label: "Payment webhook hardening",
    task:
      "Harden src/payments/webhook.ts by validating Stripe signatures, removing raw payload logging, and adding replay protection before launch.",
    risk: "Payment integrity, secrets, replay attack"
  },
  {
    id: "admin-audit",
    label: "Admin role audit",
    task:
      "Audit src/admin/roles.ts and migrations/2026_05_role_policy.sql so admin:* scopes require explicit role checks and denial audit logs.",
    risk: "Access control, privilege escalation, auditability"
  }
];

export const autocompleteSuggestions: Suggestion[] = [
  ...taskTemplates.map((template) => ({
    label: template.label,
    value: template.task,
    kind: "template" as const
  })),
  { label: "src/auth/refresh.ts", value: "src/auth/refresh.ts", kind: "file" },
  { label: "src/auth/sessionPolicy.ts", value: "src/auth/sessionPolicy.ts", kind: "file" },
  { label: "src/payments/webhook.ts", value: "src/payments/webhook.ts", kind: "file" },
  { label: "src/admin/roles.ts", value: "src/admin/roles.ts", kind: "file" },
  {
    label: "migrations/2026_05_drop_legacy_tokens.sql",
    value: "migrations/2026_05_drop_legacy_tokens.sql",
    kind: "migration"
  },
  { label: "auth_tokens_v1", value: "auth_tokens_v1", kind: "migration" },
  { label: "auth_sessions", value: "auth_sessions", kind: "migration" },
  { label: "OWASP A01 access control", value: "OWASP A01 access control", kind: "security" },
  { label: "OWASP A03 injection", value: "OWASP A03 injection", kind: "security" },
  { label: "secrets scan", value: "secrets scan", kind: "security" },
  { label: "approval gate", value: "approval gate", kind: "security" },
  { label: "checkpoint before edits", value: "checkpoint before edits", kind: "security" }
];

export const securityChecks: ScenarioCheck[] = [
  {
    title: "Authentication boundary review",
    description: "Refresh-token parsing, session rotation, and token logging are checked before patching.",
    category: "check"
  },
  {
    title: "Access-control review",
    description: "Privileged scopes require explicit role checks and denial audit logs.",
    category: "check"
  },
  {
    title: "Input validation and injection risk",
    description: "Request bodies and SQL access are reviewed for malformed input and unsafe queries.",
    category: "check"
  },
  {
    title: "Secrets and PII handling",
    description: "Diffs are checked for credential material and sensitive token logging.",
    category: "check"
  },
  {
    title: "Destructive database approval",
    description: "DROP, TRUNCATE, and irreversible migrations pause for explicit human approval.",
    category: "gate"
  },
  {
    title: "Security rationale artifact",
    description: "The PR records checks, gate decisions, test output, and rollback checkpoint.",
    category: "artifact"
  }
];

export const packRunLogs = [
  { text: "checkpoint created: before-security-pack-edits", tone: "good" },
  { text: "loaded Pack context: OWASP A01/A03/A07, token handling, migration gates", tone: "accent" },
  { text: "read src/auth/refresh.ts and src/auth/sessionPolicy.ts", tone: "muted" },
  { text: "patched request schema validation", tone: "good" },
  { text: "removed refresh-token value from logs", tone: "good" },
  { text: "ran npm test -- auth: 42 passed", tone: "good" },
  { text: "ran simulated secrets scan: no credential material in diff", tone: "good" },
  { text: "approval gate reached: DROP TABLE auth_tokens_v1", tone: "warn" }
] as const;

export const baseRunLogs = [
  { text: "read src/auth/refresh.ts", tone: "muted" },
  { text: "patched request schema validation", tone: "good" },
  { text: "ran npm test -- auth: 42 passed", tone: "good" },
  { text: "would run migration: DROP TABLE auth_tokens_v1", tone: "warn" },
  { text: "PR ready without Pack rationale artifact", tone: "good" }
] as const;

export const initialCode = [
  "export async function refresh(req, res) {",
  "  const { token } = req.body;",
  "  const row = await db.query(",
  "    \"SELECT * FROM auth_tokens_v1 WHERE token=$1\", [token]",
  "  );",
  "  console.log(\"refresh token\", token);",
  "  return rotateSession(row.user_id);",
  "}"
];

export const patchedCode = [
  "+ import { z } from \"zod\";",
  "+ const RefreshBody = z.object({ token: z.string().min(32) });",
  "  export async function refresh(req, res) {",
  "-   const { token } = req.body;",
  "+   const parsed = RefreshBody.safeParse(req.body);",
  "+   if (!parsed.success) return res.status(400).json({ error: \"invalid_request\" });",
  "+   const { token } = parsed.data;",
  "-   console.log(\"refresh token\", token);",
  "+   audit.info(\"refresh token rotation requested\");",
  "    return rotateSession(row.user_id);",
  "  }"
];

export const desktopSteps = [
  "Detect security-sensitive repo",
  "Inspect Pack contents",
  "Enable Pack from the surfaced banner",
  "Review security-aware Plan Mode",
  "Pause at approval gate",
  "Attach rationale to PR"
];

export const cliSteps = [
  "Session boot detects auth and migration signals",
  "Inline prompt offers inspect, enable, or skip",
  "Slash command exposes Pack contents",
  "Plan Mode shows scoped tools and checks",
  "DROP TABLE becomes a keyboard approval prompt",
  "PR summary includes Pack evidence"
];
