import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 Server Browser
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
  location: string;
  featured?: boolean;
};

// Map preview images (real CS 1.6 screenshots, sourced from varq.net + GameBanana)
const MAP_PREVIEW: Record<string, string> = {
  // Mohican mappool — exact matches
  fy_pool_day: "/maps/fy_pool_day.jpg",
  "aim_ak-colt": "/maps/aim_ak-colt.jpg",
  fy_iceworld: "/maps/fy_iceworld.jpg",
  fy_iceworld2k: "/maps/fy_iceworld2k.jpg",
  cs_assault: "/maps/cs_assault.jpg",
  de_aztec: "/maps/de_aztec.jpg",
  aim_map_usp: "/maps/aim_map_usp.jpg",
  de_inferno: "/maps/de_inferno.jpg",
  awp_map: "/maps/awp_map.jpg",
  de_dust: "/maps/de_dust.jpg",
  fy_snow: "/maps/fy_snow.jpg",
  de_dust2: "/maps/de_dust2.jpg",
  aim_map: "/maps/aim_map.jpg",
  cs_deagle5: "/maps/cs_deagle5.jpg",
  de_rats: "/maps/de_rats.jpg",
  awp_india: "/maps/awp_india.jpg",
  de_cpl_mill: "/maps/de_cpl_mill.jpg",
  surf_ninja: "/maps/surf_ninja.jpg",
  aim_pistols: "/maps/aim_pistols.jpg",
  "2d_mario": "/maps/2d_mario.jpg",
  cs_italy: "/maps/cs_italy.jpg",
  de_cpl_strike: "/maps/de_cpl_strike.jpg",
  de_forge: "/maps/de_forge.jpg",
  de_russke: "/maps/de_russke.jpg",
  de_tuscan: "/maps/de_tuscan.jpg",
  de_train: "/maps/de_train.jpg",
  fy_simpsons: "/maps/fy_simpsons.jpg",
  surf_tutorial: "/maps/surf_tutorial.jpg",
  // other servers / fallbacks
  de_nuke: "/maps/de_inferno.jpg",
  cs_office: "/maps/cs_italy.jpg",
  de_chateau: "/maps/de_tuscan.jpg",
  unknown: "/maps/de_dust2.jpg",
};

function getMapPreview(map: string): string {
  return MAP_PREVIEW[map] || MAP_PREVIEW.unknown;
}

const SERVERS: Omit<ServerInfo, "online" | "map" | "players" | "maxPlayers">[] = [
  { id: "mohican", name: "#CS 1 ~ #MoHicans CS 1.6", address: "cs1.mohican.xyz", ip: "195.90.220.99", port: 27015, location: "🇩🇪 Germany", featured: true },
  { id: "dzg", name: "#1 DzG [Public] #FreePalestine", address: "179.61.132.114", ip: "179.61.132.114", port: 27015, location: "🇩🇪 Germany" },
  { id: "wolves1", name: "Wolves | Assault 1000 FPS #1", address: "37.114.53.187", ip: "37.114.53.187", port: 27015, location: "🇩🇪 Germany" },
  { id: "wolves2", name: "Wolves | Dust 1000 FPS #2", address: "37.114.53.187", ip: "37.114.53.187", port: 27018, location: "🇩🇪 Germany" },
  { id: "wolves3", name: "Wolves | Classic 1000 FPS #3", address: "37.114.53.187", ip: "37.114.53.187", port: 27019, location: "🇩🇪 Germany" },
  { id: "wolves4", name: "Wolves | PaintBall 1000 FPS #4", address: "37.114.57.16", ip: "37.114.57.16", port: 27015, location: "🇩🇪 Germany" },
  { id: "nostalgia", name: "Nostalgia CS 1.6", address: "31.214.240.4", ip: "31.214.240.4", port: 20300, location: "🇹🇷 Turkey" },
];

export default function ServerBrowser() {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/status.json");
        const data = await res.json();
        const cs = data?.cs || {};
        
        setServers(SERVERS.map((s) => ({
          ...s,
          online: s.id === "mohican" ? (cs.online ?? false) : false,
          map: s.id === "mohican" ? (cs.map || "unknown") : "unknown",
          players: s.id === "mohican" ? (cs.players || 0) : 0,
          maxPlayers: cs.maxPlayers || 16,
        })));
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

  const featured = servers.find((s) => s.featured);
  const others = servers.filter((s) => !s.featured);

  return (
    <div className="space-y-4">
      {/* Featured Mohican Server */}
      {featured && (
        <div className="relative overflow-hidden rounded-lg border-2 border-orange-500/50 shadow-[0_0_25px_rgba(251,146,60,0.2)]">
          <div className="absolute inset-0">
            <img src={getMapPreview(featured.map)} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/60" />
          </div>
          <div className="relative p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-mono uppercase">Featured</span>
              <div className={cn("w-2 h-2 rounded-full", featured.online ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
              <span className="text-xs font-mono text-zinc-300">{featured.name}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Players</div>
                <div className="text-xl font-mono font-bold text-amber-100">{featured.players}/{featured.maxPlayers}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Map</div>
                <div className="text-sm font-mono text-orange-300 truncate">{featured.map}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Location</div>
                <div className="text-sm font-mono text-amber-100">{featured.location}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Status</div>
                <div className="text-sm font-mono text-emerald-400">{featured.online ? "Online" : "Offline"}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`steam://connect/${featured.ip}:${featured.port}`} className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold text-xs font-mono">▶ CONNECT</a>
              <button onClick={() => navigator.clipboard.writeText(`connect ${featured.ip}:${featured.port}`)} className="px-4 py-2 rounded border border-zinc-600 text-zinc-300 text-xs font-mono hover:border-zinc-400">COPY CMD</button>
            </div>
          </div>
        </div>
      )}

      {/* Other Servers */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">More Servers</p>
        {others.map((server) => (
          <div key={server.id} className="relative overflow-hidden rounded-lg border border-zinc-800">
            <div className="absolute inset-y-0 left-0 w-28">
              <img src={getMapPreview(server.map)} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 to-transparent" />
            </div>
            <div className="relative flex items-center justify-between pl-32 pr-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-bold text-amber-100 truncate">{server.name}</div>
                <div className="text-[10px] font-mono text-zinc-400">{server.address}:{server.port} · {server.location}</div>
              </div>
              <button onClick={() => navigator.clipboard.writeText(`connect ${server.ip}:${server.port}`)} className="px-3 py-1.5 rounded border border-zinc-700 text-zinc-300 text-[10px] font-mono hover:border-zinc-500">COPY</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
