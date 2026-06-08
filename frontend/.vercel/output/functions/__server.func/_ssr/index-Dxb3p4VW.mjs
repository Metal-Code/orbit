import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { O as OrbitLogo, M as MoonIcon } from "./OrbitLogo-CF1LOC5D.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const COLORS = {
  dev: "#22c55e",
  business: "#3b82f6",
  design: "#a855f7",
  meeting: "#f59e0b",
  milestone: "#ef4444"
};
const TYPE_LABEL = {
  dev: "DEV",
  business: "BUSINESS",
  design: "DESIGN",
  meeting: "MEETING",
  milestone: "MILESTONE"
};
const ENTRIES = [
  { side: "left", type: "milestone", timestamp: "DAY 001 · 09:14", title: "Project Genesis", meta: "First commit. The repo is born.", appearAt: 1.2 },
  { side: "right", type: "design", timestamp: "DAY 008 · 14:22", title: "Design System v0", meta: "Locked colors, type, spacing tokens.", appearAt: 2.6 },
  { side: "left", type: "dev", timestamp: "DAY 021 · 02:47", title: "Auth shipped", meta: "feat(auth): jwt + refresh rotation", appearAt: 4 },
  { side: "right", type: "business", timestamp: "DAY 042 · 11:00", title: "Seed round closed", meta: "$1.2M from three lead funds.", appearAt: 5.4 },
  { side: "left", type: "meeting", timestamp: "DAY 067 · 16:30", title: "Architecture review", meta: "Moved to event-sourced timeline.", appearAt: 6.8 },
  { side: "right", type: "milestone", timestamp: "DAY 094 · 00:00", title: "Public Launch", meta: "v1.0. The story begins.", appearAt: 8.2 }
];
const LOOP = 11;
const SPINE_START = 0.3;
const SPINE_END = 9.2;
const FADE_START = 9.8;
const PALETTES = {
  dark: {
    surface: "#111111",
    border: "#1f1f1f",
    text: "#ffffff",
    textMid: "#b3b3b3",
    textDim: "#888888",
    spineMid: "rgba(255,255,255,0.35)",
    spineEdge: "rgba(255,255,255,0.05)",
    cardShadow: "0 16px 50px rgba(0,0,0,0.55)",
    nodeCenter: "#0a0a0a",
    connectorTail: "rgba(255,255,255,0.10)"
  },
  light: {
    surface: "#f3f1ea",
    border: "#e2dfd2",
    text: "#2c2b28",
    textMid: "#4a4842",
    textDim: "#7a776e",
    spineMid: "rgba(44,43,40,0.45)",
    spineEdge: "rgba(44,43,40,0.06)",
    cardShadow: "0 14px 42px rgba(40,38,33,0.12)",
    nodeCenter: "#faf9f5",
    connectorTail: "rgba(44,43,40,0.10)"
  }
};
const STAGE_W = 600;
const ROW_H = 92;
const TOP_PAD = 48;
const CARD_W = 260;
const CONNECTOR_LEN = 56;
function HeroTimeline({ theme }) {
  const p = PALETTES[theme];
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
  const totalH = TOP_PAD * 2 + (ENTRIES.length - 1) * ROW_H;
  const pct = (s) => s / LOOP * 100;
  const spineStartPct = pct(SPINE_START);
  const spineEndPct = pct(SPINE_END);
  const fadeStartPct = pct(FADE_START);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        color: p.text
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: buildCss({
          loop: LOOP,
          spineStartPct,
          spineEndPct,
          fadeStartPct,
          entries: ENTRIES.map((e) => pct(e.appearAt))
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "ht-stage",
            style: {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: STAGE_W,
              height: totalH,
              // Centered + scaled responsively via CSS var set in media queries
              transform: "translate(-50%, -50%) scale(var(--ht-scale, 1))",
              transformOrigin: "center center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: "calc(50% - 1px)",
                    top: 0,
                    width: 2,
                    height: "100%",
                    background: `linear-gradient(180deg, ${p.spineEdge} 0%, ${p.spineMid} 50%, ${p.spineEdge} 100%)`,
                    opacity: 0.3
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "ht-spine ht-loop",
                  style: {
                    position: "absolute",
                    left: "calc(50% - 1px)",
                    top: 0,
                    width: 2,
                    height: "100%",
                    background: `linear-gradient(180deg, ${p.spineEdge} 0%, ${p.spineMid} 50%, ${p.spineEdge} 100%)`,
                    transformOrigin: "top center"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "ht-head ht-loop",
                  style: {
                    position: "absolute",
                    left: "calc(50% - 5px)",
                    top: -5,
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: p.text,
                    boxShadow: `0 0 18px ${p.text}aa, 0 0 44px ${p.text}55`,
                    // travel distance equals the full stage height
                    ["--ht-travel"]: `${totalH}px`
                  }
                }
              ),
              ENTRIES.map((e, i) => {
                const y = TOP_PAD + i * ROW_H;
                const isLeft = e.side === "left";
                const color = COLORS[e.type];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: y,
                      height: 0
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `ht-dot ht-loop ht-anim-${i}`,
                          style: {
                            position: "absolute",
                            left: "calc(50% - 6px)",
                            top: -6,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: p.nodeCenter,
                            border: `2px solid ${color}`,
                            boxShadow: `0 0 14px ${color}55`
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `ht-connector ht-loop ht-anim-${i} ${isLeft ? "ht-c-left" : "ht-c-right"}`,
                          style: {
                            position: "absolute",
                            top: -0.5,
                            height: 1,
                            width: CONNECTOR_LEN,
                            left: isLeft ? `calc(50% - ${CONNECTOR_LEN}px)` : "50%",
                            background: isLeft ? `linear-gradient(270deg, ${color}cc, ${p.connectorTail})` : `linear-gradient(90deg, ${color}cc, ${p.connectorTail})`,
                            transformOrigin: isLeft ? "right center" : "left center"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `ht-card ht-loop ht-anim-${i} ${isLeft ? "ht-card-left" : "ht-card-right"}`,
                          style: {
                            position: "absolute",
                            width: CARD_W,
                            padding: "11px 14px",
                            background: p.surface,
                            border: `1px solid ${p.border}`,
                            borderRadius: 9,
                            boxShadow: p.cardShadow,
                            top: -34,
                            left: isLeft ? `calc(50% - ${CONNECTOR_LEN}px - ${CARD_W}px)` : `calc(50% + ${CONNECTOR_LEN}px)`
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 7, height: 7, borderRadius: 999, background: color } }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: mono, fontSize: 9.5, letterSpacing: "0.12em", color: p.textMid }, children: TYPE_LABEL[e.type] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: mono, fontSize: 9.5, color: p.textDim, letterSpacing: "0.06em" }, children: e.timestamp })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 600, color: p.text, marginBottom: 3, letterSpacing: "-0.01em" }, children: e.title }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11.5, color: p.textDim, lineHeight: 1.5 }, children: e.meta })
                          ]
                        }
                      )
                    ]
                  },
                  i
                );
              })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: "0.3em",
              color: p.textDim,
              opacity: 0.7
            },
            children: "ORBIT.APP"
          }
        )
      ]
    }
  );
}
function buildCss(args) {
  const { loop, spineStartPct, spineEndPct, fadeStartPct, entries } = args;
  const SPRING = "cubic-bezier(.34,1.56,.64,1)";
  const entryKeyframes = entries.map((appearPct, i) => {
    const inEndPct = Math.min(appearPct + 6, fadeStartPct);
    const fadeEndPct = 100;
    return `
        @keyframes ht-dot-${i} {
          0%, ${appearPct.toFixed(2)}% { opacity: 0; transform: scale(0); }
          ${(appearPct + 3).toFixed(2)}% { opacity: 1; transform: scale(1.25); }
          ${inEndPct.toFixed(2)}%, ${fadeStartPct.toFixed(2)}% { opacity: 1; transform: scale(1); }
          ${fadeEndPct}% { opacity: 0; transform: scale(1); }
        }
        @keyframes ht-conn-${i} {
          0%, ${appearPct.toFixed(2)}% { transform: scaleX(0); opacity: 0; }
          ${(appearPct + 1).toFixed(2)}% { opacity: 1; }
          ${inEndPct.toFixed(2)}%, ${fadeStartPct.toFixed(2)}% { transform: scaleX(1); opacity: 1; }
          ${fadeEndPct}% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes ht-card-left-${i} {
          0%, ${appearPct.toFixed(2)}% { opacity: 0; transform: translateX(-60px); }
          ${inEndPct.toFixed(2)}%, ${fadeStartPct.toFixed(2)}% { opacity: 1; transform: translateX(0); }
          ${fadeEndPct}% { opacity: 0; transform: translateX(0); }
        }
        @keyframes ht-card-right-${i} {
          0%, ${appearPct.toFixed(2)}% { opacity: 0; transform: translateX(60px); }
          ${inEndPct.toFixed(2)}%, ${fadeStartPct.toFixed(2)}% { opacity: 1; transform: translateX(0); }
          ${fadeEndPct}% { opacity: 0; transform: translateX(0); }
        }
        .ht-anim-${i}.ht-dot       { animation: ht-dot-${i} ${loop}s ${SPRING} infinite; }
        .ht-anim-${i}.ht-connector { animation: ht-conn-${i} ${loop}s ease-out infinite; }
        .ht-anim-${i}.ht-card-left  { animation: ht-card-left-${i} ${loop}s ${SPRING} infinite; }
        .ht-anim-${i}.ht-card-right { animation: ht-card-right-${i} ${loop}s ${SPRING} infinite; }
      `;
  }).join("\n");
  return `
    @keyframes ht-spine {
      0%, ${spineStartPct.toFixed(2)}% { transform: scaleY(0); opacity: 1; }
      ${spineEndPct.toFixed(2)}%, ${fadeStartPct.toFixed(2)}% { transform: scaleY(1); opacity: 1; }
      100% { transform: scaleY(1); opacity: 0; }
    }
    @keyframes ht-head {
      0%, ${spineStartPct.toFixed(2)}% { transform: translateY(0); opacity: 0; }
      ${(spineStartPct + 0.5).toFixed(2)}% { opacity: 1; }
      ${(spineEndPct - 0.5).toFixed(2)}% { opacity: 1; }
      ${spineEndPct.toFixed(2)}%, 100% { transform: translateY(var(--ht-travel, 100%)); opacity: 0; }
    }

    .ht-spine { transform: scaleY(0); animation: ht-spine ${loop}s linear infinite; }
    .ht-head  { opacity: 0; animation: ht-head ${loop}s linear infinite; }

    ${entryKeyframes}

    .ht-stage { --ht-scale: 1; }
    @media (max-width: 1100px) { .ht-stage { --ht-scale: 0.85; } }
    @media (max-width: 900px)  { .ht-stage { --ht-scale: 0.72; } }
    @media (max-width: 700px)  { .ht-stage { --ht-scale: 0.6; } }

    @media (prefers-reduced-motion: reduce) {
      .ht-loop { animation: none !important; opacity: 1 !important; transform: none !important; }
      .ht-spine { transform: scaleY(1) !important; }
      .ht-head  { display: none; }
    }
  `;
}
function Landing() {
  const [theme, setTheme] = reactExports.useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("orbit.theme") || "dark";
  });
  reactExports.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("orbit.theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => t === "dark" ? "light" : "dark");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative",
    background: "var(--bg)",
    color: "var(--text)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 28px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OrbitLogo, { size: 22 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: toggleTheme, "aria-label": "Toggle theme", title: theme === "dark" ? "Switch to light mode" : "Switch to dark mode", children: theme === "dark" ? "☀" : /* @__PURE__ */ jsxRuntimeExports.jsx(MoonIcon, { size: 16, style: {
          display: "inline-block",
          verticalAlign: "-3px"
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "btn btn-ghost", children: "Login" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "btn btn-secondary", children: "Register" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(28px, 5vw, 72px)",
        zIndex: 5
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 12,
          letterSpacing: "0.25em",
          color: "var(--text-dim)",
          marginBottom: 18,
          textTransform: "uppercase"
        }, children: "The Build Record →" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { style: {
          fontSize: "clamp(34px, 4.6vw, 64px)",
          lineHeight: 1.04,
          letterSpacing: "-0.025em",
          fontWeight: 600,
          margin: 0,
          color: "var(--text)"
        }, children: [
          "The complete story",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "of how",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "YOUR Product",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "is being built."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
          marginTop: 18,
          marginBottom: 28,
          fontSize: 15,
          color: "var(--text-dim)",
          maxWidth: 480,
          lineHeight: 1.55
        }, children: "Track every decision, milestone, and commit from day one and beyond." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "btn btn-primary", style: {
          padding: "11px 22px"
        }, children: "Get Started →" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        position: "relative",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HeroTimeline, { theme }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, style: {
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: theme === "dark" ? "linear-gradient(90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 18%)" : "linear-gradient(90deg, rgba(250,249,245,1) 0%, rgba(250,249,245,0) 18%)"
        } })
      ] })
    ] })
  ] });
}
export {
  Landing as component
};
