import { useState } from "react";
import { cn } from "../utils/cn";

// Real CS 1.6 Weapon SVGs — detailed and colored
function WeaponSVG({ id, className }: { id: string; className?: string }) {
  const svgs: Record<string, JSX.Element> = {
    ak47: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="38" height="6" rx="1" fill="#8B4513" stroke="#5C3317" strokeWidth="1"/>
        <rect x="40" y="8" width="24" height="9" rx="2" fill="#4a3728" stroke="#2d1f14" strokeWidth="1"/>
        <rect x="8" y="16" width="9" height="7" rx="1" fill="#5C3317" stroke="#3d2211" strokeWidth="1"/>
        <rect x="22" y="4" width="3" height="6" fill="#666" stroke="#444" strokeWidth="0.5"/>
        <circle cx="52" cy="12.5" r="2" fill="#333" stroke="#222" strokeWidth="0.5"/>
        <rect x="64" y="10" width="14" height="3" rx="0.5" fill="#555" stroke="#333" strokeWidth="0.5"/>
      </svg>
    ),
    m4a1: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="44" height="5" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="46" y="8" width="22" height="9" rx="2" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="1"/>
        <rect x="10" y="15" width="8" height="7" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <rect x="24" y="4" width="6" height="6" rx="1" fill="#555" stroke="#333" strokeWidth="0.5"/>
        <circle cx="56" cy="12.5" r="2" fill="#222" stroke="#111" strokeWidth="0.5"/>
        <rect x="68" y="10" width="10" height="3" rx="0.5" fill="#444" stroke="#222" strokeWidth="0.5"/>
      </svg>
    ),
    awp: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="11" width="60" height="4" rx="1" fill="#2d4a1e" stroke="#1a2e10" strokeWidth="1"/>
        <circle cx="52" cy="13" r="3.5" fill="#1a2e10" stroke="#0d1808" strokeWidth="1"/>
        <rect x="20" y="4" width="5" height="7" rx="1" fill="#3d6b2e" stroke="#2d4a1e" strokeWidth="0.5"/>
        <rect x="27" y="6" width="8" height="5" rx="1" fill="#4a7a3a" stroke="#3d6b2e" strokeWidth="0.5"/>
        <rect x="8" y="15" width="9" height="5" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="62" y="9" width="16" height="6" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
      </svg>
    ),
    scout: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="11" width="55" height="4" rx="1" fill="#5c4033" stroke="#3d2817" strokeWidth="1"/>
        <circle cx="46" cy="13" r="3.5" fill="#3d2817" stroke="#2d1f14" strokeWidth="1"/>
        <rect x="18" y="4" width="5" height="7" rx="1" fill="#6b4c3b" stroke="#5c4033" strokeWidth="0.5"/>
        <rect x="8" y="15" width="8" height="5" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <rect x="57" y="9" width="20" height="6" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
      </svg>
    ),
    famas: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="36" height="5" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <rect x="38" y="8" width="22" height="9" rx="2" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="8" y="15" width="8" height="7" rx="1" fill="#555" stroke="#333" strokeWidth="1"/>
        <rect x="20" y="3" width="3" height="7" fill="#666" stroke="#444" strokeWidth="0.5"/>
        <rect x="60" y="10" width="18" height="3" rx="0.5" fill="#444" stroke="#222" strokeWidth="0.5"/>
      </svg>
    ),
    galil: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="38" height="6" rx="1" fill="#5c4033" stroke="#3d2817" strokeWidth="1"/>
        <rect x="40" y="8" width="24" height="9" rx="2" fill="#4a3728" stroke="#2d1f14" strokeWidth="1"/>
        <rect x="10" y="16" width="9" height="6" rx="1" fill="#6b4c3b" stroke="#5c4033" strokeWidth="1"/>
        <rect x="64" y="10" width="14" height="3" rx="0.5" fill="#555" stroke="#333" strokeWidth="0.5"/>
      </svg>
    ),
    aug: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="42" height="6" rx="1" fill="#3d5c3d" stroke="#2d4a2d" strokeWidth="1"/>
        <rect x="44" y="8" width="22" height="9" rx="2" fill="#2d4a2d" stroke="#1e3320" strokeWidth="1"/>
        <rect x="10" y="16" width="8" height="7" rx="1" fill="#4a7a4a" stroke="#3d6b3d" strokeWidth="1"/>
        <rect x="24" y="3" width="7" height="7" rx="1" fill="#5c8a5c" stroke="#4a7a4a" strokeWidth="0.5"/>
        <circle cx="54" cy="12.5" r="2" fill="#1e3320" stroke="#0d1808" strokeWidth="0.5"/>
      </svg>
    ),
    sg552: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="42" height="5" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="44" y="8" width="22" height="9" rx="2" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="1"/>
        <rect x="10" y="15" width="8" height="7" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <rect x="24" y="3" width="7" height="7" rx="1" fill="#555" stroke="#333" strokeWidth="0.5"/>
        <circle cx="54" cy="12.5" r="2" fill="#222" stroke="#111" strokeWidth="0.5"/>
      </svg>
    ),
    mp5: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="34" height="5" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="36" y="8" width="20" height="9" rx="2" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="1"/>
        <rect x="10" y="15" width="8" height="7" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <rect x="56" y="10" width="22" height="3" rx="0.5" fill="#555" stroke="#333" strokeWidth="0.5"/>
      </svg>
    ),
    tmp: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="32" height="5" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <rect x="34" y="8" width="20" height="9" rx="2" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="10" y="15" width="8" height="7" rx="1" fill="#555" stroke="#333" strokeWidth="1"/>
        <rect x="54" y="10" width="24" height="3" rx="0.5" fill="#444" stroke="#222" strokeWidth="0.5"/>
      </svg>
    ),
    m3: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="9" width="50" height="7" rx="2" fill="#5c4033" stroke="#3d2817" strokeWidth="1"/>
        <rect x="52" y="8" width="16" height="9" rx="2" fill="#4a3728" stroke="#2d1f14" strokeWidth="1"/>
        <rect x="10" y="16" width="9" height="6" rx="1" fill="#6b4c3b" stroke="#5c4033" strokeWidth="1"/>
        <circle cx="28" cy="12.5" r="3.5" fill="#3d2817" stroke="#2d1f14" strokeWidth="1"/>
      </svg>
    ),
    xm1014: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="9" width="52" height="7" rx="2" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="54" y="8" width="16" height="9" rx="2" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="1"/>
        <rect x="10" y="16" width="9" height="6" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <circle cx="30" cy="12.5" r="3.5" fill="#222" stroke="#111" strokeWidth="1"/>
      </svg>
    ),
    deagle: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="9" width="40" height="6" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="10" y="15" width="10" height="7" rx="1" fill="#555" stroke="#333" strokeWidth="1"/>
        <rect x="24" y="5" width="4" height="4" rx="1" fill="#666" stroke="#444" strokeWidth="0.5"/>
      </svg>
    ),
    usp: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="36" height="5" rx="1" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="1"/>
        <rect x="10" y="15" width="8" height="7" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="20" y="5" width="3" height="5" fill="#555" stroke="#333" strokeWidth="0.5"/>
      </svg>
    ),
    glock: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="34" height="5" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="10" y="15" width="8" height="7" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
      </svg>
    ),
    p228: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="36" height="5" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <rect x="10" y="15" width="8" height="7" rx="1" fill="#555" stroke="#333" strokeWidth="1"/>
        <rect x="20" y="5" width="3" height="5" fill="#666" stroke="#444" strokeWidth="0.5"/>
      </svg>
    ),
    elite: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="30" height="5" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="36" y="12" width="30" height="5" rx="1" fill="#3d3d3d" stroke="#222" strokeWidth="1"/>
        <rect x="10" y="12" width="7" height="7" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
        <rect x="44" y="17" width="7" height="7" rx="1" fill="#4a4a4a" stroke="#333" strokeWidth="1"/>
      </svg>
    ),
    fiveseven: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="34" height="5" rx="1" fill="#555" stroke="#333" strokeWidth="1"/>
        <rect x="10" y="15" width="8" height="7" rx="1" fill="#666" stroke="#444" strokeWidth="1"/>
        <rect x="20" y="5" width="3" height="5" fill="#777" stroke="#555" strokeWidth="0.5"/>
      </svg>
    ),
    vest: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 4 L22 2 L42 2 L54 4 L50 20 L40 22 L24 22 L14 20 Z" fill="#3d5c3d" stroke="#2d4a2d" strokeWidth="1.5"/>
        <path d="M22 2 L22 22" stroke="#2d4a2d" strokeWidth="1"/>
        <path d="M42 2 L42 22" stroke="#2d4a2d" strokeWidth="1"/>
      </svg>
    ),
    vesthelm: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="8" r="9" fill="#3d5c3d" stroke="#2d4a2d" strokeWidth="1.5"/>
        <path d="M18 12 L18 22 L46 22 L46 12" fill="#3d5c3d" stroke="#2d4a2d" strokeWidth="1.5"/>
        <path d="M24 14 L24 22" stroke="#2d4a2d" strokeWidth="1"/>
        <path d="M40 14 L40 22" stroke="#2d4a2d" strokeWidth="1"/>
      </svg>
    ),
    defuser: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="5" width="28" height="16" rx="3" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5"/>
        <circle cx="34" cy="13" r="5" fill="#3b82f6" stroke="#2563eb" strokeWidth="1"/>
        <rect x="30" y="9" width="8" height="2" rx="0.5" fill="#fff"/>
      </svg>
    ),
    flash: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="34" cy="13" rx="12" ry="9" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5"/>
        <path d="M28 5 L40 5" stroke="#f59e0b" strokeWidth="2"/>
        <path d="M34 5 L34 1" stroke="#dc2626" strokeWidth="1.5"/>
      </svg>
    ),
    hegren: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="34" cy="14" rx="12" ry="8" fill="#166534" stroke="#14532d" strokeWidth="1.5"/>
        <path d="M28 7 L40 7" stroke="#14532d" strokeWidth="2"/>
        <path d="M34 7 L34 2" stroke="#dc2626" strokeWidth="1.5"/>
      </svg>
    ),
    smoke: (
      <svg className={className} viewBox="0 0 80 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="34" cy="14" rx="12" ry="8" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5"/>
        <path d="M30 7 Q34 3 38 7" stroke="#4b5563" strokeWidth="1.5"/>
        <path d="M32 5 Q34 1 36 5" stroke="#4b5563" strokeWidth="1"/>
      </svg>
    ),
  };

  return svgs[id] || <svg className={className} viewBox="0 0 80 24" fill="none" stroke="#666" strokeWidth="1.5"><rect x="2" y="8" width="76" height="8" rx="2"/></svg>;
}

