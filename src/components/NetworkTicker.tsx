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
        "inline-block w-2 h-2 rounded-full",
        ok
          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
          : "bg-red-500"
      )}
    />
  );
}

function JoinLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-current/30 hover:bg-white/5 text-xs font-mono transition-colors"
    >
      ▶ {label}
    </a>
  );
}

// Network status bar — one card per service on desktop, stacked join links
// under each so nothing gets lost when scrolling horizontally on mobile.
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
  if (!cs.online && !ts.online) return null;

  return (
    <div className="border-y border-orange-500/20 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid md:grid-cols-3 gap-x-6 gap-y-3">
          {/* ── CS server ── */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Dot ok={cs.online} />
              <span className="text-orange-500 uppercase text-[11px] font-mono tracking-widest font-bold">
                CS 1.6 Server
              </span>
            </div>
            {cs.online ? (
              <>
                <a
                  href="steam://connect/cs1.mohican.xyz:27015"
                  className="text-amber-100 hover:text-orange-300 transition-colors text-sm font-mono underline decoration-dotted decoration-orange-500/40 underline-offset-4 w-fit"
                >
                  cs1.mohican.xyz:27015
                </a>
                <div className="text-xs text-zinc-400 font-mono">
                  <span className="text-amber-300">{cs.map}</span>
                  <span className="mx-1.5 text-zinc-600">·</span>
                  {cs.players}/{cs.maxPlayers} players
                </div>
                {cs.playerList && cs.playerList.length > 0 ? (
                  <div className="text-[11px] text-zinc-500 font-mono truncate" title={cs.playerList.map((p) => p.name).join(", ")}>
                    [{cs.playerList.map((p) => p.name).join(", ")}]
                  </div>
                ) : (
                  <div className="text-[11px] text-zinc-600 font-mono italic">server empty — be the first</div>
                )}
                <JoinLink href="steam://connect/cs1.mohican.xyz:27015" label="join server" />
              </>
            ) : (
              <span className="text-red-400/80 text-xs">offline</span>
            )}
          </div>

          {/* ── TeamSpeak ── */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Dot ok={ts.online} />
              <span className="text-sky-400 uppercase text-[11px] font-mono tracking-widest font-bold">
                TeamSpeak 3
              </span>
            </div>
            {ts.online ? (
              <>
                <a
                  href="ts3server://ts.mohican.xyz"
                  className="text-amber-100 hover:text-sky-300 transition-colors text-sm font-mono underline decoration-dotted decoration-sky-400/40 underline-offset-4 w-fit"
                >
                  ts.mohican.xyz
                </a>
                {ts.clients && ts.clients.length > 0 ? (
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                    {ts.clients.map((c, i) => (
                      <span key={i} className="text-[11px] text-zinc-300 font-mono">
                        <span className="text-sky-300">{c.name}</span>
                        {c.channel && <span className="text-zinc-600"> · {c.channel}</span>}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-zinc-600 font-mono italic">
                    nobody online right now
                  </div>
                )}
                <JoinLink href="ts3server://ts.mohican.xyz" label="join teamspeak" />
              </>
            ) : (
              <span className="text-red-400/80 text-xs">offline</span>
            )}
          </div>

          {/* ── IRC ── */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Dot ok={true} />
              <span className="text-violet-400 uppercase text-[11px] font-mono tracking-widest font-bold">
                IRC @ QuakeNet
              </span>
            </div>
            <a
              href="https://webchat.quakenet.org/?nick=mohican-fan.&channels=mohicans&uio=MTY9dHJ1ZSYyPXRydWUmND10cnVlJjk9dHJ1ZSYxMT0zNjkmMTI9dHJ1ZQ75"
              target="_blank"
              rel="noreferrer"
              className="text-amber-100 hover:text-violet-300 transition-colors text-sm font-mono underline decoration-dotted decoration-violet-400/40 underline-offset-4 w-fit"
            >
              #mohicans
            </a>
            <div className="text-[11px] text-zinc-600 font-mono italic">webchat opens in new tab</div>
            <JoinLink
              href="https://webchat.quakenet.org/?nick=mohican-fan.&channels=mohicans&uio=MTY9dHJ1ZSYyPXRydWUmND10cnVlJjk9dHJ1ZSYxMT0zNjkmMTI9dHJ1ZQ75"
              label="open webchat"
            />
          </div>
        </div>

        {status.updated && (
          <div className="mt-2 pt-1.5 border-t border-zinc-800/60 text-[10px] text-zinc-700 font-mono text-right">
            network status · polled {new Date(status.updated).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
