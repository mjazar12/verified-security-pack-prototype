import { useState } from "react";
import { ShellChrome } from "../components/ShellChrome";
import { StatusBadge } from "../components/StatusBadge";
import { desktopSteps, type DemoArm } from "../data/scenario";

const armCopy: Record<DemoArm, { label: string; status: string; description: string }> = {
  control: {
    label: "Control",
    status: "No Pack surfaced",
    description: "The user gets generic Claude Code behavior and must know which safety checks to request manually."
  },
  t1_auto: {
    label: "T1 - auto-presented",
    status: "Pack banner at point of need",
    description: "The system detects a security-sensitive repo and offers the Pack before the task starts."
  },
  t2_settings: {
    label: "T2 - settings-buried",
    status: "Pack available in settings",
    description: "The same Pack exists, but users must discover it through settings before activation."
  }
};

export function DesktopRoute() {
  const [arm, setArm] = useState<DemoArm>("t1_auto");
  const copy = armCopy[arm];

  return (
    <div className="page">
      <header className="suite-header compact">
        <div>
          <a className="back-link" href="/">
            Back to suite
          </a>
          <p className="eyebrow">Desktop prototype</p>
          <h1>Claude Code desktop surface</h1>
        </div>
        <div className="segmented">
          {(Object.keys(armCopy) as DemoArm[]).map((option) => (
            <button
              className={arm === option ? "active" : ""}
              type="button"
              key={option}
              onClick={() => setArm(option)}
            >
              {armCopy[option].label}
            </button>
          ))}
        </div>
      </header>

      <ShellChrome title="Claude Code Desktop - payments-api" status={copy.status}>
        <div className="desktop-layout">
          <aside className="desktop-nav">
            <b>payments-api</b>
            <span>feat/auth-refresh-tokens</span>
            <button className="active">Chat</button>
            <button>Plan Mode</button>
            <button>Files</button>
            <button>Settings</button>
            <div className={`mini-pack ${arm === "control" ? "" : "on"}`}>
              <StatusBadge tone={arm === "control" ? "neutral" : "accent"}>
                {arm === "control" ? "manual" : "Pack"}
              </StatusBadge>
              <p>{copy.status}</p>
            </div>
          </aside>
          <main className="desktop-canvas">
            <section className={`desktop-banner ${arm === "control" ? "muted" : "active"}`}>
              <StatusBadge tone={arm === "control" ? "neutral" : "accent"}>{copy.label}</StatusBadge>
              <h2>{copy.status}</h2>
              <p>{copy.description}</p>
              {arm === "t1_auto" ? <button className="btn primary">Enable Security Pack</button> : null}
              {arm === "t2_settings" ? <button className="btn">Open Settings</button> : null}
              {arm === "control" ? <button className="btn">Configure Manually</button> : null}
            </section>
            <section className="desktop-plan">
              <h2>Scenario sequence</h2>
              <div className="timeline">
                {desktopSteps.map((step, index) => (
                  <div className="timeline-item" key={step}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="artifact-strip">
              <div>
                <b>Security rationale</b>
                <span>{arm === "control" ? "Absent unless manually requested" : "Attached to PR"}</span>
              </div>
              <div>
                <b>Destructive gate</b>
                <span>{arm === "control" ? "No configured gate" : "Blocks DROP TABLE"}</span>
              </div>
              <div>
                <b>Activation friction</b>
                <span>{arm === "t2_settings" ? "Higher" : arm === "t1_auto" ? "Low" : "User-owned"}</span>
              </div>
            </section>
          </main>
        </div>
      </ShellChrome>
    </div>
  );
}
