import { useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 Crosshair Gallery — gallery of crosshair codes/styles to try
const CROSSHAIRS = [
  { id: "classic_green", name: "Classic Green", color: "50 250 50", size: "small", translucent: 0, dynamic: 0 },
  { id: "classic_cyan", name: "Classic Cyan", color: "0 255 255", size: "small", translucent: 0, dynamic: 0 },
  { id: "classic_red", name: "Classic Red", color: "255 50 50", size: "small", translucent: 0, dynamic: 0 },
  { id: "classic_white", name: "Classic White", color: "255 255 255", size: "small", translucent: 0, dynamic: 0 },
  { id: "small_green", name: "Small Green", color: "50 250 50", size: "small", translucent: 0, dynamic: 0 },
  { id: "medium_green", name: "Medium Green", color: "50 250 50", size: "medium", translucent: 0, dynamic: 0 },
  { id: "large_green", name: "Large Green", color: "50 250 50", size: "large", translucent: 0, dynamic: 0 },
  { id: "dot_crosshair", name: "Dot", color: "50 250 50", size: "large", translucent: 1, dynamic: 0 },
  { id: "dynamic_green", name: "Dynamic Green", color: "50 250 50", size: "small", translucent: 0, dynamic: 1 },
  { id: "dynamic_cyan", name: "Dynamic Cyan", color: "0 255 255", size: "small", translucent: 0, dynamic: 1 },
  { id: "dynamic_white", name: "Dynamic White", color: "255 255 255", size: "small", translucent: 0, dynamic: 1 },
  { id: "translucent_green", name: "Translucent Green", color: "50 250 50", size: "small", translucent: 1, dynamic: 0 },
];

export default function CrosshairGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const crosshair = CROSSHAIRS.find((c) => c.id === selected);

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-300 mb-3">Click a crosshair to preview:</p>
        <div className="grid grid-cols-3 gap-2">
          {CROSSHAIRS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={cn(
                "aspect-square rounded border flex items-center justify-center transition-all",
                selected === c.id
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-700 hover:border-zinc-500"
              )}
            >
              <CrosshairDot color={c.color} size={c.size} translucent={c.translucent} dynamic={c.dynamic} />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        {crosshair ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <CrosshairDot color={crosshair.color} size={crosshair.size} translucent={crosshair.translucent} dynamic={crosshair.dynamic} large />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-100">{crosshair.name}</h3>
                <p className="text-xs text-zinc-400">
                  {crosshair.dynamic ? "Dynamic" : "Static"} · {crosshair.translucent ? "Translucent" : "Opaque"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(crosshair).filter(([k]) => k !== "id" && k !== "name").map(([key, val]) => (
                <div key={key} className="flex items-center justify-between px-3 py-2 rounded bg-zinc-950 border border-zinc-800">
                  <code className="text-xs font-mono text-orange-300">{key}</code>
                  <code className="text-xs font-mono text-amber-200">{String(val)}</code>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-xs font-mono text-zinc-400">Select a crosshair to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CrosshairDot({ color, size, translucent, dynamic, large }: { color: string; size: string; translucent: number; dynamic: number; large?: boolean }) {
  const dotSize = large ? "w-3 h-3" : size === "small" ? "w-1.5 h-1.5" : size === "medium" ? "w-2.5 h-2.5" : "w-3.5 h-3.5";
  const [r, g, b] = color.split(" ").map(Number);
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div className={cn("rounded-full", dotSize)} style={{ backgroundColor: `rgb(${r},${g},${b})`, opacity: translucent ? 0.5 : 1 }} />
      {dynamic && <div className="absolute inset-0 border border-dashed border-orange-500/50 rounded-full animate-pulse" />}
    </div>
  );
}
