import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 Server Browser with multiple servers and map previews
type ServerInfo = {
  id: string;
  name: string;
  address: string;
  ip: string;
  port: number;
  online: boolean;
  map: string;
  players: number;
  maxPlayers: number;
  ping?: number;
  featured?: boolean;
};

const SERVERS: Omit<ServerInfo, "online" | "map" | "players" | "maxPlayers">[] = [
  { id: "mohican", name: "#CS 1 ~ #MoHicans CS 1.6 ~ Welcome!", address: "cs1.mohican.xyz", ip: "217.160.10.128", port: 27015, featured: true },
  { id: "gr1", name: "German Server #1", address: "179.61.132.114", ip: "179.61.132.114", port: 27015 },
  { id: "gr2", name: "German Server #2", address: "37.114.53.187", ip: "37.114.53.187", port: 27015 },
  { id: "gr3", name: "German Server #3", address: "37.114.53.187", ip: "37.114.53.187", port: 27018 },
  { id: "gr4", name: "German Server #4", address: "37.114.53.187", ip: "37.114.53.187", port: 27019 },
  { id: "gr5", name: "German Server #5", address: "37.114.57.16", ip: "37.114.57.16", port: 27015 },
  { id: "int1", name: "International Server", address: "31.214.240.4", ip: "31.214.240.4", port: 20300 },
];

const MAP_PREVIEW_IMAGES: Record<string, string> = {
  de_dust: "/maps/dust.jpg",
  de_dust2: "/maps/dust.jpg",
  de_inferno: "/maps/chateau.jpg",
  de_nuke: "/maps/office.jpg",
  de_train: "/maps/chateau.jpg",
  cs_office: "/maps/office.jpg",
  cs_italy: "/maps/italy.jpg",
  de_aztec: "/maps/dust.jpg",
  unknown: "/maps/dust.jpg",
};

function getMapPreview(map: string): string {
  return MAP_PREVIEW_IMAGES[map] || MAP_PREVIEW_IMAGES.unknown;
}

export default function ServerBrowser() {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/status.json");
        const data = await res.json();
        const csData = data?.cs || {};
        
        const mapped: ServerInfo[] = SERVERS.map((s) => ({
          ...s,
          online: s.id === "mohican" ? csData.online : false,
          map: s.id === "mohican" ? (csData.map || "unknown") : "unknown",
          players: s.id === "mohican" ? (csData.players || 0) : 0,
          maxPlayers: csData.maxPlayers || 16,
        }));
        
        setServers(mapped);
      } catch {
        setServers(SERVERS.map((s) => ({ ...s, online: false, map: "unknown", players: 0, maxPlayers: 16 })));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const featuredServer = servers.find((s) => s.featured);
  const otherServers = servers.filter((s) => !s.featured);

  return (
    <div className="space-y-4">
      {/* Featured Server */}
      {featuredServer && (
        <div className="relative overflow-hidden rounded-lg border-2 border-orange-500/50 shadow-[0_0_20px_rgba(251,146,60,0.2)]">
          <div className="absolute inset-0">
            <img src={getMapPreview(featuredServer.map)} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/60" />
          </div>
          <div className="relative p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-mono uppercase">
                Featured
              </span>
              <div className={cn("w-2 h-2 rounded-full", featuredServer.online ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
              <span className="text-xs font-mono text-zinc-300">{featuredServer.name}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Players</div>
                <div className="text-xl font-mono font-bold text-amber-100">{featuredServer.players}/{featuredServer.maxPlayers}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Map</div>
                <div className="text-sm font-mono text-orange-300 truncate">{featuredServer.map}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Status</div>
                <div className="text-sm font-mono text-emerald-400">{featuredServer.online ? "Online" : "Offline"}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Address</div>
                <div className="text-sm font-mono text-amber-100 truncate">{featuredServer.address}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`steam://connect/${featuredServer.ip}:${featuredServer.port}`} className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold text-xs font-mono">
                ▶ CONNECT
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(`connect ${featuredServer.ip}:${featuredServer.port}`)}
                className="px-4 py-2 rounded border border-zinc-600 text-zinc-300 text-xs font-mono hover:border-zinc-400"
              >
                COPY CMD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Servers */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Other Servers</p>
        {otherServers.map((server) => (
          <div key={server.id} className="relative overflow-hidden rounded-lg border border-zinc-800">
            <div className="absolute inset-y-0 left-0 w-24">
              <img src={getMapPreview(server.map)} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 to-transparent" />
            </div>
            <div className="relative flex items-center justify-between pl-28 pr-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-bold text-amber-100 truncate">{server.name}</div>
                <div className="text-[10px] font-mono text-zinc-400">{server.address}:{server.port}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono text-orange-300">{server.players}/{server.maxPlayers}</div>
                  <div className="text-[10px] font-mono text-zinc-500">players</div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(`connect ${server.ip}:${server.port}`)}
                  className="px-3 py-1.5 rounded border border-zinc-700 text-zinc-300 text-[10px] font-mono hover:border-zinc-500"
                >
                  COPY
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
