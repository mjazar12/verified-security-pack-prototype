export function LandingRoute() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div>
          <p className="eyebrow">MGMT 275 final project</p>
          <h1>Verified Security Pack prototype</h1>
          <p>
            Two simulated Claude Code demos show the same product story: security-sensitive work is detected,
            guarded, checkpointed, gated, and summarized for review.
          </p>
        </div>
        <div className="demo-badge">Simulated prototype</div>
      </section>

      <section className="demo-choice-grid" aria-label="Demo choices">
        <a className="demo-choice primary-choice" href="/gui">
          <span>recommended path</span>
          <h2>GUI demo</h2>
          <p>
            A Claude Code desktop-style walkthrough with the Code tab, prefilled composer, guarded activity stream,
            approval gate, and PR-ready artifact.
          </p>
          <b>Open GUI demo</b>
        </a>
        <a className="demo-choice" href="/cli">
          <span>technical path</span>
          <h2>CLI demo</h2>
          <p>
            A terminal-native version of the same Security Pack flow. Press Enter through command output, checks,
            code delta, gate, and summary.
          </p>
          <b>Open CLI demo</b>
        </a>
      </section>
    </main>
  );
}
