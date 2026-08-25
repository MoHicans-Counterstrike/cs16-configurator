import { useState } from "react";
import { cn } from "../utils/cn";

// Pro Config Library — legendary CS 1.6 players with their known settings
const PRO_PLAYERS = [
  { id: "ksharp", name: "Kyle 'Ksharp' Miller", team: "Team 3D", era: "2001–2007", role: "AWPer / Entry", settings: { sensitivity: 2.0, crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 1 } },
  { id: "heaton", name: "Ronny 'HeaTeN' T", team: "Ninjas in Pyjamas", era: "2001–2005", role: "Rifler", settings: { sensitivity: 2.5, crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 0 } },
  { id: "potti", name: "Tommy 'Potti' L", team: "SK Gaming", era: "2002–2006", role: "AWPer / Captain", settings: { sensitivity: 1.8, crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 0 } },
  { id: "savage", name: "Savage", team: "Various", era: "2002–2006", role: "Rifler", settings: { sensitivity: 2.2, crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 1 } },
  { id: "element", name: "ElemeNt", team: "SK Gaming", era: "2003–2005", role: "Entry Fragger", settings: { sensitivity: 2.4, crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 0 } },
  { id: "volcano", name: "Volcano", team: "Team 3D", era: "2002–2005", role: "Rifler", settings: { sensitivity: 2.1, crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 1 } },
  { id: "medieon", name: "MedieN", team: "mTw", era: "2004–2007", role: "Support", settings: { sensitivity: 2.3, crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 0 } },
  { id: "rambo", name: "Rambo", team: "Team 3D", era: "2002–2006", role: "Entry Fragger", settings: { sensitivity: 2.0, crosshair_color: "50 250 50", crosshair_size: "small", cl_dynamiccrosshair: 1 } },
];

export default function ProConfigs() {
  const [selected, setSelected] = useState<string | null>(null);
  const player = PRO_PLAYERS.find((p) => p.id === selected);

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-300 mb-3">Select a pro to load their settings:</p>
        <div className="space-y-1">
          {PRO_PLAYERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded border transition-all",
                selected === p.id
                  ? "border-orange-500 bg-orange-500/10 text-orange-200"
                  : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
              )}
            >
              <div className="text-xs font-mono font-bold">{p.name}</div>
              <div className="text-[10px] text-zinc-400">{p.team} · {p.era}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        {player ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-lg">
                {player.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-100">{player.name}</h3>
                <p className="text-xs text-zinc-400">{player.team} · {player.era} · {player.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(player.settings).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between px-3 py-2 rounded bg-zinc-950 border border-zinc-800">
                  <code className="text-xs font-mono text-orange-300">{key}</code>
                  <code className="text-xs font-mono text-amber-200">{String(val)}</code>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] font-mono text-zinc-400">
              These are approximate settings based on community research. Exact configs may vary.
            </p>
          </>
        ) : (
          <p className="text-xs font-mono text-zinc-400 italic">Select a pro player to view their settings</p>
        )}
      </div>
    </div>
  );
}
