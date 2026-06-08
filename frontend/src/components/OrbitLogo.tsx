import { useEffect, useRef } from "react";

type Props = {
  size?: number;
  showText?: boolean;
};

// Module-level epoch so rotation is continuous across remounts/route changes.
const ORBIT_EPOCH =
  typeof performance !== "undefined" ? performance.now() : 0;

const OUTER_PERIOD_MS = 6000;
const INNER_PERIOD_MS = 3800;

export function OrbitLogo({ size = 110, showText = true }: Props) {
  const scale = size / 110;
  const cx = 55 * scale;
  const cy = 55 * scale;
  const outerR = 53 * scale;
  const innerR = 32 * scale;
  const planetR = 7 * scale;
  const sw = Math.max(1, 1.5 * scale);
  const textSize = 72 * scale;
  const gap = 16 * scale;
  const textX = cx + outerR + gap;
  const textY = 78 * scale;
  const pad = 10 * scale;
  const svgH = size + pad * 2;
  const svgW = showText ? cx + outerR + gap + 230 * scale + pad : size + pad * 2;

  const outerRef = useRef<SVGGElement | null>(null);
  const innerRef = useRef<SVGGElement | null>(null);

  // Compute initial angles synchronously so first paint matches phase
  // (avoids the one-frame "jump" on mount/route change).
  const initialElapsed =
    (typeof performance !== "undefined" ? performance.now() : 0) - ORBIT_EPOCH;
  const initialOuter = -((initialElapsed % OUTER_PERIOD_MS) / OUTER_PERIOD_MS) * 360;
  const initialInner = ((initialElapsed % INNER_PERIOD_MS) / INNER_PERIOD_MS) * 360;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - ORBIT_EPOCH;
      const outerDeg = -((elapsed % OUTER_PERIOD_MS) / OUTER_PERIOD_MS) * 360;
      const innerDeg = ((elapsed % INNER_PERIOD_MS) / INNER_PERIOD_MS) * 360;
      if (outerRef.current) {
        outerRef.current.setAttribute("transform", `rotate(${outerDeg} ${cx} ${cy})`);
      }
      if (innerRef.current) {
        innerRef.current.setAttribute("transform", `rotate(${innerDeg} ${cx} ${cy})`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cx, cy]);

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`${-pad} ${-pad} ${svgW} ${svgH}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="currentColor" strokeWidth={sw} opacity={0.6} />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="currentColor" strokeWidth={sw} opacity={0.6} />

      <g ref={outerRef} transform={`rotate(${initialOuter} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy - outerR} r={planetR} fill="#6ca8f0" />
      </g>
      <g ref={innerRef} transform={`rotate(${initialInner} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy - innerR} r={planetR} fill="#e870a0" />
      </g>

      {showText && (
        <text
          x={textX}
          y={textY}
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight={900}
          fontSize={textSize}
          fill="currentColor"
          letterSpacing={-3 * scale}
        >
          rbit
        </text>
      )}
    </svg>
  );
}
