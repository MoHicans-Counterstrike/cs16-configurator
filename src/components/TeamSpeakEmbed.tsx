import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

// TeamSpeak 3 Server Embed with channels
type TS3Status = {
  online: boolean;
  clients: number;
  maxClients: number;
  channels: number;
  name: string;
  channelsList?: { name: string; clients: number }[];
};

export default function TeamSpeakEmbed() {
  const [status, setStatus] = useState<TS3Status | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/status.json");
        const data = await res.json();
        if (data?.ts) {
          setStatus({
            online: data.ts.online,
            clients: data.ts.clients?.length || 0,
            maxClients: data.ts.maxClients || 32,
            channels: data.ts.channels || 0,
            name: data.ts.name || "Mohicans TS3",
            channelsList: data.ts.channelsList || [
              { name: "Lobby", clients: 0 },
              { name: "Gaming", clients: 0 },
              { name: "AFK", clients: 0 },
            ],
          });
        }
      } catch {
        setStatus({ online: false, clients: 0, maxClients: 32, channels: 0, name: "Mohicans TS3", channelsList: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-3 h-3 rounded-full", status?.online ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
          <h3 className="text-sm font-bold text-amber-100">Mohicans TeamSpeak 3</h3>
          <span className="text-xs font-mono text-zinc-400">ts.mohican.xyz</span>
        </div>
        {loading ? (
          <p className="text-xs font-mono text-zinc-400">Checking TS3 status...</p>
        ) : status?.online ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-zinc-950 rounded p-3">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Clients</div>
                <div className="text-lg font-mono font-bold text-amber-100">{status.clients}/{status.maxClients}</div>
              </div>
              <div className="bg-zinc-950 rounded p-3">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Channels</div>
                <div className="text-lg font-mono font-bold text-orange-300">{status.channels}</div>
              </div>
              <div className="bg-zinc-950 rounded p-3">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Status</div>
                <div className="text-sm font-mono text-emerald-400">Online</div>
              </div>
              <div className="bg-zinc-950 rounded p-3">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Version</div>
                <div className="text-sm font-mono text-amber-100">3.13.x</div>
              </div>
            </div>

            {status.channelsList && status.channelsList.length > 0 && (
              <div className="bg-zinc-950 rounded p-3 border border-zinc-800">
                <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Channels</p>
                <div className="space-y-1">
                  {status.channelsList.map((ch, i) => (
                    <div key={i} className="flex items-center justify-between px-2 py-1 rounded hover:bg-zinc-800/50">
                      <span className="text-xs font-mono text-zinc-300">{ch.name}</span>
                      <span className="text-[10px] font-mono text-orange-300">{ch.clients} client{ch.clients !== 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs font-mono text-red-400">TS3 server is currently offline</p>
        )}
        <div className="mt-3 flex gap-2">
          <a href="ts3server://ts.mohican.xyz" className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold text-xs font-mono">▶ CONNECT TO TS3</a>
          <button onClick={() => navigator.clipboard.writeText("ts.mohican.xyz")} className="px-4 py-2 rounded border border-zinc-700 text-zinc-300 text-xs font-mono hover:border-zinc-500">COPY ADDRESS</button>
        </div>
      </div>
    </div>
  );
}
