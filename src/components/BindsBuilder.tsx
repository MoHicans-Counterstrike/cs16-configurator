import { useMemo, useState } from "react";
import { cn } from "../utils/cn";

// CS 1.6 Weapon SVG Icons (inline)
function WeaponSVG({ id, className }: { id: string; className?: string }) {
  const svgMap: Record<string, JSX.Element> = {
    ak47: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="35" height="6" rx="1" /><rect x="38" y="9" width="22" height="8" rx="2" /><rect x="8" y="16" width="8" height="6" rx="1" /><rect x="20" y="4" width="3" height="6" /><circle cx="48" cy="13" r="2" /></svg>,
    m4a1: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="40" height="5" rx="1" /><rect x="42" y="8" width="18" height="9" rx="2" /><rect x="10" y="15" width="7" height="7" rx="1" /><rect x="22" y="5" width="3" height="5" /><circle cx="50" cy="12.5" r="2" /></svg>,
    awp: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="11" width="55" height="4" rx="1" /><circle cx="48" cy="13" r="3" /><rect x="20" y="5" width="4" height="6" rx="1" /><rect x="26" y="7" width="6" height="4" rx="1" /><rect x="10" y="15" width="8" height="5" rx="1" /></svg>,
    scout: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="11" width="50" height="4" rx="1" /><circle cx="44" cy="13" r="3" /><rect x="18" y="5" width="4" height="6" rx="1" /><rect x="8" y="15" width="7" height="5" rx="1" /></svg>,
    famas: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="32" height="5" rx="1" /><rect x="34" y="8" width="20" height="9" rx="2" /><rect x="8" y="15" width="7" height="7" rx="1" /><rect x="18" y="4" width="3" height="6" /></svg>,
    galil: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="35" height="6" rx="1" /><rect x="38" y="8" width="22" height="9" rx="2" /><rect x="10" y="16" width="8" height="6" rx="1" /></svg>,
    aug: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="38" height="6" rx="1" /><rect x="40" y="8" width="20" height="9" rx="2" /><rect x="10" y="16" width="7" height="7" rx="1" /><rect x="22" y="4" width="6" height="6" rx="1" /></svg>,
    sg552: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="38" height="5" rx="1" /><rect x="40" y="8" width="20" height="9" rx="2" /><rect x="10" y="15" width="7" height="7" rx="1" /><rect x="22" y="4" width="6" height="6" rx="1" /></svg>,
    mp5: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="30" height="5" rx="1" /><rect x="32" y="8" width="18" height="9" rx="2" /><rect x="8" y="15" width="7" height="7" rx="1" /></svg>,
    tmp: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="28" height="5" rx="1" /><rect x="30" y="8" width="18" height="9" rx="2" /><rect x="10" y="15" width="7" height="7" rx="1" /></svg>,
    m3: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="9" width="45" height="7" rx="2" /><rect x="47" y="8" width="14" height="9" rx="2" /><rect x="10" y="16" width="8" height="6" rx="1" /><circle cx="25" cy="12.5" r="3" /></svg>,
    xm1014: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="9" width="48" height="7" rx="2" /><rect x="50" y="8" width="12" height="9" rx="2" /><rect x="10" y="16" width="8" height="6" rx="1" /><circle cx="28" cy="12.5" r="3" /></svg>,
    deagle: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="9" width="35" height="6" rx="1" /><rect x="10" y="15" width="8" height="7" rx="1" /><rect x="22" y="6" width="3" height="3" rx="1" /></svg>,
    usp: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="30" height="5" rx="1" /><rect x="8" y="15" width="7" height="7" rx="1" /><rect x="18" y="6" width="3" height="4" /></svg>,
    glock: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="28" height="5" rx="1" /><rect x="8" y="15" width="7" height="7" rx="1" /></svg>,
    p228: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="32" height="5" rx="1" /><rect x="8" y="15" width="7" height="7" rx="1" /></svg>,
    elite: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="8" width="25" height="5" rx="1" /><rect x="30" y="12" width="25" height="5" rx="1" /><rect x="8" y="13" width="6" height="7" rx="1" /><rect x="35" y="17" width="6" height="7" rx="1" /></svg>,
    fiveseven: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="30" height="5" rx="1" /><rect x="8" y="15" width="7" height="7" rx="1" /></svg>,
    vest: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4 L20 2 L44 2 L54 4 L50 20 L40 22 L24 22 L14 20 Z" /><path d="M20 2 L20 22" /><path d="M44 2 L44 22" /></svg>,
    vesthelm: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="32" cy="8" r="8" /><path d="M20 12 L20 22 L44 22 L44 12" /></svg>,
    defuser: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="20" y="6" width="24" height="14" rx="2" /><circle cx="32" cy="13" r="4" /><rect x="28" y="9" width="8" height="2" /></svg>,
    flash: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="22" y="6" width="20" height="14" rx="2" /><path d="M32 8 L32 18" /><path d="M28 12 L36 12" /><circle cx="32" cy="13" r="2" /></svg>,
    hegren: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="32" cy="13" rx="10" ry="8" /><path d="M28 6 L36 6" /><path d="M32 6 L32 2" /></svg>,
    smoke: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="32" cy="14" rx="10" ry="7" /><path d="M28 8 Q32 4 36 8" /><path d="M30 6 Q32 2 34 6" /></svg>,
    primammo: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="24" y="8" width="16" height="10" rx="1" /><rect x="28" y="4" width="8" height="4" /></svg>,
    secammo: <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="26" y="10" width="12" height="8" rx="1" /><rect x="29" y="7" width="6" height="3" /></svg>,
  };

  return svgMap[id] || <svg className={className} viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="8" width="60" height="8" rx="2" /></svg>;
}

