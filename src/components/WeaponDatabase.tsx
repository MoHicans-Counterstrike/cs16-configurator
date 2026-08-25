import { useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 Weapon Database — damage, armor penetration, fire rate
type Weapon = {
  id: string;
  name: string;
  slot: "primary" | "secondary";
  price: number;
  damage: number;
  armorPen: number; // 0-1
  fireRate: number; // rounds per second
  clipSize: number;
  reserve: number;
  recoil: "low" | "medium" | "high";
  range: number; // 0-100
};

const WEAPONS: Weapon[] = [
  { id: "ak47", name: "AK-47", slot: "primary", price: 2500, damage: 36, armorPen: 0.78, fireRate: 10, clipSize: 30, reserve: 90, recoil: "high", range: 85 },
  { id: "m4a1", name: "M4A1", slot: "primary", price: 3100, damage: 33, armorPen: 0.68, fireRate: 9, clipSize: 30, reserve: 90, recoil: "medium", range: 80 },
  { id: "awp", name: "AWP", slot: "primary", price: 4750, damage: 115, armorPen: 0.98, fireRate: 0.6, clipSize: 10, reserve: 30, recoil: "high", range: 100 },
  { id: "scout", name: "Scout", slot: "primary", price: 2750, damage: 75, armorPen: 0.85, fireRate: 1.2, clipSize: 10, reserve: 30, recoil: "medium", range: 90 },
  { id: "famas", name: "FAMAS", slot: "primary", price: 2250, damage: 30, armorPen: 0.65, fireRate: 9, clipSize: 25, reserve: 75, recoil: "medium", range: 70 },
  { id: "galil", name: "Galil", slot: "primary", price: 2000, damage: 30, armorPen: 0.65, fireRate: 9, clipSize: 35, reserve: 90, recoil: "medium", range: 70 },
  { id: "aug", name: "AUG", slot: "primary", price: 3500, damage: 32, armorPen: 0.70, fireRate: 8, clipSize: 30, reserve: 90, recoil: "medium", range: 82 },
  { id: "sg552", name: "SG-552", slot: "primary", price: 3500, damage: 35, armorPen: 0.72, fireRate: 8, clipSize: 30, reserve: 90, recoil: "medium", range: 84 },
  { id: "mp5", name: "MP5 Navy", slot: "primary", price: 1500, damage: 26, armorPen: 0.55, fireRate: 10, clipSize: 30, reserve: 120, recoil: "low", range: 60 },
  { id: "tmp", name: "TMP", slot: "primary", price: 1250, damage: 26, armorPen: 0.55, fireRate: 10, clipSize: 30, reserve: 120, recoil: "low", range: 55 },
  { id: "m3", name: "M3", slot: "primary", price: 1700, damage: 54, armorPen: 0.60, fireRate: 0.8, clipSize: 8, reserve: 32, recoil: "high", range: 50 },
  { id: "xm1014", name: "XM1014", slot: "primary", price: 3000, damage: 42, armorPen: 0.55, fireRate: 1.5, clipSize: 7, reserve: 32, recoil: "medium", range: 40 },
  { id: "deagle", name: "Desert Eagle", slot: "secondary", price: 650, damage: 54, armorPen: 0.78, fireRate: 2, clipSize: 7, reserve: 35, recoil: "high", range: 70 },
  { id: "usp", name: "USP", slot: "secondary", price: 500, damage: 32, armorPen: 0.65, fireRate: 3, clipSize: 12, reserve: 24, recoil: "medium", range: 65 },
  { id: "glock", name: "Glock 18", slot: "secondary", price: 400, damage: 25, armorPen: 0.50, fireRate: 10, clipSize: 20, reserve: 40, recoil: "low", range: 50 },
  { id: "p228", name: "P228", slot: "secondary", price: 600, damage: 32, armorPen: 0.60, fireRate: 3, clipSize: 13, reserve: 26, recoil: "medium", range: 60 },
  { id: "elite", name: "Dual Elites", slot: "secondary", price: 800, damage: 30, armorPen: 0.55, fireRate: 6, clipSize: 30, reserve: 60, recoil: "medium", range: 55 },
  { id: "fiveseven", name: "Five-Seven", slot: "secondary", price: 750, damage: 28, armorPen: 0.55, fireRate: 4, clipSize: 20, reserve: 40, recoil: "low", range: 55 },
];

export default function WeaponDatabase() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "primary" | "secondary">("all");
  const weapon = WEAPONS.find((w) => w.id === selected);

  const filtered = WEAPONS.filter((w) => filter === "all" || w.slot === filter);

  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="flex gap-1 mb-3">
          {(["all", "primary", "secondary"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-mono border transition-all",
                filter === f
                  ? "border-orange-500 bg-orange-500/10 text-orange-200"
                  : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelected(w.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded border transition-all",
                selected === w.id
                  ? "border-orange-500 bg-orange-500/10 text-orange-200"
                  : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">{w.name}</span>
                <span className="text-[10px] text-zinc-500">${w.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        {weapon ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-xl">
                🔫
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-100">{weapon.name}</h3>
                <p className="text-xs text-zinc-400">{weapon.slot} · ${weapon.price}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Stat label="Damage" value={weapon.damage} max={120} color="red" />
              <Stat label="Armor Pen" value={Math.round(weapon.armorPen * 100)} max={100} color="orange" />
              <Stat label="Fire Rate" value={weapon.fireRate} max={10} color="yellow" />
              <Stat label="Clip Size" value={weapon.clipSize} max={35} color="blue" />
              <Stat label="Recoil" value={weapon.recoil} type="text" />
              <Stat label="Range" value={weapon.range} max={100} color="green" />
            </div>
            <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
              <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Reserve Ammo</p>
              <p className="text-sm font-mono text-amber-200">{weapon.reserve} rounds</p>
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

function Stat({ label, value, max, color, type }: { label: string; value: number | string; max?: number; color?: string; type?: "text" }) {
  const pct = max && typeof value === "number" ? (value / max) * 100 : 0;
  return (
    <div className="bg-zinc-950 rounded p-3 border border-zinc-800">
      <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">{label}</div>
      {type === "text" ? (
        <div className={cn("text-sm font-mono font-bold", value === "low" ? "text-emerald-400" : value === "medium" ? "text-yellow-400" : "text-red-400")}>
          {String(value)}
        </div>
      ) : (
        <>
          <div className="text-sm font-mono font-bold text-amber-100">{value}</div>
          <div className="w-full bg-zinc-800 rounded-full h-1 mt-1">
            <div
              className={cn("h-1 rounded-full", color === "red" && "bg-red-500", color === "orange" && "bg-orange-500", color === "yellow" && "bg-yellow-500", color === "blue" && "bg-blue-500", color === "green" && "bg-emerald-500")}
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
