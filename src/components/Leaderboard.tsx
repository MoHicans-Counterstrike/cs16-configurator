import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

type Entry = { name: string; score: number; lastSeen: number; sessions?: number };

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [updated, setUpdated] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/leaderboard.json", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!alive || !d) return;
          setEntries(Object.values(d.players ?? {}));
          setUpdated(d.updated);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-8 text-center">
        <p className="text-sm font-mono text-zinc-300">
          No players ranked yet — the tracker samples the server every minute.
          <br />
          <span className="text-orange-400">Hop on cs1.mohican.xyz and frag!</span>
        </p>
      </div>
    );
  }

  const max = Math.max(...entries.map((e) => e.score), 1);

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Server Rangliste</p>
          <p className="text-[10px] text-zinc-300 mt-0.5">
            top {Math.min(entries.length, 50)} by frags · sampled every 60s
            {updated && ` · updated ${new Date(updated).toLocaleTimeString()}`}
          </p>
        </div>
        <a
          href="steam://connect/cs1.mohican.xyz:27015"
          className="px-3 py-1.5 rounded border border-orange-500/50 text-orange-300 hover:bg-orange-500/10 text-xs font-mono transition-colors"
        >
          ▶ join &amp; climb
        </a>
      </div>
      <div className="divide-y divide-zinc-800/60 max-h-[480px] overflow-y-auto">
        {entries.map((e, i) => (
          <div key={e.name} className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-800/30 transition-colors">
            <span className="w-8 text-center font-mono text-sm flex-shrink-0">
              {i < 3 ? MEDALS[i] : <span className="text-zinc-600">{i + 1}</span>}
            </span>
            <ProAvatarInline name={e.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn("font-mono text-sm truncate", i === 0 ? "text-orange-300" : "text-amber-100")}>
                  {e.name}
                </span>
                <span className={cn("font-mono font-bold text-sm flex-shrink-0", i === 0 ? "text-orange-400" : "text-emerald-400")}>
                  {e.score}
                </span>
              </div>
              {/* score bar */}
              <div className="h-1 mt-1 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    i === 0 ? "bg-gradient-to-r from-orange-500 to-amber-400" : "bg-gradient-to-r from-sky-600 to-sky-400"
                  )}
                  style={{ width: `${Math.max(4, (e.score / max) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// tiny inline identicon (mirrors ProAvatar logic, smaller)
function ProAvatarInline({ name }: { name: string }) {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = h >>> 0;
  const cells: boolean[] = [];
  let bits = h;
  for (let i = 0; i < 15; i++) {
    cells.push((bits & 1) === 1);
    bits >>>= 1;
  }
  return (
    <svg width="24" height="24" viewBox="0 0 50 50" className="rounded flex-shrink-0 border border-zinc-700" style={{ backgroundColor: "#27272a" }}>
      {[0, 1, 2].map((col) =>
        [0, 1, 2, 3, 4].map((row) =>
          cells[col * 5 + row] ? (
            <>
              <rect key={`${col}-${row}`} x={col * 10} y={row * 10} width="10" height="10" fill="#fb923c" />
              {col < 2 && (
                <rect key={`m${col}-${row}`} x={(4 - col) * 10} y={row * 10} width="10" height="10" fill="#fb923c" />
              )}
            </>
          ) : null
        )
      )}
    </svg>
  );
}
