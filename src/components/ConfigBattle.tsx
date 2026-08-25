import { useState } from "react";
import { cn } from "../utils/cn";

// Config Battle — compare two configs side by side
const SAMPLE_CONFIGS = [
  { name: "Classic Pro (2005)", settings: { sensitivity: 2.0, cl_crosshair_color: "50 250 50", cl_crosshair_size: "small", cl_dynamiccrosshair: 1, fps_max: 100 } },
  { name: "Max FPS Potato", settings: { sensitivity: 2.5, cl_crosshair_color: "50 250 50", crosshair_size: "large", cl_dynamiccrosshair: 0, fps_max: 121 } },
  { name: "Modern 100-Tick", settings: { sensitivity: 1.8, cl_crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 0, fps_max: 99 } },
];

export default function ConfigBattle() {
  const [configA, setConfigA] = useState(0);
  const [configB, setConfigB] = useState(1);

  const a = SAMPLE_CONFIGS[configA];
  const b = SAMPLE_CONFIGS[configB];

  const allKeys = Array.from(new Set([...Object.keys(a.settings), ...Object.keys(b.settings)]));

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
          <label className="text-xs font-mono text-zinc-300 block mb-2">Config A</label>
          <select value={configA} onChange={(e) => setConfigA(Number(e.target.value))} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200">
            {SAMPLE_CONFIGS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
          </select>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
          <label className="text-xs font-mono text-zinc-300 block mb-2">Config B</label>
          <select value={configB} onChange={(e) => setConfigB(Number(e.target.value))} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200">
            {SAMPLE_CONFIGS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_1fr] gap-px bg-zinc-800">
          <div className="bg-zinc-900 px-4 py-2 text-xs font-mono text-orange-300">{a.name}</div>
          <div className="bg-zinc-900 px-2 py-2 text-[10px] font-mono text-zinc-500 text-center">diff</div>
          <div className="bg-zinc-900 px-4 py-2 text-xs font-mono text-orange-300">{b.name}</div>
        </div>
        {allKeys.map((key) => {
          const valA = a.settings[key as keyof typeof a.settings];
          const valB = b.settings[key as keyof typeof b.settings];
          const isDiff = valA !== valB;
          return (
            <div key={key} className="grid grid-cols-[1fr_80px_1fr] gap-px bg-zinc-800/50">
              <div className={cn("bg-zinc-900/50 px-4 py-2 text-xs font-mono", isDiff ? "text-emerald-300" : "text-zinc-300")}>
                {valA !== undefined ? String(valA) : <span className="text-zinc-600">—</span>}
              </div>
              <div className="bg-zinc-900/50 px-2 py-2 text-center">
                {isDiff ? <span className="text-emerald-400 text-xs">≠</span> : <span className="text-zinc-600 text-xs">=</span>}
              </div>
              <div className={cn("bg-zinc-900/50 px-4 py-2 text-xs font-mono", isDiff ? "text-red-300" : "text-zinc-300")}>
                {valB !== undefined ? String(valB) : <span className="text-zinc-600">—</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
