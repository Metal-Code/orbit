type Theme = "dark" | "light";

type EntryType = "dev" | "business" | "design" | "meeting" | "milestone";

type Entry = {
  side: "left" | "right";
  type: EntryType;
  timestamp: string;
  title: string;
  meta: string;
  /** seconds into the loop when this card appears */
  appearAt: number;
};

type Palette = {
  surface: string;
  border: string;
  text: string;
  textMid: string;
  textDim: string;
  spineMid: string;
  spineEdge: string;
  cardShadow: string;
  nodeCenter: string;
  connectorTail: string;
};

const COLORS: Record<EntryType, string> = {
  dev: "#22c55e",
  business: "#3b82f6",
  design: "#a855f7",
  meeting: "#f59e0b",
  milestone: "#ef4444",
};

const TYPE_LABEL: Record<EntryType, string> = {
  dev: "DEV",
  business: "BUSINESS",
  design: "DESIGN",
  meeting: "MEETING",
  milestone: "MILESTONE",
};

const ENTRIES: Entry[] = [
  { side: "left",  type: "milestone", timestamp: "DAY 001 · 09:14", title: "Project Genesis",     meta: "First commit. The repo is born.",      appearAt: 1.2 },
  { side: "right", type: "design",    timestamp: "DAY 008 · 14:22", title: "Design System v0",    meta: "Locked colors, type, spacing tokens.", appearAt: 2.6 },
  { side: "left",  type: "dev",       timestamp: "DAY 021 · 02:47", title: "Auth shipped",        meta: "feat(auth): jwt + refresh rotation",   appearAt: 4.0 },
  { side: "right", type: "business",  timestamp: "DAY 042 · 11:00", title: "Seed round closed",   meta: "$1.2M from three lead funds.",         appearAt: 5.4 },
  { side: "left",  type: "meeting",   timestamp: "DAY 067 · 16:30", title: "Architecture review", meta: "Moved to event-sourced timeline.",     appearAt: 6.8 },
  { side: "right", type: "milestone", timestamp: "DAY 094 · 00:00", title: "Public Launch",       meta: "v1.0. The story begins.",              appearAt: 8.2 },
];

const LOOP = 11;          // total cycle in seconds
const SPINE_START = 0.3;  // when the white line begins drawing
const SPINE_END = 9.2;    // when the line reaches the bottom
const FADE_START = 9.8;   // when everything starts fading out

const PALETTES: Record<Theme, Palette> = {
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
    connectorTail: "rgba(255,255,255,0.10)",
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
    connectorTail: "rgba(44,43,40,0.10)",
  },
};

// Compact layout — scaled down so endpoints don't clip on smaller viewports.
const STAGE_W = 600;
const ROW_H = 92;
const TOP_PAD = 48;
const CARD_W = 260;
const CONNECTOR_LEN = 56;