type Weapon = {
  id: string;
  name: string;
  slot: "primary" | "secondary" | "equipment";
  price: number;
  damage: number;
  armorPen: string;
  fireRate: string;
  clip: string;
  range: string;
  recoil: string;
};

const WEAPONS: Weapon[] = [
  { id: "ak47", name: "AK-47", slot: "primary", price: 2500, damage: 36, armorPen: "85%", fireRate: "600 RPM", clip: "30", range: "2000", recoil: "High" },
  { id: "m4a1", name: "M4A1", slot: "primary", price: 3100, damage: 33, armorPen: "75%", fireRate: "666 RPM", clip: "30", range: "2000", recoil: "Medium" },
  { id: "awp", name: "AWP", slot: "primary", price: 4750, damage: 115, armorPen: "97%", fireRate: "41 RPM", clip: "10", range: "8000", recoil: "Very High" },
  { id: "scout", name: "Scout", slot: "primary", price: 2750, damage: 75, armorPen: "85%", fireRate: "41 RPM", clip: "10", range: "8000", recoil: "High" },
  { id: "famas", name: "FAMAS", slot: "primary", price: 2250, damage: 30, armorPen: "70%", fireRate: "750 RPM", clip: "25", range: "1500", recoil: "Medium" },
  { id: "galil", name: "Galil", slot: "primary", price: 2000, damage: 30, armorPen: "70%", fireRate: "750 RPM", clip: "35", range: "1500", recoil: "Medium" },
  { id: "aug", name: "AUG", slot: "primary", price: 3500, damage: 32, armorPen: "80%", fireRate: "666 RPM", clip: "30", range: "2000", recoil: "Medium" },
  { id: "sg552", name: "SG-552", slot: "primary", price: 3500, damage: 32, armorPen: "80%", fireRate: "666 RPM", clip: "30", range: "2000", recoil: "Medium" },
  { id: "mp5", name: "MP5 Navy", slot: "primary", price: 1500, damage: 26, armorPen: "60%", fireRate: "750 RPM", clip: "30", range: "1000", recoil: "Low" },
  { id: "tmp", name: "TMP", slot: "primary", price: 1250, damage: 26, armorPen: "60%", fireRate: "857 RPM", clip: "30", range: "1000", recoil: "Low" },
  { id: "m3", name: "M3", slot: "primary", price: 1700, damage: 80, armorPen: "90%", fireRate: "20 RPM", clip: "8", range: "1500", recoil: "Very High" },
  { id: "xm1014", name: "XM1014", slot: "primary", price: 3000, damage: 60, armorPen: "85%", fireRate: "159 RPM", clip: "7", range: "1500", recoil: "High" },
  { id: "deagle", name: "Desert Eagle", slot: "secondary", price: 650, damage: 54, armorPen: "93%", fireRate: "222 RPM", clip: "7", range: "1500", recoil: "Very High" },
  { id: "usp", name: "USP", slot: "secondary", price: 500, damage: 34, armorPen: "75%", fireRate: "352 RPM", clip: "12", range: "1500", recoil: "Medium" },
  { id: "glock", name: "Glock 18", slot: "secondary", price: 400, damage: 25, armorPen: "47%", fireRate: "1200 RPM", clip: "20", range: "1000", recoil: "Low" },
  { id: "p228", name: "P228", slot: "secondary", price: 600, damage: 32, armorPen: "75%", fireRate: "500 RPM", clip: "13", range: "1500", recoil: "Medium" },
  { id: "elite", name: "Dual Elites", slot: "secondary", price: 800, damage: 36, armorPen: "75%", fireRate: "750 RPM", clip: "30", range: "1000", recoil: "Medium" },
  { id: "fiveseven", name: "Five-Seven", slot: "secondary", price: 750, damage: 27, armorPen: "60%", fireRate: "500 RPM", clip: "20", range: "1500", recoil: "Low" },
  { id: "vest", name: "Kevlar", slot: "equipment", price: 650, damage: 0, armorPen: "N/A", fireRate: "N/A", clip: "N/A", range: "N/A", recoil: "N/A" },
  { id: "vesthelm", name: "Kevlar+Helm", slot: "equipment", price: 1000, damage: 0, armorPen: "N/A", fireRate: "N/A", clip: "N/A", range: "N/A", recoil: "N/A" },
  { id: "defuser", name: "Defuse Kit", slot: "equipment", price: 200, damage: 0, armorPen: "N/A", fireRate: "N/A", clip: "N/A", range: "N/A", recoil: "N/A" },
  { id: "flash", name: "Flashbang", slot: "equipment", price: 200, damage: 0, armorPen: "N/A", fireRate: "N/A", clip: "N/A", range: "N/A", recoil: "N/A" },
  { id: "hegren", name: "HE Grenade", slot: "equipment", price: 300, damage: 98, armorPen: "N/A", fireRate: "N/A", clip: "N/A", range: "N/A", recoil: "N/A" },
  { id: "smoke", name: "Smoke", slot: "equipment", price: 300, damage: 0, armorPen: "N/A", fireRate: "N/A", clip: "N/A", range: "N/A", recoil: "N/A" },
];

