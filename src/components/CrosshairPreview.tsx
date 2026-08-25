import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";

// Authentic CS 1.6 screenshots (from the Steam store page, 1024x768 originals
// resized to 640x480). Crosshair is overlaid dead-center — true POV testing.
const MAP_SCENES = [
  { id: "italy", name: "italy", src: "/maps/italy.jpg" },
  { id: "office", name: "office", src: "/maps/office.jpg" },
  { id: "chateau", name: "chateau", src: "/maps/chateau.jpg" },
  { id: "dust", name: "dust", src: "/maps/dust.jpg" },
];

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
  const [scene, setScene] = useState<string>("italy");
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
              "px-2 py-1 rounded text-[10px] font-mono border transition-colors uppercase",
              scene === s.id
                ? "border-orange-500 text-orange-300 bg-orange-500/10"
                : "border-zinc-700 text-zinc-300 hover:text-zinc-300"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* POV viewport — true 4:3, real screenshot.
          All 4 images are preloaded and kept in the DOM (visually hidden
          when not active) so the initial render is instant on first switch. */}
      <div className="relative w-full overflow-hidden rounded-lg border border-zinc-700 shadow-inner shadow-black/60">
        <div className="relative" style={{ paddingBottom: "75%" }}>
          {MAP_SCENES.map((s) => (
            <img
              key={s.id}
              src={s.src}
              alt={`CS 1.6 ${s.name} POV`}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
              style={{ display: scene === s.id ? "block" : "none" }}
            />
          ))}
          {/* subtle vignette so crosshair pops */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.25) 100%)" }}
          />
          {/* crosshair — dead center */}
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
        </div>
      </div>

      <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-zinc-600">
        <span>crosshair: {size}{dynamic ? " · dynamic" : ""}</span>
        <span style={{ color: rgb }}>■ your color</span>
      </div>
    </div>
  );
}
