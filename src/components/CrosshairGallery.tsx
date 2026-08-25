import { useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 Crosshair Gallery — live preview like start page
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
  const [liveColor, setLiveColor] = useState("50 250 50");
  const [liveSize, setLiveSize] = useState("small");
  const [liveTranslucent, setLiveTranslucent] = useState(0);
  const [liveDynamic, setLiveDynamic] = useState(0);
  const crosshair = CROSSHAIRS.find((c) => c.id === selected);

  const [r, g, b] = liveColor.split(" ").map(Number);

  return (
    <div className="grid md:grid-cols-[1fr_1fr] gap-4">
      {/* Live Preview */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-300 mb-3">Live Preview</p>
        <div className="relative aspect-video bg-zinc-950 rounded-lg overflow-hidden mb-4">
          {/* Simulated game view */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-zinc-900/50" />
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Center dot */}
              <div
                className={cn("rounded-full transition-all", liveTranslucent ? "opacity-50" : "opacity-100")}
                style={{
                  width: liveSize === "small" ? 4 : liveSize === "medium" ? 8 : 12,
                  height: liveSize === "small" ? 4 : liveSize === "medium" ? 8 : 12,
                  backgroundColor: `rgb(${r},${g},${b})`,
                }}
              />
              {/* Crosshair lines */}
              {!liveTranslucent && (
                <>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-0.5" style={{ backgroundColor: `rgb(${r},${g},${b})` }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-6" style={{ backgroundColor: `rgb(${r},${g},${b})` }} />
                </>
              )}
              {liveDynamic && (
                <div className="absolute inset-0 border border-dashed border-orange-500/50 rounded-full animate-pulse" style={{ width: 40, height: 40, margin: "auto", top: -16, left: -16 }} />
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase">Color (R G B)</label>
            <input type="text" value={liveColor} onChange={(e) => setLiveColor(e.target.value)} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200" />
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase">Size</label>
            <div className="flex gap-1 mt-1">
              {(["small", "medium", "large"] as const).map((s) => (
                <button key={s} onClick={() => setLiveSize(s)} className={cn("px-3 py-1.5 rounded text-xs font-mono border transition-all", liveSize === s ? "border-orange-500 bg-orange-500/10 text-orange-200" : "border-zinc-700 text-zinc-400")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <label className={cn("px-3 py-1.5 rounded text-xs font-mono border cursor-pointer transition-all", liveTranslucent ? "border-orange-500 bg-orange-500/10 text-orange-200" : "border-zinc-700 text-zinc-400")} onClick={() => setLiveTranslucent(1 - liveTranslucent)}>Translucent</label>
            <label className={cn("px-3 py-1.5 rounded text-xs font-mono border cursor-pointer transition-all", liveDynamic ? "border-orange-500 bg-orange-500/10 text-orange-200" : "border-zinc-700 text-zinc-400")} onClick={() => setLiveDynamic(1 - liveDynamic)}>Dynamic</label>
          </div>
          <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
            <code className="text-[10px] font-mono text-amber-200">
              cl_crosshair_color "{liveColor}"; cl_crosshair_size {liveSize}; cl_crosshair_translucent {liveTranslucent}; cl_dynamiccrosshair {liveDynamic}
            </code>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-300 mb-3">Gallery</p>
        <div className="grid grid-cols-3 gap-2">
          {CROSSHAIRS.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelected(c.id); setLiveColor(c.color); setLiveSize(c.size); setLiveTranslucent(c.translucent); setLiveDynamic(c.dynamic); }}
              className={cn(
                "aspect-square rounded border flex items-center justify-center transition-all relative",
                selected === c.id ? "border-orange-500 bg-orange-500/10" : "border-zinc-700 hover:border-zinc-500"
              )}
            >
              <CrosshairPreview color={c.color} size={c.size} translucent={c.translucent} dynamic={c.dynamic} />
              <span className="absolute bottom-0.5 left-0.5 right-0.5 text-[8px] font-mono text-zinc-400 truncate text-center">{c.name}</span>
            </button>
          ))}
        </div>
        {crosshair && (
          <div className="mt-3 p-2 rounded bg-zinc-950 border border-zinc-800">
            <p className="text-[10px] font-mono text-orange-400 mb-1">{crosshair.name}</p>
            <code className="text-[9px] font-mono text-amber-200">
              cl_crosshair_color "{crosshair.color}"; cl_crosshair_size {crosshair.size}; cl_crosshair_translucent {crosshair.translucent}; cl_dynamiccrosshair {crosshair.dynamic}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}

function CrosshairPreview({ color, size, translucent, dynamic }: { color: string; size: string; translucent: number; dynamic: number }) {
  const [r, g, b] = color.split(" ").map(Number);
  const dotSize = size === "small" ? 3 : size === "medium" ? 5 : 7;
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: `rgb(${r},${g},${b})`, opacity: translucent ? 0.5 : 1 }} />
      {!translucent && (
        <>
          <div className="absolute w-4 h-0.5" style={{ backgroundColor: `rgb(${r},${g},${b})` }} />
          <div className="absolute w-0.5 h-4" style={{ backgroundColor: `rgb(${r},${g},${b})` }} />
        </>
      )}
      {dynamic && <div className="absolute inset-0 border border-dashed border-orange-500/50 rounded-full" />}
    </div>
  );
}