export function HeroTimeline({ theme }: { theme: Theme }) {
  const p = PALETTES[theme];
  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

  const totalH = TOP_PAD * 2 + (ENTRIES.length - 1) * ROW_H;

  // Percentages along the LOOP for keyframes.
  const pct = (s: number) => (s / LOOP) * 100;
  const spineStartPct = pct(SPINE_START);
  const spineEndPct = pct(SPINE_END);
  const fadeStartPct = pct(FADE_START);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        color: p.text,
      }}
    >
      <style>{buildCss({
        loop: LOOP,
        spineStartPct,
        spineEndPct,
        fadeStartPct,
        entries: ENTRIES.map((e) => pct(e.appearAt)),
      })}</style>

      <div
        className="ht-stage"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: STAGE_W,
          height: totalH,
          // Centered + scaled responsively via CSS var set in media queries
          transform: "translate(-50%, -50%) scale(var(--ht-scale, 1))",
          transformOrigin: "center center",
        }}
      >
        {/* Faint spine track */}
        <div
          style={{
            position: "absolute",
            left: "calc(50% - 1px)",
            top: 0,
            width: 2,
            height: "100%",
            background: `linear-gradient(180deg, ${p.spineEdge} 0%, ${p.spineMid} 50%, ${p.spineEdge} 100%)`,
            opacity: 0.3,
          }}
        />
        {/* Active spine (draws top → bottom each loop) */}
        <div
          className="ht-spine ht-loop"
          style={{
            position: "absolute",
            left: "calc(50% - 1px)",
            top: 0,
            width: 2,
            height: "100%",
            background: `linear-gradient(180deg, ${p.spineEdge} 0%, ${p.spineMid} 50%, ${p.spineEdge} 100%)`,
            transformOrigin: "top center",
          }}
        />
        {/* Glowing head dot that rides the spine tip */}
        <div
          className="ht-head ht-loop"
          style={{
            position: "absolute",
            left: "calc(50% - 5px)",
            top: -5,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: p.text,
            boxShadow: `0 0 18px ${p.text}aa, 0 0 44px ${p.text}55`,
            // travel distance equals the full stage height
            ["--ht-travel" as never]: `${totalH}px`,
          }}
        />

        {ENTRIES.map((e, i) => {
          const y = TOP_PAD + i * ROW_H;
          const isLeft = e.side === "left";
          const color = COLORS[e.type];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y,
                height: 0,
              }}
            >
              <span
                className={`ht-dot ht-loop ht-anim-${i}`}
                style={{
                  position: "absolute",
                  left: "calc(50% - 6px)",
                  top: -6,
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: p.nodeCenter,
                  border: `2px solid ${color}`,
                  boxShadow: `0 0 14px ${color}55`,
                }}
              />
              <span
                className={`ht-connector ht-loop ht-anim-${i} ${isLeft ? "ht-c-left" : "ht-c-right"}`}
                style={{
                  position: "absolute",
                  top: -0.5,
                  height: 1,
                  width: CONNECTOR_LEN,
                  left: isLeft ? `calc(50% - ${CONNECTOR_LEN}px)` : "50%",
                  background: isLeft
                    ? `linear-gradient(270deg, ${color}cc, ${p.connectorTail})`
                    : `linear-gradient(90deg, ${color}cc, ${p.connectorTail})`,
                  transformOrigin: isLeft ? "right center" : "left center",
                }}
              />
              <div
                className={`ht-card ht-loop ht-anim-${i} ${isLeft ? "ht-card-left" : "ht-card-right"}`}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  padding: "11px 14px",
                  background: p.surface,
                  border: `1px solid ${p.border}`,
                  borderRadius: 9,
                  boxShadow: p.cardShadow,
                  top: -34,
                  left: isLeft
                    ? `calc(50% - ${CONNECTOR_LEN}px - ${CARD_W}px)`
                    : `calc(50% + ${CONNECTOR_LEN}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 999, background: color }} />
                  <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.12em", color: p.textMid }}>
                    {TYPE_LABEL[e.type]}
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ fontFamily: mono, fontSize: 9.5, color: p.textDim, letterSpacing: "0.06em" }}>
                    {e.timestamp}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: p.text, marginBottom: 3, letterSpacing: "-0.01em" }}>
                  {e.title}
                </div>
                <div style={{ fontSize: 11.5, color: p.textDim, lineHeight: 1.5 }}>{e.meta}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: mono,
          fontSize: 10,
          letterSpacing: "0.3em",
          color: p.textDim,
          opacity: 0.7,
        }}
      >
        DEVCYCLE.APP
      </div>
    </div>
  );
}

/**
 * Build a single infinitely-looping keyframe set. Every element animates on a
 * shared LOOP-second clock, so the whole chart restarts in lockstep when the
 * spine reaches the bottom — no JS timers, no animation replay tricks.
 */
function buildCss(args: {
  loop: number;
  spineStartPct: number;
  spineEndPct: number;
  fadeStartPct: number;
  entries: number[]; // per-entry appearAt as % of loop
}) {
  const { loop, spineStartPct, spineEndPct, fadeStartPct, entries } = args;
  const SPRING = "cubic-bezier(.34,1.56,.64,1)";

  const entryKeyframes = entries
    .map((appearPct, i) => {
      // Each entry: hidden → animate in over ~6% of loop → stay visible → fade with the whole chart.
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
    })
    .join("\n");

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
