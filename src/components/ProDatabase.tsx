import { useState } from "react";
import { cn } from "../utils/cn";
import { legends } from "../data/legends";

// Pro Database — sorted by clan like the start page
const CLANS = [
  { name: "SK Gaming", ids: ["heaton", "spawn", "walle", "fisker", "ahl"] },
  { name: "fnatic / NiP", ids: ["f0rest", "getright", "gux", "dsn", "carn", "friberg", "xizt"] },
  { name: "Natus Vincere", ids: ["markeloff", "edward", "zeus", "starix"] },
  { name: "Team 3D / compLexity (NA)", ids: ["ksharp", "rambo", "volcano"] },
  { name: "mTw / Nordic", ids: ["solo"] },
  { name: "Pre-1.6 era", ids: ["pottt", "medion", "elemeNt"] },
  { name: "International", ids: ["cyx", "roman"] },
];

export default function ProDatabase() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const player = legends.find((l) => l.id === selected);

  const filteredClans = CLANS.map((clan) => ({
    ...clan,
    players: clan.ids
      .map((id) => legends.find((l) => l.id === id))
      .filter((l) => {
        if (!l) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return l.name.toLowerCase().includes(q) || l.team.toLowerCase().includes(q);
      }),
  })).filter((clan) => clan.players.length > 0);

  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredClans.map((clan) => (
            <div key={clan.name}>
              <p className="text-[10px] font-mono text-orange-400 uppercase tracking-wider mb-1">{clan.name}</p>
              <div className="space-y-0.5">
                {clan.players.map((p) => p && (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded border transition-all flex items-center gap-2",
                      selected === p.id
                        ? "border-orange-500 bg-orange-500/10 text-orange-200"
                        : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
                    )}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{p.team}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        {player ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-xl shadow-[0_0_25px_rgba(251,146,60,0.3)]">
                {player.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-amber-100">{player.name}</h3>
                <p className="text-xs text-zinc-400">{player.realName}</p>
                <p className="text-[10px] text-zinc-500">{player.team} · {player.era} · {player.role}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-orange-300">{player.edpi}</div>
                <div className="text-[9px] font-mono text-zinc-500 uppercase">eDPI</div>
              </div>
            </div>
            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">{player.claim}</p>
            <div className="space-y-1.5">
              {Object.entries(player.overrides).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between px-3 py-2 rounded bg-zinc-950 border border-zinc-800">
                  <code className="text-xs font-mono text-orange-300">{key}</code>
                  <code className="text-xs font-mono text-amber-200">{String(val)}</code>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🎮</div>
            <p className="text-xs font-mono text-zinc-400">Select a pro to view their full settings</p>
          </div>
        )}
      </div>
    </div>
  );
}