// Weapon data (CS 1.6 buy menu)
type Weapon = {
  id: string;
  name: string;
  slot: "primary" | "secondary" | "equipment";
  price: number;
  bind: string;
};

const WEAPONS: Weapon[] = [
  { id: "ak47", name: "AK-47", slot: "primary", price: 2500, bind: "ak47" },
  { id: "m4a1", name: "M4A1", slot: "primary", price: 3100, bind: "m4a1" },
  { id: "awp", name: "AWP", slot: "primary", price: 4750, bind: "awp" },
  { id: "scout", name: "Scout", slot: "primary", price: 2750, bind: "scout" },
  { id: "famas", name: "FAMAS", slot: "primary", price: 2250, bind: "famas" },
  { id: "galil", name: "Galil", slot: "primary", price: 2000, bind: "galil" },
  { id: "aug", name: "AUG", slot: "primary", price: 3500, bind: "aug" },
  { id: "sg552", name: "SG-552", slot: "primary", price: 3500, bind: "sg552" },
  { id: "mp5", name: "MP5 Navy", slot: "primary", price: 1500, bind: "mp5" },
  { id: "tmp", name: "TMP", slot: "primary", price: 1250, bind: "tmp" },
  { id: "m3", name: "M3", slot: "primary", price: 1700, bind: "m3" },
  { id: "xm1014", name: "XM1014", slot: "primary", price: 3000, bind: "xm1014" },
  { id: "deagle", name: "Desert Eagle", slot: "secondary", price: 650, bind: "deagle" },
  { id: "usp", name: "USP", slot: "secondary", price: 500, bind: "usp" },
  { id: "glock", name: "Glock 18", slot: "secondary", price: 400, bind: "glock" },
  { id: "p228", name: "P228", slot: "secondary", price: 600, bind: "p228" },
  { id: "elite", name: "Dual Elites", slot: "secondary", price: 800, bind: "elite" },
  { id: "fiveseven", name: "Five-Seven", slot: "secondary", price: 750, bind: "fiveseven" },
  { id: "vest", name: "Kevlar", slot: "equipment", price: 650, bind: "vest" },
  { id: "vesthelm", name: "Kevlar+Helm", slot: "equipment", price: 1000, bind: "vesthelm" },
  { id: "defuser", name: "Defuse Kit", slot: "equipment", price: 200, bind: "defuser" },
  { id: "flash", name: "Flashbang", slot: "equipment", price: 200, bind: "flash" },
  { id: "hegren", name: "HE Grenade", slot: "equipment", price: 300, bind: "hegren" },
  { id: "smoke", name: "Smoke", slot: "equipment", price: 300, bind: "sgren" },
  { id: "primammo", name: "Primary Ammo", slot: "equipment", price: 60, bind: "primammo" },
  { id: "secammo", name: "Pistol Ammo", slot: "equipment", price: 25, bind: "secammo" },
];

