import { useMemo, useState } from "react";
import { cn } from "../utils/cn";

// ─── Weapon data (CS 1.6 buy menu) ───
type Weapon = {
  id: string;
  name: string;
  slot: "primary" | "secondary" | "gear" | "grenade";
  price: number;
  bind: string;
};

const WEAPONS: Weapon[] = [
  { id: "glock", name: "Glock 18", slot: "secondary", price: 400, bind: "glock" },
  { id: "usp", name: "USP .45", slot: "secondary", price: 500, bind: "usp" },
  { id: "p228", name: "SIG P228", slot: "secondary", price: 600, bind: "p228" },
  { id: "deagle", name: "Desert Eagle", slot: "secondary", price: 650, bind: "deagle" },
  { id: "fiveseven", name: "FN Five-SeveN", slot: "secondary", price: 750, bind: "fiveseven" },
  { id: "elite", name: "Dual Elites", slot: "secondary", price: 800, bind: "elites" },
  { id: "m3", name: "M3 Super 90", slot: "primary", price: 1700, bind: "m3" },
  { id: "xm1014", name: "XM1014", slot: "primary", price: 3000, bind: "xm1014" },
  { id: "mac10", name: "MAC-10", slot: "primary", price: 1400, bind: "mac10" },
  { id: "tmp", name: "Steyr TMP", slot: "primary", price: 1250, bind: "tmp" },
  { id: "mp5", name: "MP5 Navy", slot: "primary", price: 1500, bind: "mp5" },
  { id: "ump45", name: "UMP 45", slot: "primary", price: 1700, bind: "ump45" },
  { id: "p90", name: "FN P90", slot: "primary", price: 2350, bind: "p90" },
  { id: "galil", name: "Galil", slot: "primary", price: 2000, bind: "galil" },
  { id: "famas", name: "Famas", slot: "primary", price: 2250, bind: "famas" },
  { id: "ak47", name: "AK-47", slot: "primary", price: 2500, bind: "ak47" },
  { id: "m4a1", name: "Colt M4A1", slot: "primary", price: 3100, bind: "m4a1" },
  { id: "sg552", name: "SG 552", slot: "primary", price: 3500, bind: "sg552" },
  { id: "aug", name: "Steyr AUG", slot: "primary", price: 3500, bind: "aug" },
  { id: "scout", name: "Scout", slot: "primary", price: 2750, bind: "scout" },
  { id: "awp", name: "AWP", slot: "primary", price: 4750, bind: "awp" },
  { id: "sg550", name: "SG 550", slot: "primary", price: 4200, bind: "sg550" },
  { id: "g3sg1", name: "G3/SG-1", slot: "primary", price: 5000, bind: "g3sg1" },
  { id: "m249", name: "M249 PARA", slot: "primary", price: 5750, bind: "m249" },
];

const GEAR = [
  { id: "vest", name: "Kevlar", price: 650, bind: "vest", emoji: "🦺" },
  { id: "vesthelm", name: "Kevlar+Helm", price: 1000, bind: "vesthelm", emoji: "🪖" },
  { id: "defuser", name: "Defuse Kit", price: 200, bind: "defuser", emoji: "✂️" },
  { id: "flash", name: "Flashbang", price: 200, bind: "flash", emoji: "⚡" },
  { id: "hegren", name: "HE Grenade", price: 300, bind: "hegren", emoji: "💥" },
  { id: "smoke", name: "Smoke", price: 300, bind: "sgren", emoji: "🌫️" },
  { id: "primammo", name: "Primary Ammo", price: 60, bind: "primammo", emoji: "🔸" },
  { id: "secammo", name: "Pistol Ammo", price: 25, bind: "secammo", emoji: "🔹" },
];

const KEY_OPTIONS = [
  "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",
  "KP_END","KP_DOWNARROW","KP_PGDN","KP_LEFTARROW","KP_5","KP_RIGHTARROW",
  "KP_HOME","KP_UPARROW","KP_PGUP","KP_INS","KP_DEL","KP_ENTER",
  "MOUSE3","MOUSE4","MOUSE5","MWHEELUP","MWHEELDOWN",
  "CAPSLOCK","SHIFT","CTRL","ALT","B","V","C","X","Z","O","P","H","T","G",
];

// classic full-loadout combos from the golden era buy scripts
const PRESET_COMBOS = [
  { name: "Full ECO", items: "vest;deagle;secammo", desc: "Pistol round upgrade" },
  { name: "Full BUY CT", items: "vesthelm;flash;flash;hegren;sgren;m4a1;primammo;deagle;secammo;defuser", desc: "M4 full load" },
  { name: "Full BUY T", items: "vesthelm;flash;flash;hegren;sgren;ak47;primammo;deagle;secammo", desc: "AK full load" },
  { name: "AWP Load", items: "vesthelm;awp;primammo;deagle;secammo;flash;hegren", desc: "Sniper kit" },
  { name: "Force Buy", items: "vest;famas;galil;primammo;flash", desc: "Low money rush" },
  { name: "Nade Set", items: "flash;flash;hegren;sgren", desc: "Utility only" },
];

