import { useEffect, useMemo, useState } from "react";
import { CodePanel } from "../components/CodePanel";
import { CommandPalette, type PaletteCommand } from "../components/CommandPalette";
import { Modal } from "../components/Modal";
import { ShellChrome } from "../components/ShellChrome";
import { StatusBadge } from "../components/StatusBadge";
import { Stepper } from "../components/Stepper";
import { TaskComposer } from "../components/TaskComposer";
import {
  baseRunLogs,
  defaultTask,
  demoSteps,
  initialCode,
  packRunLogs,
  patchedCode,
  securityChecks,
  type DemoStepId,
  type GateDecision
} from "../data/scenario";

const stepOrder = demoSteps.map((step) => step.id);

function stepIndex(step: DemoStepId) {
  return stepOrder.indexOf(step);
}

function migrationLine(decision: GateDecision) {
  if (decision === "approved") return ["- DROP TABLE IF EXISTS auth_tokens_v1;"];
  if (decision === "rejected") return ["  -- DROP TABLE auth_tokens_v1 deferred by reviewer", "+ SELECT archive_legacy_tokens();"];
  return ["! DROP TABLE IF EXISTS auth_tokens_v1;"];
}

export function DemoRoute() {
  const [activeStep, setActiveStep] = useState<DemoStepId>("detect");
  const [task, setTask] = useState(defaultTask);
  const [taskSubmitted, setTaskSubmitted] = useState(false);
  const [packEnabled, setPackEnabled] = useState(false);
  const [planReviewed, setPlanReviewed] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [gateDecision, setGateDecision] = useState<GateDecision>(null);
  const [checksOpen, setChecksOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [presenterMode, setPresenterMode] = useState(true);
  const [baselineVisible, setBaselineVisible] = useState(false);

  const activeMeta = demoSteps.find((step) => step.id === activeStep) ?? demoSteps[0];
  const achievedMaxIndex = useMemo(() => {
    if (gateDecision) return stepIndex("pr");
    if (executionComplete) return stepIndex("gate");
    if (planReviewed) return stepIndex("plan");
    if (packEnabled) return stepIndex("enable");
    if (taskSubmitted) return stepIndex("inspect");
    return stepIndex("detect");
  }, [executionComplete, gateDecision, packEnabled, planReviewed, taskSubmitted]);

  const canVisit = (step: DemoStepId) => stepIndex(step) <= achievedMaxIndex;
  const goToStep = (step: DemoStepId) => {
    if (canVisit(step)) setActiveStep(step);
  };

  const resetDemo = () => {
    setActiveStep("detect");
    setTask(defaultTask);
    setTaskSubmitted(false);
    setPackEnabled(false);
    setPlanReviewed(false);
    setExecutionComplete(false);
    setGateDecision(null);
    setBaselineVisible(false);
  };

  const replayRun = () => {
    setExecutionComplete(false);
    setGateDecision(null);
    setActiveStep("plan");
  };

  const submitTask = () => {
    if (!task.trim()) return;
    setTaskSubmitted(true);
    setPackEnabled(false);
    setPlanReviewed(false);
    setExecutionComplete(false);
    setGateDecision(null);
    setBaselineVisible(false);
    setActiveStep("inspect");
  };

  const enablePack = () => {
    setTaskSubmitted(true);
    setPackEnabled(true);
    setChecksOpen(false);
    setActiveStep("enable");
  };

  const reviewPlan = () => {
    if (!packEnabled) return;
    setPlanReviewed(true);
    setActiveStep("plan");
  };

  const runAgent = () => {
    if (!packEnabled || !planReviewed) return;
    setExecutionComplete(true);
    setGateDecision(null);
    setActiveStep("execute");
  };

  const resolveGate = (decision: Exclude<GateDecision, null>) => {
    if (!executionComplete || activeStep !== "gate") return;
    setGateDecision(decision);
    setActiveStep("pr");
  };

  const jumpToPrArtifact = () => {
    setTaskSubmitted(true);
    setPackEnabled(true);
    setPlanReviewed(true);
    setExecutionComplete(true);
    setGateDecision("approved");
    setActiveStep("pr");
  };

  const commands: PaletteCommand[] = [
    {
      id: "inspect",
      label: "Inspect Pack",
      hint: "Start the guided flow",
      enabled: true,
      run: submitTask
    },
    {
      id: "enable",
      label: "Enable Security Pack",
      hint: taskSubmitted ? "Activate guardrails" : "Send a task first",
      enabled: taskSubmitted && !packEnabled,
      run: enablePack
    },
    {
      id: "plan",
      label: "Review Plan",
      hint: packEnabled ? "Open security-aware Plan Mode" : "Enable the Pack first",
      enabled: packEnabled,
      run: reviewPlan
    },
    {
      id: "run",
      label: "Run Agent",
      hint: planReviewed ? "Execute the simulated run" : "Review the plan first",
      enabled: packEnabled && planReviewed,
      run: runAgent
    },
    {
      id: "approve",
      label: "Approve Gate",
      hint: executionComplete ? "Include destructive migration" : "Gate has not appeared yet",
      enabled: activeStep === "gate" && executionComplete,
      run: () => resolveGate("approved")
    },
    {
      id: "reject",
      label: "Reject Gate",
      hint: executionComplete ? "Keep legacy table" : "Gate has not appeared yet",
      enabled: activeStep === "gate" && executionComplete,
      run: () => resolveGate("rejected")
    },
    {
      id: "jump-pr",
      label: "Jump to PR Artifact",
      hint: "Presenter recovery shortcut",
      enabled: true,
      run: jumpToPrArtifact
    },
    {
      id: "reset",
      label: "Reset Demo",
      hint: "Return to the first step",
      enabled: true,
      run: resetDemo
    }
  ];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setChecksOpen(false);
        setPaletteOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const logs = packEnabled ? packRunLogs : baseRunLogs;
  const showPatchedCode = executionComplete || activeStep === "execute" || activeStep === "gate" || activeStep === "pr";

  return (
    <div className="page">
      <header className="suite-header compact">
        <div>
          <a className="back-link" href="/">
            Back to suite
          </a>
          <p className="eyebrow">Interactive dummy app</p>
          <h1>Guided Security Pack demo</h1>
        </div>
        <div className="header-actions">
          <button className="btn" type="button" onClick={() => setPaletteOpen(true)}>
            Commands
          </button>
          <button
            className={`btn ${presenterMode ? "accent" : ""}`}
            type="button"
            onClick={() => setPresenterMode((value) => !value)}
          >
            Presenter Mode
          </button>
          <button className="btn" type="button" onClick={resetDemo}>
            Reset
          </button>
        </div>
      </header>

      <Stepper activeStep={activeStep} canVisit={canVisit} onStep={goToStep} />

      <ShellChrome
        title="Claude Code - payments-api - guided prototype"
        status={packEnabled ? "Security Pack active" : "Pack available"}
      >
        <div className="demo-grid">
          <aside className="demo-sidebar">
            <section className="side-block">
              <p className="eyebrow">Project</p>
              <h2>payments-api</h2>
              <p>Auth middleware, refresh tokens, PostgreSQL, release deadline.</p>
            </section>
            <section className={`side-block pack-state ${packEnabled ? "on" : taskSubmitted ? "recommended" : ""}`}>
              <p className="eyebrow">Verified Security Pack</p>
              <h2>{packEnabled ? "Active" : taskSubmitted ? "Recommended" : "Detected"}</h2>
              <p>
                {packEnabled
                  ? "12 checks, 3 gates, checkpoints, and PR rationale are attached to the flow."
                  : "Detected from auth routes, token handling, migrations, and dependencies."}
              </p>
            </section>
            <section className="side-block metrics">
              <p className="eyebrow">Live state</p>
              <div>
                <span>Checks</span>
                <b>{packEnabled ? (gateDecision ? "12/12" : executionComplete ? "8/12" : "4/12") : "0/12"}</b>
              </div>
              <div>
                <span>Gate</span>
                <b>{gateDecision ? gateDecision : executionComplete ? "open" : "armed"}</b>
              </div>
              <div>
                <span>PR</span>
                <b>{gateDecision ? "ready" : "not ready"}</b>
              </div>
            </section>
            <section className="side-block guardrails">
              <p className="eyebrow">Guardrails</p>
              <ul>
                <li>Run is locked until the plan is reviewed.</li>
                <li>Gate buttons unlock only at the destructive step.</li>
                <li>Every check shown here is simulated prototype output.</li>
              </ul>
            </section>
          </aside>

          <main className="demo-main">
            {presenterMode ? (
              <section className="presenter-strip">
                <div>
                  <span>{activeMeta.time}</span>
                  <b>{activeMeta.title}</b>
                </div>
                <p>{activeMeta.cue}</p>
              </section>
            ) : null}

            <section className="workspace-grid">
              <div className="conversation-pane">
                <div className="pane-head">
                  <span>Guided session</span>
                  <StatusBadge tone={packEnabled ? "accent" : "neutral"}>{activeMeta.label}</StatusBadge>
                </div>
                <div className="conversation-body">
                  <StepContent
                    step={activeStep}
                    task={task}
                    packEnabled={packEnabled}
                    planReviewed={planReviewed}
                    executionComplete={executionComplete}
                    gateDecision={gateDecision}
                    baselineVisible={baselineVisible}
                    onInspect={() => {
                      submitTask();
                      setChecksOpen(true);
                    }}
                    onOpenChecks={() => setChecksOpen(true)}
                    onEnable={enablePack}
                    onReviewPlan={reviewPlan}
                    onRun={runAgent}
                    onContinueGate={() => setActiveStep("gate")}
                    onApprove={() => resolveGate("approved")}
                    onReject={() => resolveGate("rejected")}
                    onReplay={replayRun}
                    onBaseline={() => setBaselineVisible((value) => !value)}
                  />
                </div>
              </div>

              <div className="repo-pane">
                <div className="pane-head">
                  <span>Repo and output</span>
                  <StatusBadge tone={showPatchedCode ? "good" : "warn"}>
                    {showPatchedCode ? "patched" : "security-sensitive"}
                  </StatusBadge>
                </div>
                <div className="repo-body">
                  <CodePanel
                    title="src/auth/refresh.ts"
                    status={showPatchedCode ? "patched" : "before"}
                    lines={showPatchedCode ? patchedCode : initialCode}
                    warningLines={showPatchedCode ? [] : [2, 6]}
                  />
                  {executionComplete ? (
                    <CodePanel
                      title="migrations/2026_05_drop_legacy_tokens.sql"
                      status={gateDecision ?? "gated"}
                      lines={migrationLine(gateDecision)}
                      warningLines={gateDecision ? [] : [1]}
                    />
                  ) : null}
                  {gateDecision ? <PrArtifact decision={gateDecision} packEnabled={packEnabled} /> : null}
                </div>
              </div>
            </section>

            <TaskComposer value={task} onChange={setTask} onSubmit={submitTask} />

            <div className="demo-footer-actions">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  const previous = stepOrder[Math.max(0, stepIndex(activeStep) - 1)];
                  setActiveStep(previous);
                }}
                disabled={activeStep === "detect"}
              >
                Previous
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  const next = stepOrder[Math.min(stepOrder.length - 1, stepIndex(activeStep) + 1)];
                  goToStep(next);
                }}
                disabled={
                  activeStep === "pr" || !canVisit(stepOrder[Math.min(stepOrder.length - 1, stepIndex(activeStep) + 1)])
                }
              >
                Next
              </button>
              <button className="btn" type="button" onClick={replayRun} disabled={!executionComplete}>
                Replay Run
              </button>
              <button className="btn accent" type="button" onClick={jumpToPrArtifact}>
                Jump to PR Artifact
              </button>
            </div>
          </main>
        </div>
      </ShellChrome>

      <Modal
        open={checksOpen}
        title="What the Security Pack adds"
        subtitle="The Pack is transparent before activation. These checks are simulated for the prototype."
        onClose={() => setChecksOpen(false)}
        footer={
          <>
            <span>Curated guardrails are attached only after enablement.</span>
            <button className="btn accent" type="button" onClick={enablePack}>
              Enable Security Pack
            </button>
          </>
        }
      >
        <div className="check-grid">
          {securityChecks.map((check) => (
            <article className="check-item" key={check.title}>
              <StatusBadge tone={check.category === "gate" ? "warn" : check.category === "artifact" ? "good" : "accent"}>
                {check.category}
              </StatusBadge>
              <h3>{check.title}</h3>
              <p>{check.description}</p>
            </article>
          ))}
        </div>
        <div className="scope-note">
          Verified means curated and regression-evaluated in this product concept. It does not certify secure code or replace review.
        </div>
      </Modal>

      <CommandPalette open={paletteOpen} commands={commands} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

