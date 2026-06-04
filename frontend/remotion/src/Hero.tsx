import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: inter } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: mono } = loadMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

type EntryDef = {
  side: "left" | "right";
  type: "dev" | "business" | "design" | "meeting" | "milestone";
  timestamp: string;
  title: string;
  meta: string;
  appearAt: number;
};

const COLORS: Record<EntryDef["type"], string> = {
  dev: "#22c55e",
  business: "#3b82f6",
  design: "#a855f7",
  meeting: "#f59e0b",
  milestone: "#ef4444",
};

const TYPE_LABEL: Record<EntryDef["type"], string> = {
  dev: "DEV",
  business: "BUSINESS",
  design: "DESIGN",
  meeting: "MEETING",
  milestone: "MILESTONE",
};

const ENTRIES: EntryDef[] = [
  { side: "left",  type: "milestone", timestamp: "DAY 001 · 09:14", title: "Project Genesis",   meta: "First commit. The repo is born.",      appearAt: 40 },
  { side: "right", type: "design",    timestamp: "DAY 008 · 14:22", title: "Design System v0",  meta: "Locked colors, type, spacing tokens.", appearAt: 110 },
  { side: "left",  type: "dev",       timestamp: "DAY 021 · 02:47", title: "Auth shipped",      meta: "feat(auth): jwt + refresh rotation",   appearAt: 180 },
  { side: "right", type: "business",  timestamp: "DAY 042 · 11:00", title: "Seed round closed", meta: "$1.2M from three lead funds.",         appearAt: 250 },
  { side: "left",  type: "meeting",   timestamp: "DAY 067 · 16:30", title: "Architecture review", meta: "Moved to event-sourced timeline.",   appearAt: 320 },
  { side: "right", type: "milestone", timestamp: "DAY 094 · 00:00", title: "Public Launch",     meta: "v1.0. The story begins.",              appearAt: 390 },
];

export type ThemeName = "dark" | "light";

type Palette = {
  bg: string;
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

const PALETTES: Record<ThemeName, Palette> = {
  dark: {
    bg: "#0a0a0a",
    surface: "#111111",
    border: "#1f1f1f",
    text: "#ffffff",
    textMid: "#b3b3b3",
    textDim: "#888888",
    spineMid: "rgba(255,255,255,0.35)",
    spineEdge: "rgba(255,255,255,0.05)",
    cardShadow: "0 20px 60px rgba(0,0,0,0.55)",
    nodeCenter: "#0a0a0a",
    connectorTail: "rgba(255,255,255,0.10)",
  },
  light: {
    bg: "#faf9f5",
    surface: "#f3f1ea",
    border: "#e2dfd2",
    text: "#2c2b28",
    textMid: "#4a4842",
    textDim: "#7a776e",
    spineMid: "rgba(44,43,40,0.45)",
    spineEdge: "rgba(44,43,40,0.06)",
    cardShadow: "0 18px 50px rgba(40,38,33,0.12)",
    nodeCenter: "#faf9f5",
    connectorTail: "rgba(44,43,40,0.10)",
  },
};

export type HeroProps = { theme: ThemeName };

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const p = PALETTES[theme];

  const subOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" });

  const spineStart = 20;
  const spineEnd = 430;
  const spineProgress = interpolate(frame, [spineStart, spineEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tailFade = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const BASE = 1080;
  const scale = width / BASE;
  const logicalW = BASE;
  const logicalH = height / scale;
  const centerX = logicalW / 2;
  const spineTop = 110;
  const spineBottom = logicalH - 110;
  const spineLen = spineBottom - spineTop;
  const drawnHeight = spineLen * spineProgress;

  return (
    <AbsoluteFill
      style={{
        background: p.bg,
        fontFamily: inter,
        color: p.text,
        opacity: tailFade,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: logicalW,
          height: logicalH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
      {/* Spine */}
      <div
        style={{
          position: "absolute",
          left: centerX - 1,
          top: spineTop,
          width: 2,
          height: drawnHeight,
          background: `linear-gradient(180deg, ${p.spineEdge} 0%, ${p.spineMid} 50%, ${p.spineEdge} 100%)`,
        }}
      />
      {spineProgress > 0 && spineProgress < 1 && (
        <div
          style={{
            position: "absolute",
            left: centerX - 6,
            top: spineTop + drawnHeight - 6,
            width: 12,
            height: 12,
            borderRadius: 999,
            background: p.text,
            boxShadow: `0 0 24px ${p.text}aa, 0 0 60px ${p.text}55`,
          }}
        />
      )}

      {ENTRIES.map((e, i) => {
        const y = spineTop + 70 + i * 130;
        return (
          <Sequence key={i} from={e.appearAt}>
            <Entry entry={e} y={y} centerX={centerX} palette={p} />
          </Sequence>
        );
      })}

      {/* Subtle footer */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: mono,
          fontSize: 12,
          letterSpacing: "0.3em",
          color: p.textDim,
          opacity: subOpacity * 0.6,
        }}
      >
        DEVCYCLE.APP
      </div>
      </div>
    </AbsoluteFill>
  );
};

const Entry: React.FC<{
  entry: EntryDef;
  y: number;
  centerX: number;
  palette: Palette;
}> = ({ entry, y, centerX, palette: p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 18, stiffness: 140, mass: 0.9 } });

  const isLeft = entry.side === "left";
  const dir = isLeft ? -1 : 1;
  const offset = interpolate(s, [0, 1], [80 * dir, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const connectorScale = interpolate(s, [0, 1], [0, 1]);

  const cardWidth = 360;
  const connectorLen = 80;
  const dotSize = 14;
  const cardX = isLeft ? centerX - connectorLen - cardWidth : centerX + connectorLen;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: centerX - dotSize / 2,
          top: y - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: 999,
          background: p.nodeCenter,
          border: `2px solid ${COLORS[entry.type]}`,
          opacity,
          boxShadow: `0 0 16px ${COLORS[entry.type]}55`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: isLeft ? centerX - connectorLen : centerX,
          top: y - 0.5,
          width: connectorLen,
          height: 1,
          background: `linear-gradient(${isLeft ? "270deg" : "90deg"}, ${COLORS[entry.type]}cc, ${p.connectorTail})`,
          transformOrigin: isLeft ? "right center" : "left center",
          transform: `scaleX(${connectorScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: y - 42,
          width: cardWidth,
          padding: "14px 18px",
          background: p.surface,
          border: `1px solid ${p.border}`,
          borderRadius: 10,
          opacity,
          transform: `translateX(${offset}px)`,
          boxShadow: p.cardShadow,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: COLORS[entry.type] }} />
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", color: p.textMid }}>
            {TYPE_LABEL[entry.type]}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: mono, fontSize: 11, color: p.textDim, letterSpacing: "0.06em" }}>
            {entry.timestamp}
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: p.text, marginBottom: 4, letterSpacing: "-0.01em" }}>
          {entry.title}
        </div>
        <div style={{ fontSize: 13, color: p.textDim, lineHeight: 1.5 }}>{entry.meta}</div>
      </div>
    </>
  );
};
