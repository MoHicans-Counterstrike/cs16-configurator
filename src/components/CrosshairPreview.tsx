import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";

// Hand-drawn GoldSrc-style map scenes (SVG) — no external assets, no hotlinking.
const SCENES: Record<string, { name: string; sky: string; ground: string; wall: string; accent: string }> = {
  dust2: {
    name: "dust2 · long",
    sky: "#c9b98a",
    ground: "#8f7d55",
    wall: "#b3a06e",
    accent: "#6e5e3a",
  },
  inferno: {
    name: "inferno · banana",
    sky: "#9fb3c8",
    ground: "#5a5147",
    wall: "#7a6a58",
    accent: "#8a4432",
  },
  nuke: {
    name: "nuke · yard",
    sky: "#aebfc7",
    ground: "#666d70",
    wall: "#8b9296",
    accent: "#4a5559",
  },
  train: {
    name: "train · connector",
    sky: "#b8c4cc",
    ground: "#6a6258",
    wall: "#93705c",
    accent: "#5c4638",
  },
};

function SceneBackdrop({ scene }: { scene: string }) {
  const s = SCENES[scene] ?? SCENES.dust2;
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      {/* sky */}
      <rect x="0" y="0" width="400" height="140" fill={s.sky} />
      {/* distant buildings / crates */}
      <rect x="30" y="95" width="70" height="60" fill={s.accent} opacity="0.75" />
      <rect x="115" y="110" width="50" height="45" fill={s.accent} opacity="0.6" />
      <rect x="290" y="90" width="80" height="65" fill={s.accent} opacity="0.7" />
      {/* main wall */}
      <rect x="0" y="140" width="400" height="90" fill={s.wall} />
      <rect x="0" y="140" width="400" height="6" fill="#00000022" />
      {/* doorway */}
      <rect x="160" y="150" width="85" height="80" fill={s.ground} />
      <rect x="160" y="150" width="85" height="80" fill="none" stroke="#00000033" strokeWidth="3" />
      {/* ground */}
      <rect x="0" y="230" width="400" height="70" fill={s.ground} />
      <rect x="0" y="230" width="400" height="4" fill="#00000033" />
      {/* crate on right */}
      <g>
        <rect x="320" y="185" width="55" height="48" fill={s.accent} />
        <rect x="320" y="185" width="55" height="10" fill="#ffffff14" />
        <line x1="347" y1="185" x2="347" y2="233" stroke="#00000022" strokeWidth="2" />
      </g>
      {/* grain */}
      <rect x="0" y="0" width="400" height="300" fill="url(#grain)" opacity="0.15" />
      <defs>
        <pattern id="grain" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="transparent" />
          <circle cx="1" cy="1" r="0.4" fill="#00000030" />
          <circle cx="3" cy="3" r="0.4" fill="#ffffff18" />
        </pattern>
      </defs>
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
  const [scene, setScene] = useState<string>("dust2");
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
        {Object.entries(SCENES).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setScene(key)}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-mono border transition-colors",
              scene === key
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
          <SceneBackdrop scene={scene} />
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
