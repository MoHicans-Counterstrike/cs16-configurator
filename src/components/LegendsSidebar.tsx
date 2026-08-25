import { legends, legendGroups } from "../data/legends";
import { cn } from "../utils/cn";
import ProAvatar from "./ProAvatar";

// Clan-grouped legend grid with generated pixel avatars.
// No inner scrollbars — the sidebar grows naturally, page scrolls.
export default function LegendsSidebar({ onLoad }: { onLoad: (id: string) => void }) {
  return (
    <div className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
      <div className="px-3 py-2.5 border-b border-zinc-800 bg-zinc-900/80">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Golden Era Legends</p>
        <p className="text-[10px] text-zinc-500 mt-0.5">{legends.length} pros · by clan</p>
      </div>
      <div className="p-2">
        {legendGroups.map((group) => {
          const members = group.ids.map((id) => legends.find((l) => l.id === id)).filter(Boolean);
          if (!members.length) return null;
          return (
            <div key={group.clan} className="mb-1.5 last:mb-0">
              {/* clan header row */}
              <button
                onClick={() => {
                  // load first member as quick action
                  const first = members[0]!;
                  onLoad(first.id);
                }}
                title={`Load ${first(members).name}`}
                className="w-full px-2 pt-2 pb-1 flex items-center gap-1.5 text-left"
              >
                <span
                  className="w-2 h-2 rounded-sm"
                  style={{ backgroundColor: clanColor(group.clan) }}
                />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 group-hover:text-orange-300">
                  {group.clan}
                </span>
                <span className="ml-auto text-[9px] font-mono text-zinc-600">{members.length}</span>
              </button>

              {/* member avatars grid */}
              <div className="flex gap-1.5 px-2 pb-2 flex-wrap">
                {members.map((l) => (
                  <div key={l!.id} className="relative group/legend">
                    <button
                      onClick={() => onLoad(l!.id)}
                      className={cn(
                        "block rounded-md transition-transform hover:scale-110 active:scale-95",
                        "ring-0 hover:ring-2 ring-orange-500/60"
                      )}
                      aria-label={`${l!.name} — load config`}
                    >
                      <ProAvatar name={l!.name} clan={clanKey(group.clan)} size={40} />
                      <div className="mt-0.5 text-center text-[8px] font-mono text-zinc-500 leading-none">
                        {l!.name}
                      </div>
                    </button>

                    {/* story popover */}
                    <div
                      className={cn(
                        "hidden group-hover/legend:block absolute left-full top-0 ml-1 z-50 w-72 p-3",
                        "rounded-lg bg-zinc-950 border border-orange-500/40 shadow-2xl shadow-black pointer-events-none"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <ProAvatar name={l!.name} clan={clanKey(group.clan)} size={32} />
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-amber-100 truncate">{l!.name}</div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            {l!.realName} · {l!.era}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-orange-400 mb-1">
                        {l!.role} · {group.clan}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{l!.claim}</p>
                      <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] font-mono text-zinc-500">
                        <span>sens {String(l!.overrides.sensitivity)}</span>
                        <span>eDPI {l!.edpi}</span>
                        <span>{String(l!.overrides.resolution)}</span>
                        <span>fps {String(l!.overrides.fps_max)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function first<T>(arr: T[]): T {
  return arr[0];
}

function clanKey(clan: string): string {
  if (clan.includes("SK")) return "SK Gaming";
  if (clan.includes("fnatic")) return "fnatic";
  if (clan.includes("Virtus")) return "Virtus.pro";
  if (clan.includes("Natus")) return "Natus Vincere";
  return clan;
}

function clanColor(clan: string): string {
  switch (clanKey(clan)) {
    case "SK Gaming": return "#f59e0b";
    case "fnatic": return "#f97316";
    case "NiP": return "#eab308";
    case "Virtus.pro": return "#ef4444";
    case "Natus Vincere": return "#facc15";
    default: return "#fb923c";
  }
}