const CT_WEAPONS = ["m4a1", "aug", "famas", "galil", "mp5", "tmp", "m3", "xm1014", "scout", "awp", "deagle", "usp", "p228", "elite", "fiveseven", "vest", "vesthelm", "defuser", "flash", "hegren", "smoke", "primammo", "secammo"];
const T_WEAPONS = ["ak47", "sg552", "famas", "galil", "mp5", "tmp", "m3", "xm1014", "scout", "awp", "deagle", "glock", "p228", "elite", "fiveseven", "vest", "vesthelm", "flash", "hegren", "smoke", "primammo", "secammo"];

const KEYBOARD_ROWS = [
  ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
  ["SHIFT", "CTRL", "ALT", "SPACE"],
];

const MODIFIERS = ["SHIFT", "CTRL", "ALT"];

const PRESET_COMBOS = [
  { name: "Full ECO", items: "vest;deagle;secammo", desc: "Pistol round upgrade" },
  { name: "Full BUY CT", items: "vesthelm;flash;flash;hegren;sgren;m4a1;primammo;deagle;secammo;defuser", desc: "M4 full load" },
  { name: "Full BUY T", items: "vesthelm;flash;flash;hegren;sgren;ak47;primammo;deagle;secammo", desc: "AK full load" },
  { name: "AWP Load", items: "vesthelm;awp;primammo;deagle;secammo;flash;hegren", desc: "Sniper kit" },
  { name: "Force Buy", items: "vest;famas;galil;primammo;flash", desc: "Low money rush" },
  { name: "Nade Set", items: "flash;flash;hegren;sgren", desc: "Utility only" },
];

