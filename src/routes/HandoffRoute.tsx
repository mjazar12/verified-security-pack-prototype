import { ShellChrome } from "../components/ShellChrome";
import { StatusBadge } from "../components/StatusBadge";

export function HandoffRoute() {
  return (
    <div className="page">
      <header className="suite-header compact">
        <div>
          <a className="back-link" href="/">
            Back to suite
          </a>
          <p className="eyebrow">Project handoff</p>
          <h1>Demo script and grading summary</h1>
        </div>
        <a className="btn primary" href="/demo">
          Start Guided Demo
        </a>
      </header>

      <ShellChrome title="Verified Security Pack - handoff" status="GitHub-ready project">
        <main className="handoff">
          <section>
            <StatusBadge tone="accent">product thesis</StatusBadge>
            <h2>Security guidance should appear at the moment of need</h2>
            <p>
              The Pack reduces setup friction by detecting security-sensitive work and attaching curated checks, approval
              gates, and reviewer-ready evidence to the coding flow.
            </p>
          </section>

          <section className="handoff-grid">
            <article>
              <h3>4-minute demo path</h3>
              <ol>
                <li>Start at the launcher and enter the guided dummy app.</li>
                <li>Show detection on the refresh-token migration task.</li>
                <li>Inspect and enable the Pack.</li>
                <li>Run the security-aware plan.</li>
                <li>Resolve the destructive DB gate.</li>
                <li>Close on the PR artifact.</li>
              </ol>
            </article>
            <article>
              <h3>Guardrails</h3>
              <ul>
                <li>Impossible actions are disabled.</li>
                <li>Gate approval unlocks only after execution reaches the destructive step.</li>
                <li>All scans are labeled as simulated prototype output.</li>
                <li>Reset, replay, command palette, and PR jump support live recovery.</li>
              </ul>
            </article>
            <article>
              <h3>Ease of use</h3>
              <ul>
                <li>Default task is prefilled.</li>
                <li>Quick-pick task chips switch scenarios.</li>
                <li>Autocomplete suggests files, migrations, security terms, and templates.</li>
                <li>Desktop and CLI routes show broader product suite coverage.</li>
              </ul>
            </article>
          </section>

          <section>
            <h2>Repo deliverables</h2>
            <p>
              The project includes Vite React source, reusable components, typed scenario data, `README.md`, `CLAUDE.md`,
              deploy redirects, and legacy HTML artifacts retained for reference.
            </p>
          </section>
        </main>
      </ShellChrome>
    </div>
  );
}
