import { useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 Launch Options Generator
const LAUNCH_OPTIONS = [
  { id: "console", flag: "-console", desc: "Enable developer console", recommended: true },
  { id: "freq", flag: "-freq 144", desc: "Set monitor refresh rate (Hz)", recommended: true },
  { id: "novid", flag: "-novid", desc: "Skip intro video", recommended: false },
  { id: "nojoy", flag: "-nojoy", desc: "Disable joystick support", recommended: true },
  { id: "noipx", flag: "-noipx", desc: "Disable obsolete IPX protocol", recommended: true },
  { id: "noforcemparms", flag: "-noforcemparms", desc: "Prevent CS from overriding mouse settings", recommended: true },
  { id: "noforcemaccel", flag: "-noforcemaccel", desc: "Disable forced mouse acceleration", recommended: true },
  { id: "noforcemspd", flag: "-noforcemspd", desc: "Disable forced mouse speed", recommended: true },
  { id: "heapsize", flag: "-heapsize 262144", desc: "OLD: memory flag (useless in CS 1.6)", recommended: false, myth: true },
  { id: "high", flag: "-high", desc: "OLD: high CPU priority (doesn't exist in GoldSrc)", recommended: false, myth: true },
  { id: "32bit", flag: "-32bit", desc: "Force 32-bit color (already default)", recommended: false, myth: true },
  { id: "gl", flag: "-gl", desc: "Force OpenGL renderer (already default)", recommended: false, myth: true },
];

export default function LaunchOptions() {
  const [selected, setSelected] = useState<string[]>(["console", "freq", "nojoy", "noipx", "noforcemparms", "noforcemaccel", "noforcemspd"]);
  const [freq, setFreq] = useState("144");
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const generateLaunchOptions = () => {
    const flags: string[] = [];
    for (const id of selected) {
      const opt = LAUNCH_OPTIONS.find((o) => o.id === id);
      if (!opt) continue;
      if (id === "freq") flags.push(`-freq ${freq}`);
      else flags.push(opt.flag);
    }
    return flags.join(" ");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateLaunchOptions());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid md:grid-cols-[1fr_280px] gap-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-300 mb-3">
          Select launch options for Steam → Properties → Launch Options. 
          <span className="text-orange-400"> Orange</span> = recommended, 
          <span className="text-red-400"> red</span> = myth (doesn't work).
        </p>
        <div className="space-y-1.5">
          {LAUNCH_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded border cursor-pointer transition-all",
                selected.includes(opt.id)
                  ? opt.myth
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-orange-500/40 bg-orange-500/10"
                  : "border-zinc-800 hover:border-zinc-600"
              )}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={() => toggle(opt.id)}
                className="accent-orange-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className={cn("text-xs font-mono", opt.myth ? "text-red-300" : "text-orange-300")}>
                    {opt.id === "freq" ? `-freq ${freq}` : opt.flag}
                  </code>
                  {opt.recommended && !opt.myth && (
                    <span className="text-[9px] font-mono text-emerald-400 uppercase">recommended</span>
                  )}
                  {opt.myth && (
                    <span className="text-[9px] font-mono text-red-400 uppercase">myth / useless</span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {selected.includes("freq") && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-300">Refresh rate:</span>
            <select value={freq} onChange={(e) => setFreq(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-zinc-200">
              <option value="60">60 Hz</option>
              <option value="75">75 Hz</option>
              <option value="120">120 Hz</option>
              <option value="144">144 Hz</option>
              <option value="165">165 Hz</option>
              <option value="240">240 Hz</option>
              <option value="360">360 Hz</option>
            </select>
          </div>
        )}
      </div>
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-zinc-300">Generated</p>
          <button
            onClick={handleCopy}
            className={cn(
              "px-3 py-1.5 rounded border text-xs font-mono transition-all",
              copied
                ? "border-emerald-500 text-emerald-300"
                : "border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
            )}
          >
            {copied ? "✓ COPIED" : "COPY"}
          </button>
        </div>
        <div className="bg-zinc-950 rounded p-3 text-xs font-mono text-amber-200 break-all min-h-[60px]">
          {generateLaunchOptions() || <span className="text-zinc-500 italic">Select options...</span>}
        </div>
        <div className="mt-4 p-3 rounded bg-zinc-950 border border-zinc-800">
          <p className="text-[10px] font-mono text-orange-400 uppercase mb-1">How to set</p>
          <ol className="text-[10px] font-mono text-zinc-400 space-y-1 list-decimal list-inside">
            <li>Steam → Library → CS 1.6</li>
            <li>Right-click → Properties</li>
            <li>General → Launch Options</li>
            <li>Paste the generated flags</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
