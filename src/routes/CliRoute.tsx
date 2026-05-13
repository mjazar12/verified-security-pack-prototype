import { useState } from "react";
import { ShellChrome } from "../components/ShellChrome";
import { StatusBadge } from "../components/StatusBadge";
import { cliSteps, type DemoArm } from "../data/scenario";

export function CliRoute() {
  const [arm, setArm] = useState<DemoArm>("t1_auto");
  const packOn = arm !== "control";

  return (
    <div className="page">
      <header className="suite-header compact">
        <div>
          <a className="back-link" href="/">
            Back to suite
          </a>
          <p className="eyebrow">CLI prototype</p>
          <h1>Terminal-native Security Pack flow</h1>
        </div>
        <div className="segmented">
          <button className={arm === "control" ? "active" : ""} type="button" onClick={() => setArm("control")}>
            Control
          </button>
          <button className={arm === "t1_auto" ? "active" : ""} type="button" onClick={() => setArm("t1_auto")}>
            T1 Auto
          </button>
          <button className={arm === "t2_settings" ? "active" : ""} type="button" onClick={() => setArm("t2_settings")}>
            T2 Packs
          </button>
        </div>
      </header>

      <ShellChrome title="claude - payments-api - zsh" status={packOn ? "pack active" : "manual"}>
        <div className="cli-layout">
          <section className="terminal-window">
            <div className="term-line muted"># booting claude code - payments-api</div>
            <div className="term-line muted">reading CLAUDE.md - loading project instructions - connecting local tools</div>
            {arm === "control" ? (
              <div className="term-box muted">
                <b>No domain pack surfaced</b>
                <p>Use slash commands or manual prompting to request security checks.</p>
              </div>
            ) : (
              <div className="term-box accent">
                <b>security-sensitive project detected</b>
                <p>
                  Signals: src/auth/refresh.ts, .env.production, jsonwebtoken, bcrypt, PostgreSQL migrations.
                </p>
                <span>inspect - enable - skip</span>
              </div>
            )}
            <div className="prompt-line">
              <span>payments-api %</span>
              <b>
                Refactor refresh-token flow and replace auth_tokens_v1 with auth_sessions before Friday.
              </b>
            </div>
            <div className="term-box warn">
              <b>{packOn ? "approval required" : "migration would run ungated"}</b>
              <p>DROP TABLE auth_tokens_v1</p>
            </div>
            <div className="term-line good">
              {packOn
                ? "PR #412 ready - security rationale, tests, checkpoint, and gate decision attached"
                : "PR #412 ready - code diff and unit-test output attached"}
            </div>
          </section>

          <aside className="cli-side">
            <StatusBadge tone={packOn ? "accent" : "neutral"}>
              {arm === "control" ? "control" : arm === "t1_auto" ? "auto-presented" : "slash command"}
            </StatusBadge>
            <h2>CLI story beats</h2>
            <div className="timeline compact-list">
              {cliSteps.map((step, index) => (
                <div className="timeline-item" key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </ShellChrome>
    </div>
  );
}