function WeaponSVG({ id }: { id: string }) {
  const c = "#d4d4d8";
  switch (id) {
    case "ak47":
      return (
        <svg viewBox="0 0 64 24" className="w-full h-full">
          <rect x="4" y="9" width="44" height="4" fill={c} />
          <polygon points="48,9 62,11 62,13 48,13" fill={c} />
          <path d="M10 13 L14 21 L18 21 L16 13 Z" fill="#7a4a26" />
          <rect x="22" y="6" width="12" height="3" fill={c} />
        </svg>
      );
    case "m4a1":
      return (
        <svg viewBox="0 0 64 24" className="w-full h-full">
          <rect x="4" y="9" width="42" height="4" fill={c} />
          <polygon points="46,9 60,11 60,13 46,13" fill={c} />
          <path d="M8 13 L12 20 L20 20 L17 13 Z" fill="#333" />
          <rect x="24" y="5" width="10" height="4" fill={c} />
          <rect x="52" y="7" width="6" height="2" fill={c} />
        </svg>
      );
    case "awp":
      return (
        <svg viewBox="0 0 64 24" className="w-full h-full">
          <rect x="2" y="10" width="56" height="3.5" fill="#2e5339" />
          <polygon points="58,10 64,12 64,13 58,13" fill="#2e5339" />
          <rect x="18" y="4" width="20" height="4" rx="2" fill="#111" />
          <path d="M10 13 L14 21 L20 21 L17 13 Z" fill="#2e5339" />
        </svg>
      );
    case "scout":
      return (
        <svg viewBox="0 0 64 24" className="w-full h-full">
          <rect x="6" y="10" width="50" height="3" fill="#5a6b52" />
          <polygon points="56,10 63,11.5 63,12.5 56,12.5" fill="#5a6b52" />
          <rect x="20" y="5" width="16" height="3.5" rx="1.5" fill="#111" />
          <path d="M12 13 L15 19 L21 19 L18 13 Z" fill="#5a6b52" />
        </svg>
      );
    default:
      if (["usp", "glock", "deagle", "p228", "fiveseven", "elite"].includes(id)) {
        return (
          <svg viewBox="0 0 64 24" className="w-full h-full">
            <rect x="18" y="7" width="28" height="6" rx="1" fill={c} />
            <path d="M20 13 L18 22 L27 22 L29 13 Z" fill="#3a3a3c" />
            <rect x="42" y="9" width="8" height="3" fill={c} />
          </svg>
        );
      }
      if (["m3", "xm1014"].includes(id)) {
        return (
          <svg viewBox="0 0 64 24" className="w-full h-full">
            <rect x="6" y="8" width="46" height="4" fill="#6b4423" />
            <rect x="6" y="13" width="34" height="3" fill={c} />
            <polygon points="52,8 62,10.5 62,13 52,12.5" fill="#6b4423" />
            <path d="M10 16 L13 22 L20 22 L18 15 Z" fill="#6b4423" />
          </svg>
        );
      }
      // generic SMG/rifle
      return (
        <svg viewBox="0 0 64 24" className="w-full h-full">
          <rect x="8" y="9" width="40" height="5" rx="1" fill={c} />
          <polygon points="48,9 60,11.5 60,14 48,13.5" fill={c} />
          <path d="M12 14 L15 21 L23 21 L20 14 Z" fill="#26262b" />
          <rect x="26" y="4" width="12" height="4" rx="1" fill={c} />
        </svg>
      );
  }
}

