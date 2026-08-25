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

// Orange-to-transparent fade divider
function FadeDivider() {
  return (
    <span className="hidden sm:flex items-center gap-[2px] mx-1" aria-hidden>
      {[6, 4].map((h, i) => (
        <span key={i} className="flex flex-col gap-[2px]">
          <span className="w-[3px] h-1 bg-orange-500/50 rounded-full" style={{ height: h }} />
          <span className="w-[3px] h-1 bg-zinc-700/70 rounded-full" />
        </span>
      ))}
    </span>
  );
}

// Ultra-compact centered status strip — very top of the page.
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
    ? `${cs.map} ${cs.players}/${cs.maxPlayers}`
    : "offline";
  const tsLabel = ts.online
    ? ts.clients && ts.clients.length
      ? ts.clients.map((c) => c.name).join(", ")
      : "empty"
    : "offline";

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950 relative overflow-hidden">
      {/* center fade glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(251,146,60,0.06), transparent 70%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center flex-wrap text-[11px] font-mono">
        <a
          href="steam://connect/cs1.mohican.xyz:27015"
          title={`CS 1.6 server — click to join`}
          className="flex items-center hover:text-orange-300 transition-colors px-1"
        >
          <Dot ok={cs.online} />
          <span className="text-orange-500 font-bold uppercase tracking-wider">CS</span>
          <span className="text-zinc-500 ml-1.5">{csLabel}</span>
        </a>

        <FadeDivider />

        <a
          href="ts3server://ts.mohican.xyz"
          title="TeamSpeak 3 — click to join"
          className="flex items-center hover:text-sky-300 transition-colors px-1"
        >
          <Dot ok={ts.online} />
          <span className="text-sky-400 font-bold uppercase tracking-wider">TS</span>
          <span className="text-zinc-500 ml-1.5 truncate max-w-[180px]">{tsLabel}</span>
        </a>

        <FadeDivider />

        <a
          href="https://webchat.quakenet.org/?nick=mohican-fan.&channels=mohicans&uio=MTY9dHJ1ZSYyPXRydWUmND10cnVlJjk9dHJ1ZSYxMT0zNjkmMTI9dHJ1ZQ75"
          target="_blank"
          rel="noreferrer"
          title="#mohicans @ QuakeNet — open webchat"
          className="flex items-center hover:text-violet-300 transition-colors px-1"
        >
          <Dot ok={true} />
          <span className="text-violet-400 font-bold uppercase tracking-wider">IRC</span>
          <span className="text-zinc-500 ml-1.5">#mohicans</span>
        </a>
      </div>
    </div>
  );
}
