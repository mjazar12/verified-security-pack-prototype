import { useEffect, useMemo, useState, type ReactNode } from "react";
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

type ToolTone = "default" | "success" | "warning" | "danger" | "muted";

const thinkingLines = [
  "",
  "◌ inspecting auth and migration risk...",
  "◌ planning guarded edits and checkpoints...",
  "◌ checking destructive database action...",
  "◌ assembling PR-ready security artifact..."
];

const transcriptLines = [
  "payments-api % refresh-token migration prompt submitted",
  "Security Pack triggered on auth + token + destructive migration signals",
  "Pack enabled checks, checkpoint, scoped plan, and DB approval gate",
  "src/auth/refresh.ts updated: validation added, token logging removed",
  `${approvalSql} blocked until human approval`,
  "PR artifact generated with scope, checks, gate decision, and reviewer note"
];

export function DemoRoute() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [gateDecision, setGateDecision] = useState<GateDecision>(null);
  const blocks = useMemo(() => getSceneBlocks(sceneIndex, gateDecision), [sceneIndex, gateDecision]);
  const [visibleBlocks, setVisibleBlocks] = useState(blocks.length);
  const [showTranscript, setShowTranscript] = useState(false);
  const isStreaming = visibleBlocks < blocks.length;
  const scene = demoScenes[sceneIndex];

  const reset = () => {
    setSceneIndex(0);
    setGateDecision(null);
    setShowTranscript(false);
  };

  const revealAll = () => setVisibleBlocks(blocks.length);

  const advance = () => {
    if (isStreaming) {
      revealAll();
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
    if (sceneIndex !== 3) return;
    setGateDecision("rejected");
    setSceneIndex(4);
  };

  useEffect(() => {
    if (sceneIndex === 0) {
      setVisibleBlocks(blocks.length);
      return;
    }

    setVisibleBlocks(0);
    const timers = blocks.map((_, index) =>
      window.setTimeout(() => {
        setVisibleBlocks((current) => Math.max(current, index + 1));
      }, 520 + index * 420)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [blocks.length, sceneIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        advance();
      }
      if (event.key.toLowerCase() === "r") {
        reset();
      }
      if (event.key.toLowerCase() === "t") {
        setShowTranscript((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className="cli-demo-page">
      <section className="cli-demo-header">
        <div>
          <p className="eyebrow">MGMT 275 final project</p>
          <h1>Verified Security Pack CLI demo</h1>
          <p>
            A simulated Claude Code session. Press <kbd>Enter</kbd> and the terminal runs the next guarded step.
          </p>
        </div>
        <div className="demo-badge">Simulated prototype</div>
      </section>

      <section className="cli-demo-shell" aria-label="Claude Code CLI simulation">
        <div className="terminal-titlebar">
          <div className="traffic" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>claude - payments-api - zsh</span>
          <b>{scene.label}</b>
        </div>

        <div className="terminal-screen">
          <SceneScreen
            blocks={blocks}
            gateDecision={gateDecision}
            isThinking={sceneIndex > 0 && visibleBlocks === 0}
            sceneIndex={sceneIndex}
            showTranscript={showTranscript}
            visibleBlocks={visibleBlocks}
          />
          <StatusFooter sceneIndex={sceneIndex} isStreaming={isStreaming} />
        </div>
      </section>

      <div className="floating-controls">
        <a className="secondary-button nav-link" href="/">
          Landing
        </a>
        <button className={sceneIndex === 3 ? "danger-button" : "primary-button"} type="button" onClick={advance}>
          {isStreaming ? "Finish output" : scene.cta} <span>↵</span>
        </button>
        {sceneIndex === 3 && !isStreaming ? (
          <button className="secondary-button" type="button" onClick={rejectGate}>
            Reject gate
          </button>
        ) : null}
        <button className="secondary-button" type="button" onClick={reset}>
          Reset <span>R</span>
        </button>
        <button className="secondary-button" type="button" onClick={() => setShowTranscript((current) => !current)}>
          Transcript <span>T</span>
        </button>
      </div>
    </main>
  );
}

function getSceneBlocks(sceneIndex: number, gateDecision: GateDecision): ReactNode[] {
  if (sceneIndex === 0) {
    return [
      <AgentNoteBlock key="note">Resuming feature/refresh-token-rotation with local edits already in flight.</AgentNoteBlock>,
      <ToolBlock
        key="status"
        command={'Bash(git status --short && git branch --show-current)'}
        output={["M  src/auth/refresh.ts", "?? migrations/2026_05_auth_sessions.sql", "feature/refresh-token-rotation"]}
      />,
      <PromptBlock key="prompt" command={scenarioPrompt} />
    ];
  }

  if (sceneIndex === 1) {
    return [
      <CommandEcho key="echo" command={scenarioPrompt} />,
      <AgentNoteBlock key="note">Before editing, I’m classifying the request against repo and migration signals.</AgentNoteBlock>,
      <ToolBlock
        key="search"
        command={'Bash(rg "auth_tokens_v1|auth_sessions|refresh|DROP TABLE" src migrations package.json)'}
        output={[
          ...repoSignals
        ]}
      />,
      <ResultBlock
        key="result"
        tone="warning"
        title="SECURITY PACK TRIGGERED"
        rows={triggerRows}
      />,
      <ChangedFilesLine key="files" text="status: Pack available · checks pending · no files changed yet" />
    ];
  }

  if (sceneIndex === 2) {
    return [
      <CommandEcho key="enable" command="/security-pack enable --scope refresh-token-migration" />,
      <AgentNoteBlock key="note">
        Pack enabled. I’m keeping the edit narrow: validate input, stop token logging, checkpoint before DB work.
      </AgentNoteBlock>,
      <PlanBlock
        key="plan"
        items={["validate refresh token input", "remove sensitive token logging", "pause before destructive DB write"]}
      />,
      <ToolBlock
        key="read"
        command={"Read(src/auth/refresh.ts)"}
        output={["loaded refresh handler, token lookup, session rotation, audit hooks", "found 1 unsafe log line"]}
      />,
      <CheckpointBlock key="checkpoint" label="before-security-pack-edits" text="rollback point saved before auth changes" />,
      <UpdateBlock key="update" file="src/auth/refresh.ts" summary="Added 5 lines, removed 2 lines">
        <DiffBlock lines={refreshDiff} />
      </UpdateBlock>,
      <ToolBlock
        key="verify"
        command={"Bash(npm test -- auth && semgrep --config security-pack/auth)"}
        output={["auth tests: 42 passed", "semgrep simulated check: no token logging", "checkpoint: before-db-migration saved"]}
        tone="success"
      />,
      <ChangedFilesLine key="files" text="changes: src/auth/refresh.ts +5 -2 · migration blocked · tests passed" />
    ];
  }

  if (sceneIndex === 3) {
    return [
      <CommandEcho key="migrate" command="npm run migrate:auth-sessions" />,
      <AgentNoteBlock key="note">The next command would delete an old token table. I need human approval before it runs.</AgentNoteBlock>,
      <ToolBlock
        key="blocked"
        command={"Bash(psql $DATABASE_URL -f migrations/2026_05_auth_sessions.sql)"}
        output={["blocked by Verified Security Pack", "checkpoint: before-db-migration", "no database write executed"]}
        tone="danger"
      />,
      <GateBlock key="gate" />,
      <ChangedFilesLine key="files" text="changes: auth code staged · DB migration paused · human approval required" />
    ];
  }

  return [
    <AgentNoteBlock key="done">All changes landed. The file parses cleanly and guarded DB work has a recorded decision.</AgentNoteBlock>,
    <PrArtifactBlock key="summary" decision={gateDecision ?? "approved"} />,
    <ChangedFilesLine key="files" text="changes: src/auth/refresh.ts +5 -2 · PR artifact ready · reviewer note included" />,
    <RestartCue key="restart" surface="CLI" />,
    <PromptBlock key="prompt" command="restart demo from the beginning" />
  ];
}

function SceneScreen({
  blocks,
  gateDecision,
  isThinking,
  sceneIndex,
  showTranscript,
  visibleBlocks
}: {
  blocks: ReactNode[];
  gateDecision: GateDecision;
  isThinking: boolean;
  sceneIndex: number;
  showTranscript: boolean;
  visibleBlocks: number;
}) {
  return (
    <div className="screen-body">
      {isThinking ? <ThinkingBlock text={thinkingLines[sceneIndex]} /> : null}
      {blocks.slice(0, visibleBlocks).map((block, index) => (
        <div className="terminal-chunk" key={index}>
          {block}
        </div>
      ))}
      {showTranscript ? <TranscriptPanel gateDecision={gateDecision} /> : null}
    </div>
  );
}

function ThinkingBlock({ text }: { text: string }) {
  return (
    <div className="cli-thinking">
      <span />
      <b>{text}</b>
    </div>
  );
}

function AgentNoteBlock({ children }: { children: string }) {
  return <div className="agent-note">● {children}</div>;
}

function CommandEcho({ command }: { command: string }) {
  return (
    <div className="command-echo">
      <span>payments-api %</span>
      <code>{command}</code>
    </div>
  );
}

function PromptBlock({ command }: { command: string }) {
  return (
    <div className="prompt-block">
      <div className="prompt-line">
        <span>payments-api %</span>
        <code>{command}</code>
        <i aria-hidden="true" />
      </div>
      <div className="hint-line">Enter to continue · R to reset</div>
    </div>
  );
}

function ToolBlock({
  command,
  output,
  tone = "default"
}: {
  command: string;
  output: string[];
  tone?: ToolTone;
}) {
  return (
    <div className={`tool-block ${tone}`}>
      <div className="tool-command">● {command}</div>
      <div className="tool-output">
        {output.map((line, index) => (
          <div key={line} style={{ animationDelay: `${index * 70}ms` }}>
            └ {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanBlock({ items }: { items: string[] }) {
  return (
    <div className="cli-plan-block">
      <div className="block-title">● Plan Mode</div>
      {items.map((item, index) => (
        <div key={item}>
          <span>{index + 1}</span>
          <code>{item}</code>
        </div>
      ))}
    </div>
  );
}

function CheckpointBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="checkpoint-receipt">
      <span>checkpoint saved</span>
      <code>{label}</code>
      <b>{text}</b>
    </div>
  );
}

function ChangedFilesLine({ text }: { text: string }) {
  return <div className="changed-files-line">* {text}</div>;
}

function ResultBlock({ title, rows, tone = "default" }: { title: string; rows: string[][]; tone?: ToolTone }) {
  return (
    <div className={`result-block ${tone}`}>
      <div className="result-title">● {title}</div>
      {rows.map(([label, value]) => (
        <div className="result-row" key={label}>
          <span>{label}</span>
          <code>{value}</code>
        </div>
      ))}
    </div>
  );
}

function UpdateBlock({
  file,
  summary,
  children
}: {
  file: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className="update-block">
      <div className="update-title">
        <span>● Update({file})</span>
        <b>{summary}</b>
      </div>
      {children}
    </div>
  );
}

function DiffBlock({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="diff-block">
      {lines.map((line, index) => (
        <div className={`diff-line ${line.kind}`} key={`${line.no}-${index}-${line.text}`}>
          <span className="diff-no">{line.no}</span>
          <span className="diff-mark">{line.kind === "add" ? "+" : line.kind === "remove" ? "-" : ""}</span>
          <code>{line.text}</code>
        </div>
      ))}
    </div>
  );
}

function GateBlock() {
  return (
    <div className="gate-block">
      <div className="gate-title">● BLOCKED · APPROVAL REQUIRED</div>
      <div className="gate-command">{approvalSql}</div>
      <div className="gate-stamp">no database write executed · human approval required</div>
      <div className="gate-lines">
        <div>
          <span>why</span>
          <code>removes legacy refresh-token table after auth_sessions cutover</code>
        </div>
        <div>
          <span>risk</span>
          <code>irreversible production data change without human confirmation</code>
        </div>
        <div>
          <span>enter</span>
          <code>approve for demo and continue to PR artifact</code>
        </div>
        <div>
          <span>reject</span>
          <code>keep table, add cleanup follow-up to PR artifact</code>
        </div>
      </div>
    </div>
  );
}

function PrArtifactBlock({ decision }: { decision: Exclude<GateDecision, null> }) {
  const approved = decision === "approved";

  return (
    <div className="pr-artifact-block">
      <h2>● Generated PR description</h2>
      <div className="pr-field">
        <span>Title</span>
        <code>Harden refresh-token migration into auth_sessions</code>
      </div>
      <div className="pr-field">
        <span>Risk</span>
        <code>Auth token rotation touches session persistence and a destructive legacy-table cleanup.</code>
      </div>
      <div className="pr-field">
        <span>Checks</span>
        <code>auth tests passed · token-log scan clean · dependency audit simulated · checkpoint saved</code>
      </div>
      <div className="pr-field">
        <span>Gate decision</span>
        <code>{approved ? "Approved by human reviewer for demo" : "Rejected; cleanup moved to follow-up issue"}</code>
      </div>
      <div className="pr-field">
        <span>Reviewer note</span>
        <code>{summaryItems[4].text}</code>
      </div>
      <div className="artifact-lines">
        <div>* Churned for 4m 12s</div>
        <div>Result: {gateDecisionText(decision)}</div>
      </div>
    </div>
  );
}

function TranscriptPanel({ gateDecision }: { gateDecision: GateDecision }) {
  return (
    <div className="transcript-panel">
      <div className="block-title">● Full transcript preview</div>
      {transcriptLines.map((line) => (
        <div key={line}>└ {line}</div>
      ))}
      <div>└ gate decision: {gateDecision ?? "pending until final scene"}</div>
    </div>
  );
}

function RestartCue({ surface }: { surface: string }) {
  return (
    <div className="restart-cue">
      <span>End of {surface} demo</span>
      <code>Press Enter to restart from the first scene, or use Landing to switch demos.</code>
    </div>
  );
}

function StatusFooter({ sceneIndex, isStreaming }: { sceneIndex: number; isStreaming: boolean }) {
  const progress = Math.round(((sceneIndex + 1) / demoScenes.length) * 100);
  const action = sceneIndex === demoScenes.length - 1 ? "restart" : isStreaming ? "finish output" : "continue";
  const states = ["ready", "scanning", "editing", "blocked", "summarizing"];
  return (
    <div className="status-footer">
      <span>↱ /gsd-update</span>
      <i>|</i>
      <span>Opus 4.7</span>
      <i>|</i>
      <span>payments-api</span>
      <i>|</i>
      <span className={`footer-state state-${states[sceneIndex]}`}>{isStreaming ? states[sceneIndex] : `${states[sceneIndex]} idle`}</span>
      <span className="progress" aria-label={`${progress}% complete`}>
        <i style={{ width: `${progress}%` }} />
      </span>
      <b>{isStreaming ? "streaming" : `${progress}%`}</b>
      <span className="footer-right">Enter to {action} · R reset · T transcript</span>
    </div>
  );
}