export default function BindsBuilder() {
  const [team, setTeam] = useState<"CT" | "T">("CT");
  const [binds, setBinds] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [modifier, setModifier] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const teamWeapons = useMemo(() => {
    const ids = team === "CT" ? CT_WEAPONS : T_WEAPONS;
    return WEAPONS.filter((w) => ids.includes(w.id));
  }, [team]);

  const teamTotal = useMemo(() => {
    let total = 0;
    for (const key in binds) {
      if (!binds[key]) continue;
      for (const part of binds[key].split(";")) {
        const bind = part.trim();
        const weapon = WEAPONS.find((w) => w.bind === bind);
        if (weapon) total += weapon.price;
      }
    }
    return total;
  }, [binds]);

  const generateScript = () => {
    let script = "// MOHICAN buyscript.cfg — generated by cfg.mohican.xyz\n";
    script += `// Team: ${team} · ${Object.keys(binds).length} binds · $${teamTotal} total\n\n`;
    for (const key in binds) {
      if (!binds[key]) continue;
      script += `bind "${key}" "${binds[key]}"\n`;
    }
    script += '\n// quick-buy from anywhere\nalias "buy_full" "buy"\n';
    return script;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleKeyClick = (key: string) => {
    if (MODIFIERS.includes(key)) {
      setModifier(modifier === key ? null : key);
    } else {
      const fullKey = modifier ? `${modifier}+${key}` : key;
      setEditingKey(editingKey === fullKey ? null : fullKey);
    }
  };

  const weaponsBySlot = useMemo(() => ({
    primary: teamWeapons.filter((w) => w.slot === "primary"),
    secondary: teamWeapons.filter((w) => w.slot === "secondary"),
    equipment: teamWeapons.filter((w) => w.slot === "equipment"),
  }), [teamWeapons]);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="flex gap-1 mb-4">
          {(["CT", "T"] as const).map((t) => (
            <button key={t} onClick={() => setTeam(t)} className={cn("px-4 py-2 rounded text-sm font-mono border transition-all", team === t ? (t === "CT" ? "bg-sky-500/15 border-sky-500/50 text-sky-300" : "bg-amber-500/15 border-amber-500/50 text-amber-300") : "border-zinc-700 text-zinc-300 hover:text-zinc-100")}>
              {t === "CT" ? "Counter-Terrorist" : "Terrorist"}
            </button>
          ))}
          <div className="flex-1" />
          <button onClick={handleCopy} className={cn("px-4 py-2 rounded border text-sm font-mono transition-all", copied ? "border-emerald-500 text-emerald-300 bg-emerald-500/10" : "border-orange-500/50 text-orange-300 hover:bg-orange-500/10")}>
            {copied ? "✓ COPIED" : "↓ COPY BUYSCRIPT"}
          </button>
        </div>

        {modifier && (
          <div className="mb-3 px-3 py-2 rounded bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
            Modifier: <span className="font-bold">{modifier}</span> — click a key for {modifier}+Key
          </div>
        )}

        <div className="bg-zinc-950/50 rounded-lg p-3 mb-4">
          <p className="text-[10px] font-mono text-zinc-500 mb-2 uppercase tracking-wider">Keyboard</p>
          <div className="space-y-1">
            {KEYBOARD_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-0.5 justify-center flex-wrap">
                {row.map((key) => {
                  const fullKey = modifier ? `${modifier}+${key}` : key;
                  const isActive = editingKey === fullKey;
                  const hasBind = binds[fullKey];
                  const isMod = MODIFIERS.includes(key);
                  const isWide = key === "SPACE" || key === "SHIFT" || key === "CTRL" || key === "ALT";
                  return (
                    <button key={key} onClick={() => handleKeyClick(key)} className={cn("px-1.5 py-1.5 rounded text-[10px] font-mono transition-all min-w-[28px] border", isWide && "px-3", isActive ? "border-orange-500 bg-orange-500/15 text-orange-200" : hasBind ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : isMod ? "border-violet-500/30 bg-violet-500/5 text-violet-300" : "border-zinc-700/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200")} title={hasBind || "empty"}>
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {editingKey ? (
          <div className="border-t border-zinc-800 pt-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-zinc-300">
                Editing: <span className="text-orange-300 font-bold">{editingKey}</span>
              </p>
              <div className="flex gap-1">
                {PRESET_COMBOS.map((pc) => (
                  <button key={pc.name} onClick={() => setBinds((prev) => ({ ...prev, [editingKey]: pc.items }))} title={pc.desc} className="px-2 py-1 rounded border border-violet-500/40 hover:border-violet-400 bg-violet-500/5 text-[9px] font-mono text-violet-300 transition-colors">
                    {pc.name}
                  </button>
                ))}
              </div>
            </div>
            {(["primary", "secondary", "equipment"] as const).map((slot) => (
              <div key={slot} className="mb-3">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">{slot}</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                  {weaponsBySlot[slot].map((w) => (
                    <button key={w.id} onClick={() => { const cur = binds[editingKey] || ""; const next = cur ? `${cur};${w.bind}` : w.bind; setBinds((prev) => ({ ...prev, [editingKey]: next })); }} className="px-2 py-1.5 rounded border border-zinc-700 hover:border-orange-500/50 bg-zinc-900/50 text-[10px] font-mono text-zinc-300 hover:text-amber-100 transition-all flex items-center gap-1.5">
                      <WeaponSVG id={w.id} className="w-6 h-3 flex-shrink-0" />
                      <span className="truncate flex-1">{w.name}</span>
                      <span className="text-zinc-500 text-[9px]">${w.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] font-mono text-zinc-500 italic text-center py-4">
            Click a key above to start building buy binds
          </p>
        )}
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-zinc-300">Active Binds</p>
          <span className="text-[10px] font-mono text-emerald-400">${teamTotal}</span>
        </div>
        <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
          {Object.keys(binds).filter((k) => binds[k]).length === 0 ? (
            <p className="text-[10px] font-mono text-zinc-500 italic">No binds yet — click a key</p>
          ) : (
            Object.entries(binds).filter(([, v]) => v).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 py-1.5 px-2 rounded bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] font-mono text-orange-300 w-16 flex-shrink-0 truncate">{key}</span>
                <span className="text-[10px] font-mono text-zinc-400 truncate flex-1">{val}</span>
                <button onClick={() => setBinds((prev) => ({ ...prev, [key]: "" }))} className="text-zinc-600 hover:text-red-400 text-xs flex-shrink-0">✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