export default function BindsBuilder() {
  const [team, setTeam] = useState<"ct" | "t">("ct");
  const [binds, setBinds] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleItem = (key: string, itemBind: string) => {
    setBinds((prev) => {
      const cur = (prev[key] || "").split(";").filter(Boolean);
      let nextItems: string[];
      if (cur.includes(itemBind)) nextItems = cur.filter((i) => i !== itemBind);
      else nextItems = [...cur, itemBind];
      const next = { ...prev };
      if (!nextItems.length) delete next[key];
      else next[key] = nextItems.join(";");
      return next;
    });
  };

  const assignKey = (k: string) => {
    setEditingKey(k === editingKey ? null : k);
    if (!binds[k]) setBinds((prev) => ({ ...prev, [k]: "" }));
  };

  const generated = useMemo(() => {
    const lines = [
      "// ==============================================",
      "// MOHICAN BUY BINDS · cfg.mohican.xyz",
      "// Save as: cstrike/buyscript.cfg",
      '// Then add to autoexec.cfg:  exec buyscript',
      "// ==============================================",
      "",
    ];
    for (const [key, items] of Object.entries(binds)) {
      if (!items) continue;
      lines.push(`bind "${key}" "${items}"`);
    }
    lines.push("", 'echo "MOHICAN buy script loaded"');
    return lines.join("\n");
  }, [binds]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const teamWeapons = WEAPONS.filter((w) =>
    team === "ct"
      ? !["ak47", "galil", "sg552", "mac10", "elite"].includes(w.id)
      : !["m4a1", "famas", "aug", "tmp", "fiveseven"].includes(w.id)
  );

  const comboFor = (key: string) => binds[key] || "";

  return (
    <div className="space-y-3">
      {/* controls row */}
      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Team</span>
        <button
          onClick={() => setTeam("ct")}
          className={cn(
            "px-3 py-1 rounded text-xs font-mono border transition-colors",
            team === "ct" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400"
          )}
        >
          Counter-Terrorist
        </button>
        <button
          onClick={() => setTeam("t")}
          className={cn(
            "px-3 py-1 rounded text-xs font-mono border transition-colors",
            team === "t" ? "border-orange-500 text-orange-300 bg-orange-500/10" : "border-zinc-700 text-zinc-400"
          )}
        >
          Terrorist
        </button>
        <span className="ml-auto text-[10px] font-mono text-zinc-600">
          1. click a key · 2. toggle items
        </span>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-3">
        {/* key grid */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 h-fit">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Keys</p>
          <div className="grid grid-cols-3 gap-1">
            {KEY_OPTIONS.map((k) => (
              <button
                key={k}
                onClick={() => assignKey(k)}
                className={cn(
                  "rounded border px-1 py-1.5 text-center text-[9px] font-mono transition-colors truncate",
                  editingKey === k
                    ? "border-sky-500 bg-sky-500/10 text-sky-300"
                    : binds[k]
                    ? "border-orange-500/70 bg-orange-500/10 text-orange-300"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                )}
                title={binds[k] || k}
              >
                {k.replace("KP_", "").replace("DOWNARROW", "↓").replace("UPARROW", "↑").replace("LEFTARROW", "←").replace("RIGHTARROW", "→")}
              </button>
            ))}
          </div>
          {editingKey && (
            <p className="mt-2 text-[10px] font-mono text-zinc-500">
              editing <span className="text-sky-400">{editingKey}</span>:{" "}
              <span className="text-amber-300">{comboFor(editingKey).split(";").filter(Boolean).join(" + ") || "empty"}</span>
            </p>
          )}
        </div>

        {/* loadout picker */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
          {!editingKey ? (
            <p className="text-xs font-mono text-zinc-500 py-8 text-center">
              ← click a key to start building its loadout
            </p>
          ) : (
            <>
              {/* classic full-loadout combos */}
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                Classic combos (one-click full loadout)
              </p>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {PRESET_COMBOS.map((pc) => (
                  <button
                    key={pc.name}
                    onClick={() =>
                      setBinds((prev) => ({ ...prev, [editingKey]: pc.items }))
                    }
                    title={pc.desc}
                    className="px-2.5 py-1.5 rounded border border-violet-500/40 hover:border-violet-400 bg-violet-500/5 hover:bg-violet-500/15 text-[10px] font-mono text-violet-300 transition-colors"
                  >
                    {pc.name}
                  </button>
                ))}
                <button
                  onClick={() => setBinds((prev) => ({ ...prev, [editingKey]: "" }))}
                  className="px-2.5 py-1.5 rounded border border-zinc-700 hover:border-red-500/50 text-[10px] font-mono text-zinc-500 hover:text-red-300 transition-colors"
                >
                  clear key
                </button>
              </div>

              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Weapons</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 mb-3 max-h-64 overflow-y-auto pr-1">
                {teamWeapons.map((w) => {
                  const active = comboFor(editingKey).split(";").includes(w.bind);
                  return (
                    <button
                      key={w.id}
                      onClick={() => toggleItem(editingKey, w.bind)}
                      title={`${w.name} — $${w.price}`}
                      className={cn(
                        "flex flex-col p-1.5 rounded border transition-colors",
                        active ? "border-orange-500 bg-orange-500/10" : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
                      )}
                    >
                      <div className="w-full h-7 mb-1">
                        <WeaponSVG id={w.id} />
                      </div>
                      <div className="text-[9px] text-amber-100 truncate w-full">{w.name}</div>
                      <div className="text-[9px] font-mono text-emerald-400/80">${w.price}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Equipment</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {GEAR.map((g) => {
                  const active = comboFor(editingKey).split(";").includes(g.bind);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleItem(editingKey, g.bind)}
                      title={`${g.name} — $${g.price}`}
                      className={cn(
                        "flex flex-col items-center p-1.5 rounded border transition-colors",
                        active ? "border-sky-500 bg-sky-500/10" : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
                      )}
                    >
                      <span className="text-lg leading-none mb-1">{g.emoji}</span>
                      <span className="text-[8px] text-amber-100 truncate w-full text-center">{g.name}</span>
                      <span className="text-[8px] font-mono text-emerald-400/80">${g.price}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* output */}
      <div className="bg-black/60 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">buyscript.cfg</span>
          <button
            onClick={copy}
            className="px-3 py-1 rounded border border-orange-500/50 text-orange-300 hover:bg-orange-500/10 text-xs font-mono transition-colors"
          >
            {copied ? "✓ copied" : "copy"}
          </button>
        </div>
        <pre className="p-3 text-[11px] font-mono text-amber-100/80 leading-relaxed max-h-64 overflow-auto whitespace-pre-wrap">
          <code>{generated}</code>
        </pre>
      </div>
    </div>
  );
}
