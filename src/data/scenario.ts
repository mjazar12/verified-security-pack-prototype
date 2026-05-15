export type GateDecision = "approved" | "rejected" | null;
export type DiffKind = "context" | "add" | "remove";

export interface DiffLine {
  no: number;
  kind: DiffKind;
  text: string;
}

export interface DemoScene {
  label: string;
  cta: string;
}

export const scenarioPrompt =
  "Refactor our refresh-token flow in src/auth/refresh.ts. Replace auth_tokens_v1 with the new auth_sessions store. Ship before Friday.";

export const demoScenes: DemoScene[] = [
  { label: "ready", cta: "Run prompt" },
  { label: "trigger", cta: "Enable pack" },
  { label: "delta", cta: "Continue" },
  { label: "gate", cta: "Approve gate" },
  { label: "summary", cta: "Restart demo" }
];

export const repoSignals = [
  "src/auth/refresh.ts: SELECT * FROM auth_tokens_v1 WHERE token=$1",
  "migrations/2026_05_auth_sessions.sql: CREATE TABLE auth_sessions",
  "migrations/2026_05_auth_sessions.sql: DROP TABLE IF EXISTS auth_tokens_v1;",
  "package.json: jsonwebtoken, bcrypt, pg"
];

export const triggerRows = [
  ["risk", "auth token flow + destructive database migration"],
  ["matched", "OWASP A01 access control, secrets handling, DB write"],
  ["enable", "semgrep, dependency audit, checkpoint, approval gate"],
  ["next", "press Enter to enable guarded run"]
];

export const refreshDiff: DiffLine[] = [
  { no: 12, kind: "add", text: 'import { z } from "zod";' },
  { no: 13, kind: "add", text: "const RefreshBody = z.object({ token: z.string().min(32) });" },
  { no: 27, kind: "context", text: "export async function refresh(req, res) {" },
  { no: 28, kind: "remove", text: "  const { token } = req.body;" },
  { no: 28, kind: "add", text: "  const parsed = RefreshBody.safeParse(req.body);" },
  { no: 29, kind: "add", text: '  if (!parsed.success) return res.status(400).json({ error: "invalid_request" });' },
  { no: 30, kind: "add", text: "  const { token } = parsed.data;" },
  { no: 41, kind: "remove", text: '  console.log("refresh token", token);' },
  { no: 41, kind: "add", text: '  audit.info("refresh token rotation requested");' },
  { no: 52, kind: "context", text: "  return rotateSession(row.user_id);" },
  { no: 53, kind: "context", text: "}" }
];

export const approvalSql = "DROP TABLE IF EXISTS auth_tokens_v1;";

export const summaryItems = [
  {
    label: "Input validation",
    text: "src/auth/refresh.ts now validates refresh-token bodies before rotation."
  },
  {
    label: "Secret handling",
    text: "Removed raw token logging and replaced it with a non-sensitive audit event."
  },
  {
    label: "Security Pack checks",
    text: "Auth tests, token-log scan, dependency audit, and checkpoint all recorded."
  },
  {
    label: "Approval gate",
    text: "Destructive SQL has a human decision attached to the PR artifact."
  },
  {
    label: "PR rationale",
    text: "Artifact explains scope, risk, checks run, and the simulated nature of the prototype."
  }
];

export function gateDecisionText(decision: Exclude<GateDecision, null>) {
  return decision === "approved"
    ? "migration can proceed with approval receipt"
    : "PR keeps legacy table and files cleanup issue";
}