interface StepContentProps {
  step: DemoStepId;
  task: string;
  packEnabled: boolean;
  planReviewed: boolean;
  executionComplete: boolean;
  gateDecision: GateDecision;
  baselineVisible: boolean;
  onInspect: () => void;
  onOpenChecks: () => void;
  onEnable: () => void;
  onReviewPlan: () => void;
  onRun: () => void;
  onContinueGate: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReplay: () => void;
  onBaseline: () => void;
}

function StepContent({
  step,
  task,
  packEnabled,
  planReviewed,
  executionComplete,
  gateDecision,
  baselineVisible,
  onInspect,
  onOpenChecks,
  onEnable,
  onReviewPlan,
  onRun,
  onContinueGate,
  onApprove,
  onReject,
  onReplay,
  onBaseline
}: StepContentProps) {
  if (step === "detect") {
    return (
      <div className="message-stack">
        <article className="callout accent">
          <StatusBadge tone="accent">detected</StatusBadge>
          <h2>Security-sensitive project detected</h2>
          <p>
            Claude found auth routes, refresh-token logic, a legacy token table, and OWASP-relevant dependencies before the
            task starts.
          </p>
          <button className="btn primary" type="button" onClick={onInspect}>
            Inspect Pack
          </button>
        </article>
        <Message who="Developer" body={task} />
      </div>
    );
  }

  if (step === "inspect") {
    return (
      <div className="message-stack">
        <Message who="Developer" body={task} align="right" />
        <article className="callout">
          <StatusBadge tone="accent">transparent before enablement</StatusBadge>
          <h2>Security Pack contents are inspectable</h2>
          <p>
            The user can see the checks, tool scope, approval gates, and blocked behaviors before trusting the Pack label.
          </p>
          <div className="action-row">
            <button className="btn" type="button" onClick={onOpenChecks}>
              View Checks
            </button>
            <button className="btn primary" type="button" onClick={onEnable}>
              Enable Security Pack
            </button>
          </div>
        </article>
      </div>
    );
  }

  if (step === "enable") {
    return (
      <div className="message-stack">
        <article className="callout accent">
          <StatusBadge tone="good">active</StatusBadge>
          <h2>Verified Security Pack enabled</h2>
          <p>
            The session now carries Pack context: checkpoints, auth checks, secrets handling, dependency review, and
            destructive-action gates.
          </p>
          <button className="btn primary" type="button" onClick={onReviewPlan}>
            Review Plan
          </button>
        </article>
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div className="message-stack">
        <article className="plan-card">
          <div className="plan-title">
            <h2>{packEnabled ? "Security-aware Plan Mode" : "Base Claude Code plan"}</h2>
            <StatusBadge tone={packEnabled ? "accent" : "neutral"}>{packEnabled ? "12 checks - 3 gates" : "manual setup"}</StatusBadge>
          </div>
          <CheckRow done title="Create checkpoint" detail="Snapshot before security-sensitive edits." />
          <CheckRow done={planReviewed} title="Patch refresh-token validation" detail="Add schema validation and remove token logging." />
          <CheckRow done={false} title="Run tests and simulated scans" detail="Unit tests, secrets scan, dependency review." />
          <CheckRow gate title="DROP TABLE auth_tokens_v1" detail="Explicit human approval required." />
          <div className="action-row">
            <button className="btn" type="button" onClick={onBaseline}>
              {baselineVisible ? "Hide Pack-Off Contrast" : "Show Pack-Off Contrast"}
            </button>
            <button className="btn primary" type="button" onClick={onRun} disabled={!planReviewed}>
              Run Agent
            </button>
          </div>
        </article>
        {baselineVisible ? (
          <article className="contrast-card">
            <h3>Without the Pack</h3>
            <p>
              The same task can produce a PR with unit-test output, but no curated Pack artifact and no destructive DB
              approval gate.
            </p>
          </article>
        ) : null}
      </div>
    );
  }

  if (step === "execute") {
    return (
      <div className="message-stack">
        <article className="terminal-card">
          <div className="terminal-head">
            <span>simulated agent run</span>
            <StatusBadge tone="good">complete</StatusBadge>
          </div>
          {(packEnabled ? packRunLogs : baseRunLogs).map((log) => (
            <div className={`term-line ${log.tone}`} key={log.text}>
              &gt; {log.text}
            </div>
          ))}
        </article>
        <div className="action-row">
          <button className="btn" type="button" onClick={onReplay}>
            Replay Run
          </button>
          <button className="btn primary" type="button" onClick={onContinueGate} disabled={!executionComplete}>
            Continue to Approval Gate
          </button>
        </div>
      </div>
    );
  }

  if (step === "gate") {
    return (
      <div className="message-stack">
        <article className="callout warn">
          <StatusBadge tone="warn">human confirmation required</StatusBadge>
          <h2>Approval gate triggered</h2>
          <p>
            The Pack pauses because checkpoint rollback cannot restore a dropped database table. The user must approve or
            reject the destructive migration.
          </p>
          <div className="action-row">
            <button className="btn" type="button" onClick={onReject} disabled={!executionComplete || !!gateDecision}>
              Reject and Keep Table
            </button>
            <button className="btn danger" type="button" onClick={onApprove} disabled={!executionComplete || !!gateDecision}>
              Approve Destructive Action
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="message-stack">
      <article className="callout accent">
        <StatusBadge tone="good">PR ready</StatusBadge>
        <h2>PR artifact is ready</h2>
        <p>
          Claude attaches the security rationale, simulated check results, test output, checkpoint summary, and gate
          decision for reviewer context.
        </p>
        <button className="btn" type="button" onClick={onReplay}>
          Replay from Plan
        </button>
      </article>
    </div>
  );
}

function Message({ who, body, align = "left" }: { who: string; body: string; align?: "left" | "right" }) {
  return (
    <article className={`message ${align}`}>
      <div>{who}</div>
      <p>{body}</p>
    </article>
  );
}

function CheckRow({
  title,
  detail,
  done = false,
  gate = false
}: {
  title: string;
  detail: string;
  done?: boolean;
  gate?: boolean;
}) {
  return (
    <div className={`check-row ${done ? "done" : ""} ${gate ? "gate" : ""}`}>
      <span>{done ? "OK" : gate ? "!" : "-"}</span>
      <div>
        <b>{title}</b>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function PrArtifact({ decision, packEnabled }: { decision: Exclude<GateDecision, null>; packEnabled: boolean }) {
  return (
    <article className="pr-artifact">
      <p className="eyebrow">PR artifact</p>
      <h3>PR #412 - feat(auth): refresh tokens via auth_sessions</h3>
      <dl>
        <div>
          <dt>Pack status</dt>
          <dd>{packEnabled ? "Enabled" : "Not enabled"}</dd>
        </div>
        <div>
          <dt>Gate decision</dt>
          <dd>{decision === "approved" ? "Approved by user" : "Rejected; cleanup task added"}</dd>
        </div>
        <div>
          <dt>Evidence</dt>
          <dd>Security rationale, simulated checks, test output, secrets scan, checkpoint summary.</dd>
        </div>
      </dl>
    </article>
  );
}