export default function WeaponDatabase() {
  const [selected, setSelected] = useState<string | null>(null);
  const weapon = WEAPONS.find((w) => w.id === selected);

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-300 mb-3">Weapons</p>
        <div className="space-y-0.5 max-h-[500px] overflow-y-auto pr-1">
          {WEAPONS.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelected(w.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded border transition-all flex items-center gap-2",
                selected === w.id
                  ? "border-orange-500 bg-orange-500/10 text-orange-200"
                  : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
              )}
            >
              <WeaponSVG id={w.id} className="w-10 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-bold truncate">{w.name}</div>
                <div className="text-[10px] text-zinc-400">${w.price} · {w.slot}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        {weapon ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-20 h-10 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center p-1">
                <WeaponSVG id={weapon.id} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-amber-100">{weapon.name}</h3>
                <p className="text-xs text-zinc-400">${weapon.price} · {weapon.slot}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {Object.entries(weapon).filter(([k]) => k !== "id" && k !== "name" && k !== "slot").map(([key, val]) => (
                <div key={key} className="flex items-center justify-between px-3 py-2 rounded bg-zinc-950 border border-zinc-800">
                  <code className="text-xs font-mono text-orange-300 capitalize">{key}</code>
                  <code className="text-xs font-mono text-amber-200">{String(val)}</code>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔫</div>
            <p className="text-xs font-mono text-zinc-400">Select a weapon to view stats</p>
          </div>
        )}
      </div>
    </div>
  );
}
