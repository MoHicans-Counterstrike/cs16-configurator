import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

type Player = { name: string };
type Status = {
  updated: string;
  cs: { online: boolean; name?: string; map?: string; players?: number; maxPlayers?: number; playerList?: Player[] };
  ts: { online: boolean; clients?: { name: string; channel: string }[] };
};

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle",
        ok ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" : "bg-red-500"
      )}
    />
  );
}

// Ultra-compact 2-line network strip. Lives at the very top of the page,
// above the header — glanceable, not a section.
export default function NetworkTicker() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/status.json", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => alive && setStatus(d))
        .catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (!status) return null;
  const cs = status.cs;
  const ts = status.ts;

  const csLabel = cs.online
    ? `${cs.map} · ${cs.players}/${cs.maxPlayers}${cs.playerList && cs.playerList.length ? ` · ${cs.playerList.map((p) => p.name).join(", ")}` : ""}`
    : "offline";
  const tsLabel = ts.online
    ? ts.clients && ts.clients.length
      ? `${ts.clients.map((c) => c.name).join(", ")}`
      : "online · empty"
    : "offline";

  return (
    <div className="border-b border-orange-500/15 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-mono">
        {/* line items flow inline; wraps naturally on mobile */}
        <a
          href="steam://connect/cs1.mohican.xyz:27015"
          title={`CS 1.6 · ${csLabel} — click to join`}
          className="flex items-center hover:text-orange-300 transition-colors"
        >
          <Dot ok={cs.online} />
          <span className="text-orange-500 font-bold uppercase tracking-wider">CS</span>
          <span className="text-zinc-400 ml-1.5">{cs.online ? "cs1.mohican.xyz" : "down"}</span>
          {cs.online && <span className="text-zinc-600 ml-1.5">{csLabel}</span>}
        </a>

        <a
          href="ts3server://ts.mohican.xyz"
          title={`TeamSpeak · ${tsLabel} — click to join`}
          className="flex items-center hover:text-sky-300 transition-colors"
        >
          <Dot ok={ts.online} />
          <span className="text-sky-400 font-bold uppercase tracking-wider">TS</span>
          <span className="text-zinc-400 ml-1.5">ts.mohican.xyz</span>
          {ts.online && <span className="text-zinc-600 ml-1.5 truncate max-w-[220px]">{tsLabel}</span>}
        </a>

        <a
          href="https://webchat.quakenet.org/?nick=mohican-fan.&channels=mohicans&uio=MTY9dHJ1ZSYyPXRydWUmND10cnVlJjk9dHJ1ZSYxMT0zNjkmMTI9dHJ1ZQ75"
          target="_blank"
          rel="noreferrer"
          title="#mohicans @ QuakeNet — open webchat"
          className="flex items-center hover:text-violet-300 transition-colors ml-auto"
        >
          <Dot ok={true} />
          <span className="text-violet-400 font-bold uppercase tracking-wider">IRC</span>
          <span className="text-zinc-400 ml-1.5">#mohicans @ QuakeNet ↗</span>
        </a>
      </div>
    </div>
  );
}
