type Props = {
  size?: number;
  showText?: boolean;
};

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
  const textX = (cx + outerR + gap);
  const textY = 78 * scale;
  const pad = 10 * scale;
  const svgH = size + pad * 2;
  const svgW = showText ? (cx + outerR + gap + 230 * scale + pad) : (size + pad * 2);

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`${-pad} ${-pad} ${svgW} ${svgH}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          .ol-outer { animation: ol-ccw 6s linear infinite; transform-origin: ${cx}px ${cy}px; }
          .ol-inner { animation: ol-cw 3.8s linear infinite; transform-origin: ${cx}px ${cy}px; }
          @keyframes ol-cw  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes ol-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        `}</style>
      </defs>

      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="currentColor" strokeWidth={sw} opacity={0.6} />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="currentColor" strokeWidth={sw} opacity={0.6} />

      <g className="ol-outer">
        <circle cx={cx} cy={cy - outerR} r={planetR} fill="#6ca8f0" />
      </g>
      <g className="ol-inner">
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