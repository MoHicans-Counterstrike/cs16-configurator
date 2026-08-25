import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

// Mohican Server Browser
type ServerInfo = {
  online: boolean;
  map: string;
  players: number;
  maxPlayers: number;
  ping: number;
};

export default function ServerBrowser() {
  const [server, setServer] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServer = async () => {
      try {
        // Try to fetch from our status poller endpoint
        const res = await fetch("/status.json");
        const data = await res.json();
        if (data?.cs16) {
          setServer({
            online: data.cs16.online,
            map: data.cs16.map || "unknown",
            players: data.cs16.players || 0,
            maxPlayers: data.cs16.maxPlayers || 16,
            ping: data.cs16.ping || 0,
          });
        }
      } catch {
        // Fallback: show offline
        setServer({ online: false, map: "unknown", players: 0, maxPlayers: 16, ping: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchServer();
    const interval = setInterval(fetchServer, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-3 h-3 rounded-full", server?.online ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
          <h3 className="text-sm font-bold text-amber-100">cs1.mohican.xyz</h3>
          <span className="text-xs font-mono text-zinc-400">217.160.10.128:27015</span>
        </div>
        {loading ? (
          <p className="text-xs font-mono text-zinc-400">Checking server status...</p>
        ) : server?.online ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-950 rounded p-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Players</div>
              <div className="text-lg font-mono font-bold text-amber-100">{server.players}/{server.maxPlayers}</div>
            </div>
            <div className="bg-zinc-950 rounded p-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Map</div>
              <div className="text-sm font-mono text-orange-300 truncate">{server.map}</div>
            </div>
            <div className="bg-zinc-950 rounded p-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Ping</div>
              <div className="text-sm font-mono text-amber-100">{server.ping}ms</div>
            </div>
            <div className="bg-zinc-950 rounded p-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Status</div>
              <div className="text-sm font-mono text-emerald-400">Online</div>
            </div>
          </div>
        ) : (
          <p className="text-xs font-mono text-red-400">Server is currently offline</p>
        )}
        <div className="mt-3 flex gap-2">
          <a href="steam://connect/217.160.10.128:27015" className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold text-xs font-mono">
            ▶ CONNECT
          </a>
          <button
            onClick={() => navigator.clipboard.writeText("connect 217.160.10.128:27015")}
            className="px-4 py-2 rounded border border-zinc-700 text-zinc-300 text-xs font-mono hover:border-zinc-500"
          >
            COPY CONNECT CMD
          </button>
        </div>
      </div>
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-400">
          Our CS 1.6 server runs 24/7. Join the community, play with friends, and climb the leaderboard.
          The leaderboard on the Rangliste tab tracks frags in real-time.
        </p>
      </div>
    </div>
  );
}
