import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";

// Hand-drawn GoldSrc-style map scenes (SVG) — distinct compositions per map,
// different angles/lighting so the crosshair test actually differs per scene.
const SCENES: Record<string, {
  name: string;
  render: (p: typeof SCENESRenderHelpers) => JSX.Element;
}> = {} as any;

const SCENESRenderHelpers = {}; // placeholder to satisfy types above

const MAP_SCENES = [
  {
    id: "dust2-long",
    name: "dust2 · long doors",
    sky: "#d4c493",
  },
  {
    id: "inferno-banana",
    name: "inferno · banana",
    sky: "#8fa3b8",
  },
  {
    id: "nuke-yard",
    name: "nuke · outside",
    sky: "#a8b8c0",
  },
  {
    id: "train-site",
    name: "train · ivy",
    sky: "#b5c2ca",
  },
];

function Scene({ id }: { id: string }) {
  if (id === "inferno-banana") {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* dark narrow corridor */}
        <rect width="400" height="300" fill="#1c1712" />
        {/* sandbags left */}
        <ellipse cx="60" cy="240" rx="70" ry="45" fill="#6b5d3f" />
        <ellipse cx="40" cy="260" rx="55" ry="35" fill="#5c4f33" />
        {/* walls converging */}
        <polygon points="0,0 140,80 140,220 0,300" fill="#3a3128" />
        <polygon points="400,0 270,75 270,225 400,300" fill="#443a2e" />
        <rect x="140" y="80" width="130" height="145" fill="#57493a" />
        <rect x="140" y="80" width="130" height="12" fill="#00000040" />
        {/* barrel */}
        <g>
          <ellipse cx="320" cy="235" rx="32" ry="14" fill="#2a241c" />
          <rect x="288" y="190" width="64" height="48" fill="#7a4b30" />
          <rect x="288" y="205" width="64" height="6" fill="#00000035" />
        </g>
        {/* light shaft from above */}
        <polygon points="180,0 230,0 280,150 150,150" fill="#ffffff08" />
      </svg>
    );
  }
  if (id === "nuke-yard") {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* bright industrial sky */}
        <rect width="400" height="160" fill="#aebfc7" />
        <rect y="120" width="400" height="40" fill="#9db0b8" opacity="0.6" />
        {/* big concrete building right */}
        <rect x="250" y="60" width="150" height="160" fill="#7d868b" />
        <rect x="250" y="60" width="150" height="160" fill="none" stroke="#00000025" strokeWidth="2" />
        {/* windows grid */}
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect key={`${r}${c}`} x={265 + c * 42} y={78 + r * 38} width="26" height="22" fill="#3d464b" />
          ))
        )}
        {/* yard ground */}
        <rect y="220" width="400" height="80" fill="#666d70" />
        {/* ramp */}
        <polygon points="0,300 90,220 160,220 60,300" fill="#585f62" />
        {/* container */}
        <g>
          <rect x="60" y="170" width="110" height="52" fill="#8a4432" />
          <line x1="88" y1="170" x2="88" y2="222" stroke="#00000030" strokeWidth="2" />
          <line x1="116" y1="170" x2="116" y2="222" stroke="#00000030" strokeWidth="2" />
          <line x1="144" y1="170" x2="144" y2="222" stroke="#00000030" strokeWidth="2" />
        </g>
      </svg>
    );
  }
  if (id === "train-site") {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* overcast */}
        <rect width="400" height="150" fill="#b5c2ca" />
        {/* train car side */}
        <rect y="150" width="400" height="85" fill="#4e565c" />
        <rect y="150" width="400" height="10" fill="#00000030" />
        {/* train windows */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={20 + i * 80} y="168" width="50" height="34" rx="3" fill="#20272b" />
        ))}
        {/* wheels hint */}
        <rect y="235" width="400" height="65" fill="#5a5248" />
        {/* ivy on far wall */}
        <rect x="0" y="100" width="400" height="50" fill="#3e4a3a" />
        {[...Array(14)].map((_, i) => (
          <circle key={i} cx={(i * 31) % 400} cy={105 + ((i * 17) % 40)} r={5 + (i % 3) * 2} fill="#4d5f47" opacity="0.85" />
        ))}
      </svg>
    );
  }
  // default: dust2 long
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="140" fill="#d4c493" />
      <circle cx="330" cy="40" r="22" fill="#fff8e0" opacity="0.7" />
      {/* arches of long doors */}
      <path d="M 60 300 L 60 160 Q 60 120 100 120 Q 140 120 140 160 L 140 300 Z" fill="#8a7952" />
      <path d="M 75 300 L 75 165 Q 75 135 100 135 Q 125 135 125 165 L 125 300 Z" fill="#2e2820" />
      {/* wall */}
      <rect x="160" y="130" width="240" height="100" fill="#c2b183" />
      <rect x="160" y="130" width="240" height="5" fill="#00000025" />
      {/* crates stacked */}
      <rect x="290" y="185" width="60" height="55" fill="#a08c5e" />
      <rect x="295" y="175" width="50" height="18" fill="#8f7c50" />
      <line x1="320" y1="185" x2="320" y2="240" stroke="#00000025" strokeWidth="2" />
      {/* sandy ground with shadows */}
      <rect y="230" width="400" height="70" fill="#cbb87f" />
      <polygon points="0,230 400,230 400,245 0,238" fill="#00000012" />
    </svg>
  );
}

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
  const [scene, setScene] = useState<string>("dust2-long");
  const [spread, setSpread] = useState(0);
  const t = useRef<number | null>(null);

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

  // CS 1.6 crosshair geometry scales with resolution choice is out of scope here;
  // size maps like the real game: small=short ticks close to center.
  const gapBase = { auto: 6, small: 5, medium: 8, large: 12 }[size] ?? 5;
  const len = { auto: 9, small: 7, medium: 11, large: 16 }[size] ?? 7;
  const gap = gapBase + spread * 0.9;
  const thickness = translucent === 2 ? 1 : 2;
  const opacity = translucent === 0 ? 1 : translucent === 1 ? 0.65 : 0.4;

  return (
    <div>
      {/* map switcher */}
      <div className="flex gap-1 mb-2 flex-wrap">
        {MAP_SCENES.map((s) => (
          <button
            key={s.id}
            onClick={() => setScene(s.id)}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-mono border transition-colors",
              scene === s.id
                ? "border-orange-500 text-orange-300 bg-orange-500/10"
                : "border-zinc-700 text-zinc-500 hover:text-zinc-300"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* POV viewport — true 4:3, never stretched */}
      <div className="relative w-full overflow-hidden rounded-lg border border-zinc-700 shadow-inner shadow-black/60">
        <div className="relative" style={{ paddingBottom: "75%" }}>
          <Scene id={scene} />
          {/* vignette + slight CRT tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)" }}
          />
          {/* crosshair — dead center of the 4:3 box */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
            width="120"
            height="120"
            viewBox="-60 -60 120 120"
          >
            <g stroke={rgb} strokeWidth={thickness} opacity={opacity}>
              <line x1={0} y1={-gap} x2={0} y2={-gap - len} />
              <line x1={0} y1={gap} x2={0} y2={gap + len} />
              <line x1={-gap} y1={0} x2={-gap - len} y2={0} />
              <line x1={gap} y1={0} x2={gap + len} y2={0} />
            </g>
          </svg>
          {/* weapon hands hint (bottom right corner vibe) */}
          <div className="absolute bottom-2 right-3 text-[9px] font-mono text-white/40 select-none">
            ak47 · 30/90
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-zinc-600">
        <span>crosshair: {size}{dynamic ? " · dynamic" : ""}</span>
        <span style={{ color: rgb }}>■ your color</span>
      </div>
    </div>
  );
}
