import { useEffect, useState } from "react";
import {
  approvalSql,
  demoScenes,
  gateDecisionText,
  refreshDiff,
  repoSignals,
  scenarioPrompt,
  summaryItems,
  triggerRows,
  type DiffLine,
  type GateDecision
} from "../data/scenario";

const guiStepCounts = [0, 5, 6, 4, 8];

const composerCommands = [
  scenarioPrompt,
  "/security-pack enable --scope refresh-token-migration",
  "continue guarded implementation",
  `approve gate: ${approvalSql}`,
  "restart demo from the beginning"
];

export function GuiRoute() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [gateDecision, setGateDecision] = useState<GateDecision>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const scene = demoScenes[sceneIndex];
  const maxSteps = guiStepCounts[sceneIndex];
  const isStreaming = sceneIndex > 0 && visibleSteps < maxSteps;

  const reset = () => {
    setSceneIndex(0);
    setGateDecision(null);
    setVisibleSteps(0);
  };

  const finishOutput = () => setVisibleSteps(maxSteps);

  const advance = () => {
    if (isStreaming) {
      finishOutput();
      return;
    }

    if (sceneIndex === 3) {
      setGateDecision("approved");
      setSceneIndex(4);
      return;
    }

    if (sceneIndex >= demoScenes.length - 1) {
      reset();
      return;
    }

    setSceneIndex((current) => Math.min(current + 1, demoScenes.length - 1));
  };

  const rejectGate = () => {
    if (sceneIndex !== 3 || visibleSteps < 3) return;
    setGateDecision("rejected");
    setSceneIndex(4);
  };

  useEffect(() => {
    if (sceneIndex === 0) {
      setVisibleSteps(0);
      return;
    }

    setVisibleSteps(0);
    const timers = Array.from({ length: maxSteps }, (_, index) =>
      window.setTimeout(() => {
        setVisibleSteps((current) => Math.max(current, index + 1));
      }, 420 + index * 460)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [maxSteps, sceneIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        advance();
      }
      if (event.key.toLowerCase() === "r") {
        reset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className="gui-demo-page">
      <section className="claude-window" aria-label="Claude Code desktop simulation">
        <aside className="claude-sidebar">
          <div className="window-controls" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="mode-tabs" aria-label="Mode selector">
            <span>Chat</span>
            <span>Cowork</span>
            <b>Code</b>
          </div>
          <nav className="side-actions" aria-label="Claude Code actions">
            <span>+ New session</span>
            <span>⌁ Routines</span>
            <span>▣ Customize</span>
            <span>⌄ More</span>
          </nav>
          <div className="recents">
            <div className="recents-title">Recents</div>
            <div className="recent-item active">
              <span>⌘</span>
              <b>Identify common security vulnerabilities</b>
            </div>
          </div>
          <div className="sidebar-user">
            <span>D</span>
            <b>Demo User</b>
            <em>Prototype</em>
          </div>
        </aside>

        <section className="claude-main">
          <header className="claude-topbar">
            <div>
              <b>payments-api</b>
              <span>/ refresh-token migration</span>
            </div>
            <div className="topbar-icons" aria-hidden="true">
              <LiveStatus sceneIndex={sceneIndex} isStreaming={isStreaming} visibleSteps={visibleSteps} />
              <span>▤</span>
              <span>▥</span>
            </div>
          </header>

          <div className="claude-workspace">
            <GuiScene sceneIndex={sceneIndex} gateDecision={gateDecision} visibleSteps={visibleSteps} />
          </div>

          <div className="composer-dock">
            <div className="repo-strip">
              <span className="branch-pill">⌘ #1</span>
              <b>claude/payments-security-pack</b>
              <span className="diff-stat">{sceneIndex < 2 ? "+0 -0" : sceneIndex === 2 ? "+5 -2" : "+39 -3"}</span>
              <span className="ci-pill">● CI</span>
            </div>
            <div className={`gui-composer ${sceneIndex > 0 ? "submitted" : ""}`}>
              <span>{composerCommands[sceneIndex]}</span>
              <button type="button" onClick={advance} aria-label="Advance demo">
                ↵
              </button>
            </div>
            <div className="composer-footer">
              <span>Ask permissions</span>
              <span>+</span>
              <span>Sonnet 4.6 · High</span>
            </div>
          </div>
        </section>
      </section>

      <div className="floating-controls gui-controls">
        <a className="secondary-button nav-link" href="/">
          Landing
        </a>
        <button className={sceneIndex === 3 ? "danger-button" : "primary-button"} type="button" onClick={advance}>
          {isStreaming ? "Finish output" : scene.cta} <span>↵</span>
        </button>
        {sceneIndex === 3 && visibleSteps >= 3 ? (
          <button className="secondary-button" type="button" onClick={rejectGate}>
            Reject gate
          </button>
        ) : null}
        <button className="secondary-button" type="button" onClick={reset}>
          Reset <span>R</span>
        </button>
      </div>
    </main>
  );
}

function GuiScene({
  sceneIndex,
  gateDecision,
  visibleSteps
}: {
  sceneIndex: number;
  gateDecision: GateDecision;
  visibleSteps: number;
}) {
  const show = (step: number) => visibleSteps >= step;

  if (sceneIndex === 0) {
    return (
      <div className="empty-workspace">
        <span>No messages yet.</span>
      </div>
    );
  }

  if (sceneIndex === 1) {
    return (
      <div className="activity-panel">
        <SubmittedPrompt text={scenarioPrompt} />
        {!show(1) ? <ThinkingRow text="Claude is checking repo context before editing..." /> : null}
        {show(1) ? (
          <ActivityHeader
            title="Security-sensitive work detected"
            eyebrow="Risk detected before edits"
            narration="I found auth-token code, a new session table, and a destructive migration in the same task."
          />
        ) : null}
        {show(2) ? (
          <ToolCall
            title="Search repo signals"
            status="complete"
            rows={[
              'rg "auth_tokens_v1|auth_sessions|refresh|DROP TABLE"',
              ...repoSignals
            ]}
          />
        ) : null}
        {show(3) ? <ToolCall title="Classify risk" status="complete" rows={["auth flow", "token storage", "DB write"]} /> : null}
        {show(4) ? (
          <div className="pack-result live-section">
            {triggerRows.map(([label, value]) => (
              <ActivityRow key={label} label={label} value={value} />
            ))}
          </div>
        ) : null}
        {show(5) ? <NextAction text="Press Enter to enable checkpoints, checks, approval gate, and PR rationale." /> : null}
      </div>
    );
  }

  if (sceneIndex === 2) {
    return (
      <div className="activity-panel">
        <SubmittedPrompt text={composerCommands[1]} />
        {!show(1) ? <ThinkingRow text="Claude is preparing a guarded edit plan..." /> : null}
        {show(1) ? (
          <ActivityHeader
            title="Guarded plan running"
            eyebrow="Pack enabled"
            narration="I’m keeping the change narrow: validate input, remove token logging, and checkpoint before DB work."
          />
        ) : null}
        {show(2) ? (
          <ToolCall
            title="Read(src/auth/refresh.ts)"
            status="complete"
            rows={["loaded refresh handler", "found raw token body read", "found unsafe token log line"]}
          />
        ) : null}
        {show(3) ? (
          <div className="plan-grid live-section">
            <WorkCard title="Plan" items={["Validate refresh body", "Remove token logging", "Checkpoint before DB write"]} />
            <WorkCard title="Checks" items={["auth tests", "token-log scan", "dependency audit"]} />
          </div>
        ) : null}
        {show(4) ? <ToolCall title="Update(src/auth/refresh.ts)" status={show(5) ? "complete" : "running"} rows={["applying schema validation", "removing sensitive log"]} /> : null}
        {show(5) ? <GuiDiff lines={refreshDiff} /> : null}
        {show(6) ? (
          <ToolCall
            title="Verify guarded path"
            status="complete"
            rows={["auth tests: 42 passed", "semgrep simulated check: no token logging", "checkpoint: before-db-migration saved"]}
          />
        ) : null}
      </div>
    );
  }

  if (sceneIndex === 3) {
    return (
      <div className="activity-panel gate-activity">
        <SubmittedPrompt text="npm run migrate:auth-sessions" />
        {!show(1) ? <ThinkingRow text="Claude is checking the migration before execution..." /> : null}
        {show(1) ? (
          <ActivityHeader
            title="Approval required"
            eyebrow="Destructive DB action blocked"
            narration="I reached an irreversible database step, so the Security Pack is pausing before execution."
          />
        ) : null}
        {show(2) ? (
          <ToolCall
            title="Bash(psql $DATABASE_URL -f migrations/2026_05_auth_sessions.sql)"
            status="blocked"
            rows={["blocked by Verified Security Pack", "checkpoint: before-db-migration", "no database write executed"]}
          />
        ) : null}
        {show(3) ? <GateBlock /> : null}
        {show(4) ? <NextAction text="Press Enter to approve for the demo, or choose Reject gate to keep the table." danger /> : null}
      </div>
    );
  }

  const approved = gateDecision !== "rejected";
  const visibleSummary = summaryItems.slice(0, Math.max(0, visibleSteps - 1));

  return (
    <div className="activity-panel">
      <SubmittedPrompt text="open PR artifact for review" />
      {!show(1) ? <ThinkingRow text="Claude is assembling the PR artifact..." /> : null}
      {show(1) ? (
        <ActivityHeader
          title="PR artifact ready"
          eyebrow="Security Pack summary"
          narration="I’m writing the review artifact with scope, checks, gate decision, and simulated-output disclosure."
        />
      ) : null}
      {show(2) ? (
        <ol className="gui-summary-list live-section">
          {visibleSummary.map((item) => (
            <li key={item.label}>
              <b>{item.label}</b>
              <span>
                {item.label === "Approval gate"
                  ? `Destructive SQL was ${approved ? "approved by a human" : "rejected and moved to a follow-up"}.`
                  : item.text}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
      {show(7) ? (
        <div className="artifact-receipt live-section">
          <span>Gate decision</span>
          <b>{approved ? "Approved" : "Rejected"}</b>
          <span>Result</span>
          <b>{gateDecisionText(approved ? "approved" : "rejected")}</b>
        </div>
      ) : null}
      {show(8) ? <NextAction text="End of GUI demo. Press Enter to restart from the empty workspace, or use Landing to switch demos." /> : null}
    </div>
  );
}

function LiveStatus({
  sceneIndex,
  isStreaming,
  visibleSteps
}: {
  sceneIndex: number;
  isStreaming: boolean;
  visibleSteps: number;
}) {
  const labels = ["Ready", "Scanning", "Working", "Gate blocked", "PR artifact"];
  const status = isStreaming ? labels[sceneIndex] : sceneIndex === 0 ? "Ready" : "Waiting";
  const tone = sceneIndex === 3 && visibleSteps >= 2 ? "danger" : sceneIndex >= 4 ? "success" : isStreaming ? "active" : "idle";

  return <span className={`live-status ${tone}`}>● {status}</span>;
}

function SubmittedPrompt({ text }: { text: string }) {
  return (
    <div className="submitted-prompt">
      <span>You</span>
      <p>{text}</p>
    </div>
  );
}

function ThinkingRow({ text }: { text: string }) {
  return (
    <div className="thinking-row" aria-live="polite">
      <span />
      <b>{text}</b>
    </div>
  );
}

function ActivityHeader({ eyebrow, narration, title }: { eyebrow: string; narration: string; title: string }) {
  return (
    <div className="activity-header live-section">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{narration}</p>
      <em>Simulated prototype output. No real security certification is being performed.</em>
    </div>
  );
}

function ActivityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="activity-row">
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

function ToolCall({ rows, status, title }: { rows: string[]; status: "running" | "complete" | "blocked"; title: string }) {
  return (
    <div className={`tool-call ${status} live-section`}>
      <div className="tool-call-title">
        <span>{status === "complete" ? "✓" : status === "blocked" ? "!" : "•"}</span>
        <b>{title}</b>
        <em>{status}</em>
      </div>
      <div className="tool-call-output">
        {rows.map((row) => (
          <code key={row}>{row}</code>
        ))}
      </div>
    </div>
  );
}

function NextAction({ danger = false, text }: { danger?: boolean; text: string }) {
  return <div className={`next-action ${danger ? "danger" : ""}`}>{text}</div>;
}

function WorkCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="work-card">
      <b>{title}</b>
      {items.map((item) => (
        <span key={item}>● {item}</span>
      ))}
    </div>
  );
}

function GateBlock() {
  return (
    <div className="gate-block gui-gate-block live-section">
      <div className="gate-title">APPROVAL REQUIRED: destructive database action</div>
      <div className="sql-callout pulse-gate">{approvalSql}</div>
      <div className="activity-list">
        <ActivityRow label="why" value="removes legacy refresh-token table after auth_sessions cutover" />
        <ActivityRow label="risk" value="irreversible production data change without human confirmation" />
        <ActivityRow label="enter" value="approve for demo and continue to PR artifact" />
        <ActivityRow label="reject" value="keep table and add cleanup follow-up to PR artifact" />
      </div>
    </div>
  );
}

function GuiDiff({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="gui-diff live-section" aria-label="Code delta">
      <div className="gui-diff-title">Update(src/auth/refresh.ts) · Added 5 lines, removed 2 lines</div>
      {lines.map((line, index) => (
        <div className={`gui-diff-line ${line.kind}`} key={`${line.no}-${index}-${line.text}`}>
          <span>{line.no}</span>
          <i>{line.kind === "add" ? "+" : line.kind === "remove" ? "-" : ""}</i>
          <code>{line.text}</code>
        </div>
      ))}
    </div>
  );
}
