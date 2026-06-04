import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeroTimeline } from "@/components/HeroTimeline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevCycle — The complete story of how YOUR Product is being built" },
      { name: "description", content: "Track every decision, milestone, and commit from day one to launch." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("devcycle.theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("devcycle.theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));



  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em" }}>DevCycle</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </nav>

      {/* Split layout: text left, video right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
        }}
      >
        {/* Left: text */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 clamp(28px, 5vw, 72px)",
            zIndex: 5,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              letterSpacing: "0.25em",
              color: "var(--text-dim)",
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            The Build Record →
          </div>
          <h1
            style={{
              fontSize: "clamp(34px, 4.6vw, 64px)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              fontWeight: 600,
              margin: 0,
              color: "var(--text)",
            }}
          >
            The complete story
            <br />
            of how
            <br />
            YOUR Product
            <br />
            is being built.
          </h1>
          <p
            style={{
              marginTop: 18,
              marginBottom: 28,
              fontSize: 15,
              color: "var(--text-dim)",
              maxWidth: 480,
              lineHeight: 1.55,
            }}
          >
            Track every decision, milestone, and commit from day one to launch.
          </p>
          <div>
            <Link to="/register" className="btn btn-primary" style={{ padding: "11px 22px" }}>
              Get Started →
            </Link>
          </div>
        </section>

        {/* Right: CSS-animated timeline (replaces previous video) */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <HeroTimeline theme={theme} />
          {/* Soft fade into the text column so the seam disappears */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                theme === "dark"
                  ? "linear-gradient(90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 18%)"
                  : "linear-gradient(90deg, rgba(250,249,245,1) 0%, rgba(250,249,245,0) 18%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
