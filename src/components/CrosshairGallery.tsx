import { useState } from "react";
import { cn } from "../utils/cn";

const CROSSHAIR_PRESETS = [
  { id: "classic_green", name: "Classic Green", color: "50 250 50", size: "small", translucent: 0, dynamic: 0 },
  { id: "classic_cyan", name: "Classic Cyan", color: "0 255 255", size: "small", translucent: 0, dynamic: 0 },
  { id: "classic_red", name: "Classic Red", color: "255 50 50", size: "small", translucent: 0, dynamic: 0 },
  { id: "classic_white", name: "Classic White", color: "255 255 255", size: "small", translucent: 0, dynamic: 0 },
  { id: "small_green", name: "Small Green", color: "50 250 50", size: "small", translucent: 0, dynamic: 0 },
  { id: "medium_green", name: "Medium Green", color: "50 250 50", size: "medium", translucent: 0, dynamic: 0 },
  { id: "large_green", name: "Large Green", color: "50 250 50", size: "large", translucent: 0, dynamic: 0 },
  { id: "auto_green", name: "Auto Size", color: "50 250 50", size: "auto", translucent: 0, dynamic: 0 },
  { id: "dot_green", name: "Dot Only", color: "50 250 50", size: "large", translucent: 2, dynamic: 0 },
  { id: "dynamic_green", name: "Dynamic Green", color: "50 250 50", size: "small", translucent: 0, dynamic: 1 },
  { id: "dynamic_cyan", name: "Dynamic Cyan", color: "0 255 255", size: "small", translucent: 0, dynamic: 1 },
  { id: "dynamic_white", name: "Dynamic White", color: "255 255 255", size: "small", translucent: 0, dynamic: 1 },
  { id: "translucent_green", name: "Translucent", color: "50 250 50", size: "small", translucent: 1, dynamic: 0 },
];

const MAP_SCENES = [
  { id: "italy", name: "italy", src: "/maps/italy.jpg" },
  { id: "office", name: "office", src: "/maps/office.jpg" },
  { id: "chateau", name: "chateau", src: "/maps/chateau.jpg" },
  { id: "dust", name: "dust", src: "/maps/dust.jpg" },
];

export default function CrosshairGallery() {
  const [selected, setSelected] = useState("classic_green");
  const [scene, setScene] = useState("italy");

  const crosshair = CROSSHAIR_PRESETS.find((c) => c.id === selected) || CROSSHAIR_PRESETS[0];
  const [r, g, b] = crosshair.color.split(/\s+/).map(Number);

  const gapBase = { auto: 6, small: 5, medium: 8, large: 12 }[crosshair.size] || 5;
  const len = { auto: 9, small: 7, medium: 11, large: 16 }[crosshair.size] || 7;
  const thickness = crosshair.translucent === 2 ? 1 : 2;
  const opacity = crosshair.translucent === 0 ? 1 : crosshair.translucent === 1 ? 0.65 : 0.4;

  return (
    <div className="space-y-4">
      {/* POV Preview */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-zinc-300">Live POV Preview</p>
          <div className="flex gap-1">
            {MAP_SCENES.map((s) => (
              <button key={s.id} onClick={() => setScene(s.id)} className={cn("px-2 py-1 rounded text-[10px] font-mono border transition-all", scene === s.id ? "border-orange-500 text-orange-300 bg-orange-500/10" : "border-zinc-700 text-zinc-400")}>{s.name}</button>
            ))}
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-lg border border-zinc-700 shadow-inner shadow-black/60">
          <div className="relative" style={{ paddingBottom: "75%" }}>
            {MAP_SCENES.map((s) => (
              <img key={s.id} src={s.src} alt={s.name} className="absolute inset-0 w-full h-full object-cover" style={{ display: scene === s.id ? "block" : "none" }} />
            ))}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.25) 100%)" }} />
            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible" width="120" height="120" viewBox="-60 -60 120 120">
              <g stroke={`rgb(${r},${g},${b})`} strokeWidth={thickness} opacity={opacity}>
                <line x1={0} y1={-gapBase} x2={0} y2={-gapBase - len} />
                <line x1={0} y1={gapBase} x2={0} y2={gapBase + len} />
                <line x1={-gapBase} y1={0} x2={-gapBase - len} y2={0} />
                <line x1={gapBase} y1={0} x2={gapBase + len} y2={0} />
              </g>
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-zinc-500">
          <span>{crosshair.name} · {crosshair.size}{crosshair.dynamic ? " · dynamic" : ""}</span>
          <span style={{ color: `rgb(${r},${g},${b})` }}>■</span>
        </div>
      </div>

      {/* Config Output */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-300 mb-2">Console Commands</p>
        <div className="space-y-1">
          {[
            `cl_crosshair_color "${crosshair.color}"`,
            `cl_crosshair_size ${crosshair.size}`,
            `cl_crosshair_translucent ${crosshair.translucent}`,
            `cl_dynamiccrosshair ${crosshair.dynamic}`,
          ].map((cmd) => (
            <div key={cmd} className="flex items-center justify-between px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800">
              <code className="text-[11px] font-mono text-orange-300">{cmd}</code>
              <button onClick={() => navigator.clipboard.writeText(cmd)} className="text-[10px] font-mono text-zinc-500 hover:text-orange-300">copy</button>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-300 mb-3">Presets</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {CROSSHAIR_PRESETS.map((c) => {
            const [cr, cg, cb] = c.color.split(/\s+/).map(Number);
            const gap = { auto: 5, small: 4, medium: 7, large: 11 }[c.size];
            const lineLen = { auto: 9, small: 7, medium: 11, large: 16 }[c.size];
            return (
              <button key={c.id} onClick={() => setSelected(c.id)} className={cn("aspect-square rounded border flex flex-col items-center justify-center transition-all p-1", selected === c.id ? "border-orange-500 bg-orange-500/10" : "border-zinc-700 hover:border-zinc-500")}>
                <svg width="32" height="32" viewBox="-16 -16 32 32" className="mb-1">
                  <g stroke={`rgb(${cr},${cg},${cb})`} strokeWidth={c.translucent === 2 ? 1 : 2} opacity={c.translucent === 0 ? 1 : c.translucent === 1 ? 0.65 : 0.4}>
                    {c.translucent !== 2 && (
                      <>
                        <line x1={0} y1={-gap} x2={0} y2={-gap - lineLen} />
                        <line x1={0} y1={gap} x2={0} y2={gap + lineLen} />
                        <line x1={-gap} y1={0} x2={-gap - lineLen} y2={0} />
                        <line x1={gap} y1={0} x2={gap + lineLen} y2={0} />
                      </>
                    )}
                    {c.translucent === 2 && <circle cx={0} cy={0} r={2} fill={`rgb(${cr},${cg},${cb})`} />}
                  </g>
                </svg>
                <span className="text-[8px] font-mono text-zinc-400 truncate w-full text-center">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
