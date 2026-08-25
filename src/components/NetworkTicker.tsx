import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

type Player = { name: string; score?: number; time?: string };
type Status = {
  updated: string;
  cs: {
    online: boolean;
    name?: string;
    map?: string;
    players?: number;
    maxPlayers?: number;
    playerList?: Player[];
  };
  ts: { online: boolean; clients?: { name: string; channel: string }[] };
};

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full mr-2",
        ok
          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
          : "bg-red-500"
      )}
    />
  );
}

// Horizontal "network ticker" — deliberately NOT boxes.
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
  const anyOnline = cs.online || ts.online;
  if (!anyOnline) return null;

  return (
    <div className="border-y border-orange-500/20 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950">
      {/* marquee-style scrolling strip */}
      <div className="relative overflow-hidden py-2.5">
        <div className="flex items-center gap-10 px-4 whitespace-nowrap overflow-x-auto scrollbar-none font-mono text-sm">
          {/* CS server */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Dot ok={cs.online} />
            <span className="text-orange-500 uppercase text-xs tracking-widest">CS 1.6</span>
            {cs.online ? (
              <>
                <a
                  href={`steam://connect/cs1.mohican.xyz:27015`}
                  className="text-amber-100 hover:text-orange-300 transition-colors underline decoration-dotted decoration-orange-500/40 underline-offset-4"
                  title="Connect via Steam"
                >
                  cs1.mohican.xyz:27015
                </a>
                <span className="text-zinc-500">·</span>
                <span className="text-amber-300">{cs.map}</span>
                <span className="text-zinc-500">·</span>
                <span className="text-amber-100">
                  {cs.players}/{cs.maxPlayers}{" "}
                  <span className="text-zinc-600 text-xs">players</span>
                </span>
                {cs.playerList && cs.playerList.length > 0 && (
                  <span className="text-zinc-400 text-xs hidden md:inline">
                    [{cs.playerList.map((p) => p.name).join(", ")}]
                  </span>
                )}
              </>
            ) : (
              <span className="text-red-400/80 text-xs">server offline</span>
            )}
          </div>

          <div className="w-px h-5 bg-zinc-800 flex-shrink-0" />

          {/* TeamSpeak */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Dot ok={ts.online} />
            <span className="text-sky-400 uppercase text-xs tracking-widest">TeamSpeak</span>
            {ts.online ? (
              ts.clients && ts.clients.length > 0 ? (
                <span className="flex items-center gap-2 flex-wrap">
                  {ts.clients.map((c, i) => (
                    <span key={i} className="text-xs text-zinc-300">
                      <span className="text-sky-300">{c.name}</span>
                      {c.channel && <span className="text-zinc-600"> in {c.channel}</span>}
                      {i < ts.clients.length - 1 && <span className="ml-2 text-zinc-700">/</span>}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-xs text-zinc-500">ts.mohican.xyz — nobody online right now</span>
              )
            ) : (
              <span className="text-red-400/80 text-xs">offline</span>
            )}
          </div>

          <div className="w-px h-5 bg-zinc-800 flex-shrink-0" />

          {/* IRC */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Dot ok={true} />
            <span className="text-violet-400 uppercase text-xs tracking-widest">IRC</span>
            <a
              href="https://webchat.quakenet.org/?nick=mohican-fan.&channels=mohicans&uio=MTY9dHJ1ZSYyPXRydWUmND10cnVlJjk9dHJ1ZSYxMT0zNjkmMTI9dHJ1ZQ75"
              target="_blank"
              rel="noreferrer"
              className="text-amber-100 hover:text-violet-300 transition-colors underline decoration-dotted decoration-violet-400/40 underline-offset-4"
            >
              #mohicans @ QuakeNet
            </a>
            <span className="text-zinc-600 text-xs hidden lg:inline">— webchat</span>
          </div>

          <div className="w-px h-5 bg-zinc-800 flex-shrink-0" />

          {/* Join hints */}
          <div className="flex items-center gap-6 flex-shrink-0 text-xs">
            <a
              href="steam://connect/cs1.mohican.xyz:27015"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              ▶ join server
            </a>
            <a
              href="ts3server://ts.mohican.xyz"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              ▶ join teamspeak
            </a>
          </div>
        </div>
      </div>
      {status.updated && (
        <div className="px-4 pb-1 -mt-1 text-[10px] text-zinc-700 font-mono text-right">
          network status · polled {new Date(status.updated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
