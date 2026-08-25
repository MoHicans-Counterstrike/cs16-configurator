import { useMemo } from "react";

// Live eDPI (DPI × sensitivity) calculator with pro-average verdict.
export default function EdpiMeter({ sensitivity }: { sensitivity: number }) {
  // No real DPI input from the game — we present a DPI selector and compute.
  const dpi = 800; // could be made stateful; keep simple for now
  const edpi = Math.round(dpi * sensitivity);

  const verdict = useMemo(() => {
    if (edpi < 500) return { label: "Very low — AWP/precision territory", color: "text-sky-400", pct: 15 };
    if (edpi < 750) return { label: "Low — control-focused, AWPer range", color: "text-emerald-400", pct: 32 };
    if (edpi <= 1100) return { label: "Pro average — sweet spot ✓", color: "text-orange-400", pct: 55 };
    if (edpi <= 1600) return { label: "High — fast twitch, harder control", color: "text-amber-400", pct: 78 };
    return { label: "Very high — wrist aim, good luck", color: "text-red-400", pct: 95 };
  }, [edpi]);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-4">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">eDPI Calculator</span>
        <span className="font-mono text-2xl font-black text-amber-300">{edpi}</span>
      </div>
      {/* meter */}
      <div className="relative h-2 rounded-full bg-zinc-800 overflow-hidden mb-2">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500 via-emerald-400 to-red-500 opacity-40"
          style={{ width: "100%" }}
        />
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          style={{ left: `${verdict.pct}%` }}
        />
        {/* pro average zone marker */}
        <div className="absolute top-0 bottom-0 border-x border-orange-500/70 bg-orange-500/10" style={{ left: "45%", width: "20%" }} />
      </div>
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-zinc-600">dpi {dpi} × sens {sensitivity.toFixed(2)}</span>
        <span className={verdict.color}>{verdict.label}</span>
      </div>
      <p className="text-[10px] text-zinc-600 mt-1.5 leading-relaxed">
        Orange zone = where most pros live (eDPI 700–1200). Set your mouse DPI to match — this calc assumes 800 DPI.
      </p>
    </div>
  );
}
