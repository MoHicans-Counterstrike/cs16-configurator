import { useEffect, useMemo, useRef, useState } from "react";

// Renders an approximate CS 1.6 crosshair as inline SVG.
// size: auto|small|medium|large, color "R G B", translucent 0..2
export default function CrosshairPreview({
  size,
  color,
  translucent,
  dynamic,
}: {
  size: string;
  color: string;
  translucent: number;
  dynamic: boolean;
}) {
  const [spread, setSpread] = useState(0);
  const t = useRef<number | null>(null);

  // animate spread if dynamic is on
  useEffect(() => {
    if (!dynamic) return setSpread(0);
    let up = true;
    t.current = window.setInterval(() => {
      setSpread((s) => {
        if (up) {
          const n = s + 1;
          if (n >= 10) up = false;
          return n;
        }
        const n = s - 1;
        if (n <= 0) up = true;
        return n;
      });
    }, 90);
    return () => t.current !== null && clearInterval(t.current);
  }, [dynamic]);

  const rgb = useMemo(() => {
    const parts = (color || "50 250 50").split(/\s+/).map(Number);
    return `rgb(${parts[0] || 0}, ${parts[1] || 255}, ${parts[2] || 0})`;
  }, [color]);

  const gapBase = { auto: 5, small: 4, medium: 6, large: 9 }[size] ?? 4;
  const len = { auto: 7, small: 6, medium: 9, large: 13 }[size] ?? 6;
  const gap = gapBase + spread * 0.8;
  const opacity = translucent === 0 ? 1 : translucent === 1 ? 0.65 : 0.4;

  return (
    <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 rounded-lg p-3">
      {/* fake game view */}
      <div className="relative w-full h-20 rounded overflow-hidden bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-900">
        {/* horizon line for vibe */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-600/30" />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
          <g stroke={rgb} strokeWidth={translucent === 2 ? 1 : 2} opacity={opacity}>
            {/* 4 ticks around center */}
            <line x1={100} y1={40 - gap} x2={100} y2={40 - gap - len} />
            <line x1={100} y1={40 + gap} x2={100} y2={40 + gap + len} />
            <line x1={100 - gap} y1={40} x2={100 - gap - len * 1.4} y2={40} />
            <line x1={100 + gap} y1={40} x2={100 + gap + len * 1.4} y2={40} />
            {/* optional dot */}
          </g>
        </svg>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Preview</div>
        <div className="text-xs text-amber-300 font-mono">
          {size}
          {dynamic && <span className="text-orange-400 ml-1">dyn</span>}
        </div>
      </div>
    </div>
  );
}
