import { legends, legendGroups } from "../data/legends";
import { cn } from "../utils/cn";
import ProAvatar from "./ProAvatar";
import { useLayoutEffect, useRef, useState } from "react";

// Clan-grouped legend grid with generated pixel avatars.
// Hover story card renders in a PORTAL with position:fixed so it always
// sits above every other element (z-index 9999), never clipped.

function StoryCard({ id, anchor }: { id: string; anchor: DOMRect }) {
  const l = legends.find((x) => x.id === id)!;
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: anchor.bottom + 8, left: anchor.left });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    let left = anchor.left;
    let top = anchor.bottom + 8;
    // flip up if overflowing bottom
    if (top + r.height > window.innerHeight - 8) {
      top = Math.max(8, anchor.top - r.height - 8);
    }
    // clamp right edge
    if (left + r.width > window.innerWidth - 8) {
      left = window.innerWidth - r.width - 8;
    }
    setPos({ top, left });
  }, [anchor]);

  return (
    <div
      ref={ref}
      className="fixed z-[9999] w-72 p-3 rounded-lg bg-zinc-950 border border-orange-500/40 shadow-2xl shadow-black pointer-events-none"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <ProAvatar name={l.name} clan={l.team} size={32} />
        <div className="min-w-0">
          <div className="font-bold text-sm text-amber-100 truncate">{l.name}</div>
          <div className="text-[10px] font-mono text-zinc-500">
            {l.realName} · {l.era}
          </div>
        </div>
      </div>
      <div className="text-xs font-semibold text-orange-400 mb-1">
        {l.role} · {l.team}
      </div>
      <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{l.claim}</p>
      <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] font-mono text-zinc-500">
        <span>sens {String(l.overrides.sensitivity)}</span>
        <span>eDPI {l.edpi}</span>
        <span>{String(l.overrides.resolution)}</span>
        <span>fps {String(l.overrides.fps_max)}</span>
      </div>
      <div className="mt-2 pt-2 border-t border-zinc-800 text-[10px] font-mono text-orange-400/70">
        click to load → tweak into your own
      </div>
    </div>
  );
}

export default function LegendsSidebar({ onLoad }: { onLoad: (id: string) => void }) {
  const [hovered, setHovered] = useState<{ id: string; rect: DOMRect } | null>(null);

  return (
    <>
      {/* portal-ish card rendered at root level via fixed positioning */}
      {hovered && <StoryCard id={hovered.id} anchor={hovered.rect} />}

      <div className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-visible backdrop-blur">
        <div className="px-3 py-2.5 border-b border-zinc-800 bg-zinc-900/80 rounded-t-lg">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Golden Era Legends</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{legends.length} pros · by clan</p>
        </div>
        <div className="p-2">
          {legendGroups.map((group) => {
            const members = group.ids.map((id) => legends.find((l) => l.id === id)).filter(Boolean);
            if (!members.length) return null;
            return (
              <div key={group.clan} className="mb-2 last:mb-0">
                <div className="px-1 pt-1.5 pb-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                    {group.clan}
                  </span>
                  <span className="ml-auto text-[9px] font-mono text-zinc-600">{members.length}</span>
                </div>

                {/* member avatar row */}
                <div className="flex gap-1.5 px-1 pb-1 flex-wrap">
                  {members.map((l) => (
                    <button
                      key={l!.id}
                      onClick={() => onLoad(l!.id)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHovered({ id: l!.id, rect });
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHovered({ id: l!.id, rect });
                      }}
                      onBlur={() => setHovered(null)}
                      aria-label={`${l!.name} — load config`}
                      className={cn(
                        "block rounded-md transition-transform hover:scale-110 active:scale-95",
                        "ring-0 hover:ring-2 ring-orange-500/60 relative z-10"
                      )}
                    >
                      <ProAvatar name={l!.name} clan={group.clan} size={40} />
                      <div className="mt-0.5 text-center text-[8px] font-mono text-zinc-500 leading-none">
                        {l!.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
