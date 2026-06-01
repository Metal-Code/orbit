import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevCycle — The complete story of how your product was built" },
      { name: "description", content: "Track every decision, milestone, and commit from day one to launch." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div>
      <nav className="landing-nav">
        <div className="navbar-logo">DevCycle</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </nav>
      <section className="hero">
        <h1>The complete story of how your product was built.</h1>
        <p>Track every decision, milestone, and commit from day one to launch.</p>
        <Link to="/register" className="btn btn-primary" style={{ padding: "11px 22px" }}>Get Started</Link>
      </section>
      <div className="features">
        <div className="feature">
          <h3>For Developers</h3>
          <p>Track commits, PRs, and technical decisions in one place.</p>
        </div>
        <div className="feature">
          <h3>For Founders</h3>
          <p>Log funding rounds, partnerships, and business milestones.</p>
        </div>
        <div className="feature">
          <h3>For Everyone</h3>
          <p>One timeline your whole team can read and understand.</p>
        </div>
      </div>
    </div>
  );
}
