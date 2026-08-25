import { legends } from "../data/legends";
import { cn } from "../utils/cn";

// Compact sidebar version — sits in the left nav column under categories.
// Hover/focus opens the story card to the RIGHT (never clipped by viewport).
export default function LegendsSidebar({ onLoad }: { onLoad: (id: string) => void }) {
  return (
    <div className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Golden Era Legends</p>
        <p className="text-xs text-zinc-400 mt-0.5">documented pro configs</p>
      </div>
      <div className="p-2">
        {legends.map((l) => (
          <div key={l.id} className="relative group/legend">
            <button
              onClick={() => onLoad(l.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded flex items-center gap-3 mb-1 transition-all",
                "hover:bg-zinc-800/50 bg-gradient-to-r to-transparent",
                l.accent
              )}
            >
              <span className="text-xl">{l.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-amber-100">{l.name}</div>
                <div className="text-[10px] font-mono text-zinc-500 truncate">
                  eDPI {l.edpi} · {String(l.overrides.resolution)}
                </div>
              </div>
            </button>

            {/* story popover — opens right, clamped inside nav */}
            <div
              className={cn(
                "hidden group-hover/legend:block absolute left-full top-0 ml-2 z-40 w-80 p-3.5",
                "rounded-lg bg-zinc-950 border border-orange-500/40 shadow-2xl shadow-black"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{l.icon}</span>
                <span className="font-bold text-sm text-amber-100">{l.name}</span>
                <span className="text-[10px] font-mono text-zinc-500 ml-auto">{l.era}</span>
              </div>
              <div className="text-xs font-semibold text-orange-400 mb-1.5">
                {l.realName} · {l.role}
              </div>
              <div className="text-[11px] font-mono text-sky-400/90 mb-2">{l.team}</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-2.5">{l.claim}</p>
              <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-mono text-zinc-500">
                <span>sens {String(l.overrides.sensitivity)}</span>
                <span>eDPI {l.edpi}</span>
                <span>{String(l.overrides.resolution)}</span>
                <span>fps {String(l.overrides.fps_max)}</span>
                <span>interp {String(l.overrides.ex_interp)}</span>
                <span>rate {String(l.overrides.rate)}</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[10px] font-mono text-orange-400/70">
                click to load → tweak into your own
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
