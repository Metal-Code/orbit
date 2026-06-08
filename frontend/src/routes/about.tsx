import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MarketingNav } from "@/components/MarketingNav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Orbit" },
      { name: "description", content: "Why Orbit exists and what it stands for." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("orbit.theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("orbit.theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
        position: "relative",
      }}
    >
      <MarketingNav theme={theme} onToggleTheme={toggleTheme} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          alignItems: "center",
          padding: "96px clamp(28px, 5vw, 72px) 48px",
          gap: "clamp(32px, 5vw, 72px)",
        }}
      >
        {/* Left: heading */}
        <section style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
            About →
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
            Why Orbit
            <br />
            exists.
          </h1>
          <p
            style={{
              marginTop: 18,
              fontSize: 15,
              color: "var(--text-dim)",
              maxWidth: 460,
              lineHeight: 1.55,
            }}
          >
            A build record for teams who want their product to have a memory.
          </p>
        </section>

        {/* Right: story + roadmap */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: 540,
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--text-mid)",
          }}
        >
          <p style={{ margin: 0 }}>
            Most products are built in the dark. Slack threads disappear,
            Notion docs go stale, and a year later nobody remembers{" "}
            <em>why</em> a decision was made — only that it was.
          </p>
          <p style={{ margin: 0 }}>
            Orbit is the single chronological story of how a product actually
            came together: every milestone, every shipped feature, every bug
            that taught you something.
          </p>

          <div
            style={{
              marginTop: 4,
              padding: 14,
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "var(--surface)",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10.5,
                letterSpacing: "0.2em",
                color: "var(--text-dim)",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              The intent
            </div>
            <p style={{ margin: 0, color: "var(--text)", fontSize: 13.5, lineHeight: 1.55 }}>
              Tell the truth of how it was built — not the polished launch
              post, but the real timeline.
            </p>
          </div>

          {/* Roadmap */}
          <div style={{ marginTop: 6 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10.5,
                letterSpacing: "0.2em",
                color: "var(--text-dim)",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              What's next →
            </div>
            <ol
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                {
                  tag: "Now",
                  title: "RAG + AI chatbot",
                  desc: "Ask your project anything — decisions, bugs, changelogs — answered from your own timeline.",
                  active: true,
                },
                {
                  tag: "Next",
                  title: "Full org customization",
                  desc: "Today Orbit is tuned for small startups tracking a product. Next: custom entry types so anyone can track anything.",
                  active: false,
                },
              ].map((item) => (
                <li
                  key={item.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr",
                    gap: 12,
                    alignItems: "start",
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    background: item.active ? "var(--surface)" : "transparent",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: item.active ? "var(--text)" : "var(--text-dim)",
                      border: "1px solid var(--border)",
                      borderRadius: 999,
                      padding: "3px 8px",
                      textAlign: "center",
                      justifySelf: "start",
                    }}
                  >
                    {item.tag}
                  </span>
                  <div>
                    <div style={{ color: "var(--text)", fontSize: 13.5, fontWeight: 500 }}>
                      {item.title}
                    </div>
                    <div style={{ color: "var(--text-dim)", fontSize: 12.5, lineHeight: 1.5, marginTop: 2 }}>
                      {item.desc}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
