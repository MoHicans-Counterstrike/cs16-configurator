import { legends } from "../data/legends";
import { cn } from "../utils/cn";

export default function LegendsRow({ onLoad }: { onLoad: (id: string) => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Golden Era Legends:</span>
        <div className="flex gap-3 flex-wrap">
          {legends.map((l) => (
            <button
              key={l.id}
              onClick={() => onLoad(l.id)}
              title={l.claim}
              className={cn(
                "group relative px-4 py-2.5 rounded-lg border transition-all text-left min-w-[140px]",
                "bg-gradient-to-br to-transparent hover:scale-[1.03] active:scale-95",
                l.accent,
                "border-zinc-700/60 hover:border-orange-500/60"
              )}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">{l.icon}</span>
                <span className="font-bold text-sm text-amber-100 group-hover:text-orange-300">{l.name}</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">{l.team}</div>
              <div className="text-[10px] font-mono text-orange-400/80 mt-1">
                eDPI {l.edpi} · {l.era.split("–")[0]}
              </div>
              {/* hover card */}
              <div className="absolute left-0 top-full mt-2 z-30 hidden group-hover:block w-72 p-3 rounded-lg bg-zinc-950 border border-orange-500/40 shadow-2xl shadow-black">
                <div className="text-xs font-semibold text-amber-100 mb-1">
                  {l.realName} · {l.role}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{l.claim}</p>
                <div className="mt-2 pt-2 border-t border-zinc-800 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-mono text-zinc-500">
                  <span>sens {l.overrides.sensitivity}</span>
                  <span>eDPI {l.edpi}</span>
                  <span>{String(l.overrides.resolution)}</span>
                  <span>fps {String(l.overrides.fps_max)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-zinc-500 italic">
        Load a legend's documented config, then tweak it into your own. Hover for the story.
      </p>
    </div>
  );
}
