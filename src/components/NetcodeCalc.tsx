import { useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 netcode calculator — rate / cl_updaterate / ex_interp
// Formula: ex_interp = 1 / cl_updaterate (when ex_interp 0 = auto)
export default function NetcodeCalc() {
  const [rate, setRate] = useState(100000);
  const [cmdrate, setCmdrate] = useState(101);
  const [updaterate, setUpdaterate] = useState(101);
  const [customInterp, setCustomInterp] = useState(0);

  const autoInterp = updaterate > 0 ? (1 / updaterate).toFixed(4) : "0";
  const interp = customInterp || parseFloat(autoInterp);
  const bandwidth = rate / 1024;

  const presets = [
    { name: "LAN (100-tick)", rate: 100000, cmd: 101, up: 101 },
    { name: "DSL (good)", rate: 25000, cmd: 101, up: 101 },
    { name: "DSL (ok)", rate: 20000, cmd: 80, up: 80 },
    { name: "Modem (slow)", rate: 8000, cmd: 50, up: 50 },
    { name: "Potato", rate: 5000, cmd: 30, up: 30 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">Netcode Calculator</p>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-mono text-zinc-500 block mb-1">rate (bytes/sec)</label>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>5k</span>
              <span className="text-orange-300">{rate.toLocaleString()} ({bandwidth.toFixed(1)} KB/s)</span>
              <span>100k</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-500 block mb-1">cl_cmdrate (packets/sec to server)</label>
            <input
              type="range"
              min="30"
              max="101"
              step="1"
              value={cmdrate}
              onChange={(e) => setCmdrate(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>30</span>
              <span className="text-orange-300">{cmdrate}</span>
              <span>101</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-500 block mb-1">cl_updaterate (packets/sec from server)</label>
            <input
              type="range"
              min="30"
              max="101"
              step="1"
              value={updaterate}
              onChange={(e) => setUpdaterate(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>30</span>
              <span className="text-orange-300">{updaterate}</span>
              <span>101</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-500 block mb-1">ex_interp (0 = auto)</label>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.001"
              value={customInterp}
              onChange={(e) => setCustomInterp(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>0 (auto)</span>
              <span className="text-orange-300">{customInterp.toFixed(3)}</span>
              <span>0.1</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <p className="text-[10px] font-mono text-zinc-500 mb-1">Presets</p>
          <div className="flex gap-1.5 flex-wrap">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => { setRate(p.rate); setCmdrate(p.cmd); setUpdaterate(p.up); setCustomInterp(0); }}
                className="px-2 py-1 rounded border border-zinc-700 hover:border-orange-500/50 text-[10px] font-mono text-zinc-400 hover:text-orange-300 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">Result</p>
        <div className="space-y-2 text-[11px] font-mono">
          <div className="flex justify-between">
            <span className="text-zinc-500">ex_interp (auto)</span>
            <span className="text-emerald-400">{autoInterp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">interpolation</span>
            <span className="text-orange-300">{(interp * 1000).toFixed(1)}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">bandwidth</span>
            <span className="text-sky-400">{bandwidth.toFixed(1)} KB/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">update interval</span>
            <span className="text-amber-300">{(1000 / updaterate).toFixed(1)}ms</span>
          </div>
        </div>
        <div className="mt-4 p-3 rounded bg-zinc-900/60 border border-zinc-800">
          <p className="text-[10px] font-mono text-zinc-500 mb-1">Copy to autoexec.cfg:</p>
          <code className="text-[10px] font-mono text-emerald-300 block whitespace-pre-wrap">
{`rate "${rate}"
cl_cmdrate "${cmdrate}"
cl_updaterate "${updaterate}"
ex_interp "0"`}
          </code>
        </div>
        <div className="mt-3 text-[10px] font-mono text-zinc-600 leading-relaxed">
          <p className="text-orange-400 mb-1">Pro tip:</p>
          Set ex_interp to 0 — the game auto-calculates it as 1/cl_updaterate.
          For 101 updaterate that's 0.0099s (≈10ms). Never set it lower than
          1/updaterate or players will "skip" around.
        </div>
      </div>
    </div>
  );
}
