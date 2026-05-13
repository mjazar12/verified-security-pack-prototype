import { ShellChrome } from "../components/ShellChrome";
import { StatusBadge } from "../components/StatusBadge";

const routes = [
  {
    href: "/demo",
    title: "Guided Dummy App",
    description: "The primary 4-minute flow with guardrails, autocomplete, command palette, approval gate, and PR artifact.",
    badge: "hero path"
  },
  {
    href: "/desktop",
    title: "Desktop Prototype",
    description: "A Claude Code desktop surface showing T1 auto-presented, T2 settings-buried, and control treatments.",
    badge: "T1/T2/control"
  },
  {
    href: "/cli",
    title: "CLI Prototype",
    description: "A terminal-native version of the same Security Pack story with keyboard-first prompts.",
    badge: "terminal"
  },
  {
    href: "/handoff",
    title: "Project Handoff",
    description: "A concise grading page with the product thesis, demo script, guardrails, and implementation notes.",
    badge: "summary"
  }
];

export function LauncherRoute() {
  return (
    <div className="page">
      <header className="suite-header">
        <div>
          <p className="eyebrow">MGMT 275 final project</p>
          <h1>Verified Security Pack Prototype Suite</h1>
          <p className="lead">
            A polished demo suite for showing how Claude Code could guide security-sensitive work from detection to PR-ready
            evidence.
          </p>
        </div>
        <div className="header-actions">
          <a className="btn primary" href="/demo">
            Start Guided Demo
          </a>
          <a className="btn" href="/handoff">
            View Handoff
          </a>
        </div>
      </header>

      <ShellChrome title="Prototype launcher - payments-api" status="4-minute demo ready">
        <div className="launcher-grid">
          <section className="launcher-primary">
            <StatusBadge tone="accent">recommended path</StatusBadge>
            <h2>Run the guided dummy app first</h2>
            <p>
              The main flow is built for a live presentation: one obvious action per step, presenter cues, autocomplete
              templates, and safe recovery controls.
            </p>
            <div className="preview-window" aria-hidden="true">
              <div className="preview-row">
                <span>Detect</span>
                <b>security-sensitive project</b>
              </div>
              <div className="preview-row active">
                <span>Enable</span>
                <b>Verified Security Pack</b>
              </div>
              <div className="preview-row warn">
                <span>Gate</span>
                <b>DROP TABLE auth_tokens_v1</b>
              </div>
              <div className="preview-row good">
                <span>Output</span>
                <b>PR rationale artifact</b>
              </div>
            </div>
          </section>

          <section className="route-grid" aria-label="Prototype routes">
            {routes.map((route) => (
              <a className="route-card" href={route.href} key={route.href}>
                <StatusBadge tone={route.href === "/demo" ? "accent" : "neutral"}>{route.badge}</StatusBadge>
                <h2>{route.title}</h2>
                <p>{route.description}</p>
              </a>
            ))}
          </section>
        </div>
      </ShellChrome>
    </div>
  );
}
