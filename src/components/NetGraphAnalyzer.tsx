import { useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 Net Graph Analyzer — explains net_graph values
const NET_GRAPH_LEVELS = [
  { level: 1, name: "Basic", description: "Shows FPS, ping, and packet loss" },
  { level: 2, name: "Detailed", description: "Adds latency graph and server info" },
  { level: 3, name: "Full", description: "Shows everything + graph legend" },
];

const NET_GRAPH_FIELDS = [
  { field: "fps", description: "Current frames per second", color: "emerald", level: 1 },
  { field: "ping", description: "Round-trip latency to server in ms", color: "blue", level: 1 },
  { field: "loss", description: "Packet loss percentage", color: "red", level: 1 },
  { field: "choke", description: "Packet choke percentage", color: "orange", level: 1 },
  { field: "tick", description: "Server tick rate", color: "amber", level: 2 },
  { field: "in/out", description: "Incoming/outgoing data rate", color: "cyan", level: 2 },
  { field: "sv", description: "Server frame time", color: "violet", level: 2 },
  { field: "var", description: "Server variance", color: "pink", level: 2 },
  { field: "interp", description: "Interpolation amount", color: "yellow", level: 3 },
  { field: "vgraph", description: "Velocity graph", color: "sky", level: 3 },
  { field: "graph", description: "Network graph", color: "teal", level: 3 },
];

export default function NetGraphAnalyzer() {
  const [level, setLevel] = useState(1);
  const [showGraph, setShowGraph] = useState(false);

  const visibleFields = NET_GRAPH_FIELDS.filter((f) => f.level <= level);

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="text-sm font-bold text-amber-100">net_graph {level}</h3>
            <p className="text-xs text-zinc-400">Choose your graph level to see what it shows</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {NET_GRAPH_LEVELS.map((l) => (
            <button
              key={l.level}
              onClick={() => setLevel(l.level)}
              className={cn(
                "px-4 py-2 rounded text-xs font-mono border transition-all",
                level === l.level
                  ? "border-orange-500 bg-orange-500/10 text-orange-200"
                  : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {l.level} — {l.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-mono text-zinc-300 mb-2">Visible fields at level {level}:</p>
            <div className="space-y-1">
              {visibleFields.map((f) => (
                <div key={f.field} className="flex items-center gap-2 px-3 py-2 rounded bg-zinc-950 border border-zinc-800">
                  <span className={cn("text-xs font-mono font-bold", f.color === "emerald" && "text-emerald-400", f.color === "blue" && "text-blue-400", f.color === "red" && "text-red-400", f.color === "orange" && "text-orange-400", f.color === "amber" && "text-amber-400", f.color === "cyan" && "text-cyan-400", f.color === "violet" && "text-violet-400", f.color === "pink" && "text-pink-400", f.color === "yellow" && "text-yellow-400", f.color === "sky" && "text-sky-400", f.color === "teal" && "text-teal-400")}>
                    {f.field}
                  </span>
                  <span className="text-[10px] text-zinc-400 flex-1">{f.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4">
            <p className="text-xs font-mono text-zinc-300 mb-2">Example net_graph {level} output:</p>
            <pre className="text-xs font-mono text-amber-200 leading-relaxed">
              {`┌─────────────────────────────┐
│ fps: ${level >= 1 ? "120" : "---"}  ping: ${level >= 1 ? "25" : "---"}ms      │
│ loss: ${level >= 1 ? "0%" : "---"}  choke: ${level >= 1 ? "0%" : "---"}     │
${level >= 2 ? `│ tick: 101  sv: 0.5       │\n│ in: 12.3  out: 8.7       │\n` : ""}${level >= 3 ? `│ interp: 0.01  var: 0.2   │\n│ [vgraph] [graph]         │\n` : ""}└─────────────────────────────┘`}
            </pre>
            <p className="text-[10px] font-mono text-zinc-500 mt-2">
              Place at bottom-right of screen. Use net_graph 0 to hide.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-400">
          <span className="text-orange-400">Pro tip:</span> Use net_graph 3 during matches to monitor choke and loss.
          If choke &gt; 5%, your connection can't keep up — lower rate or switch servers.
          If loss &gt; 2%, packets are being dropped — check your internet connection.
        </p>
      </div>
    </div>
  );
}
