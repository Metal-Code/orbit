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

          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: "var(--text-dim)",
            }}
          >
            <span>Built by</span>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>Ayush Kumar</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <a
              href="https://github.com/Metal-Code"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text-mid)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.73.5.67 5.57.67 11.84c0 5.01 3.24 9.26 7.74 10.76.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.15.69-3.81-1.34-3.81-1.34-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.05-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.16.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.47 3.15-1.16 3.15-1.16.62 1.57.23 2.73.11 3.02.73.8 1.17 1.81 1.17 3.05 0 4.35-2.66 5.31-5.19 5.59.41.36.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55 4.49-1.5 7.73-5.75 7.73-10.76C23.33 5.57 18.27.5 12 .5z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/ayushkumar2003/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text-mid)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
              </svg>
            </a>
          </div>
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
