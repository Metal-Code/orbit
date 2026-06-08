/**
 * OrbitLogo — pure-CSS animated wordmark.
 * Ported from the user's reference HTML: two concentric thin rings, blue + pink
 * planets revolving in opposite directions, heavy Arial Black wordmark.
 *
 * All dimensions are derived from the `size` prop (ring container height)
 * using the same ratios as the reference (110px container → 72px wordmark, etc.).
 */
type Props = {
  size?: number;     // height of the orbit ring container, in px
  showText?: boolean;
};

export function OrbitLogo({ size = 32, showText = true }: Props) {
  // Ratios taken straight from the reference: container=110 → outer=108, inner=66, planet=14, text=72
  const outer = size * (108 / 110);
  const inner = size * (66 / 110);
  const planet = Math.max(3, size * (14 / 110));
  const textSize = size * (72 / 110);
  const ringBorder = Math.max(1, size * (1.5 / 110));

  return (
    <span
      className="orbit-logo"
      style={{
        ["--orbit-size" as never]: `${size}px`,
        ["--ring-outer" as never]: `${outer}px`,
        ["--ring-inner" as never]: `${inner}px`,
        ["--planet" as never]: `${planet}px`,
        ["--ring-border" as never]: `${ringBorder}px`,
        ["--text-size" as never]: `${textSize}px`,
      }}
    >
      <span className="orbit-container" aria-hidden="true">
        <span className="orbit-ring orbit-ring-outer" />
        <span className="orbit-ring orbit-ring-inner" />
        <span className="orbit-track orbit-track-outer">
          <span className="orbit-planet orbit-planet-blue" />
        </span>
        <span className="orbit-track orbit-track-inner">
          <span className="orbit-planet orbit-planet-pink" />
        </span>
      </span>

      {showText && <span className="orbit-wordmark">rbit</span>}

      <style>{`
        .orbit-logo {
          display: inline-flex;
          align-items: center;
          line-height: 1;
          user-select: none;
        }
        .orbit-container {
          position: relative;
          width: var(--orbit-size);
          height: var(--orbit-size);
          flex-shrink: 0;
        }
        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: var(--ring-border) solid rgba(255,255,255,0.6);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .orbit-ring-outer { width: var(--ring-outer); height: var(--ring-outer); }
        .orbit-ring-inner { width: var(--ring-inner); height: var(--ring-inner); }

        .orbit-track {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
        }
        .orbit-track-outer {
          width: var(--ring-outer);
          height: var(--ring-outer);
          margin-left: calc(var(--ring-outer) / -2);
          margin-top:  calc(var(--ring-outer) / -2);
          animation: orbit-ccw 6s linear infinite;
        }
        .orbit-track-inner {
          width: var(--ring-inner);
          height: var(--ring-inner);
          margin-left: calc(var(--ring-inner) / -2);
          margin-top:  calc(var(--ring-inner) / -2);
          animation: orbit-cw 3.8s linear infinite;
        }
        .orbit-planet {
          position: absolute;
          border-radius: 50%;
          top: calc(var(--planet) / -2);
          left: 50%;
          transform: translateX(-50%);
          width: var(--planet);
          height: var(--planet);
        }
        .orbit-planet-blue { background: #6ca8f0; }
        .orbit-planet-pink { background: #e870a0; }

        .orbit-wordmark {
          color: currentColor;
          font-size: var(--text-size);
          font-weight: 900;
          font-family: 'Arial Black', Impact, sans-serif;
          letter-spacing: calc(var(--text-size) * -0.042);
          line-height: 1;
          margin-left: calc(var(--orbit-size) * 0.036);
        }

        @keyframes orbit-cw  { to { transform: rotate(360deg);  } }
        @keyframes orbit-ccw { to { transform: rotate(-360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .orbit-track-outer, .orbit-track-inner { animation: none !important; }
        }
      `}</style>
    </span>
  );
}
