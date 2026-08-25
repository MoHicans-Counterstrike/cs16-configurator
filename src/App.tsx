import { useState, useMemo, useEffect } from "react";
import {
  categories,
  generateConfig,
  getInitialValues,
  presets,
  applyPreset,
  type Category,
} from "./data/settings";
import { cn } from "./utils/cn";
import NetworkTicker from "./components/NetworkTicker";
import CrosshairPreview from "./components/CrosshairPreview";
import EdpiMeter from "./components/EdpiMeter";
import LegendsSidebar from "./components/LegendsSidebar";
import DemoUploader from "./components/DemoUploader";
import ConfigUploader from "./components/ConfigUploader";
import BindsBuilder from "./components/BindsBuilder";
import Leaderboard from "./components/Leaderboard";
import NetcodeCalc from "./components/NetcodeCalc";
import LaunchOptions from "./components/LaunchOptions";
import ProConfigs from "./components/ProConfigs";
import ProDatabase from "./components/ProDatabase";
import WeaponDatabase from "./components/WeaponDatabase";
import NetGraphAnalyzer from "./components/NetGraphAnalyzer";
import CrosshairGallery from "./components/CrosshairGallery";
import ServerBrowser from "./components/ServerBrowser";
import RoundTimer from "./components/RoundTimer";
import TeamSpeakEmbed from "./components/TeamSpeakEmbed";
import { encodeState, decodeState } from "./utils/urlState";
import { getLegendById } from "./data/legends";

function SettingControl({
  setting,
  value,
  onChange,
}: {
  setting: any;
  value: string | number | boolean;
  onChange: (v: string | number | boolean) => void;
}) {
  if (setting.type === "toggle") {
    const boolVal = Boolean(value);
    return (
      <button
        type="button"
        onClick={() => onChange(!boolVal)}
        className={cn(
          "relative w-14 h-7 rounded-full transition-all duration-200 flex-shrink-0",
          boolVal
            ? "bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]"
            : "bg-zinc-700 border border-zinc-600"
        )}
        aria-pressed={boolVal}
      >
        <span
          className={cn(
            "absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-200 shadow-md",
            boolVal ? "left-7" : "left-0.5"
          )}
        />
      </button>
    );
  }

  if (setting.type === "select") {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 hover:border-orange-500/50 focus:border-orange-500 text-amber-100 rounded px-3 py-1.5 text-sm font-mono focus:outline-none transition-colors min-w-[200px]"
      >
        {setting.options?.map((opt: any) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (setting.type === "number") {
    const numVal = Number(value);
    return (
      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
        <input
          type="range"
          min={setting.min}
          max={setting.max}
          step={setting.step}
          value={numVal}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-orange-500 h-1.5"
        />
        <div className="font-mono text-amber-300 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 min-w-[60px] text-center text-sm">
          {numVal}
          {setting.unit && <span className="text-zinc-300 ml-0.5 text-xs">{setting.unit}</span>}
        </div>
      </div>
    );
  }

  return null;
}

function SettingRow({ setting, value, onChange }: { setting: any; value: any; onChange: any }) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div className="group border-b border-zinc-800/70 py-3.5 hover:bg-zinc-900/40 transition-colors px-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-amber-100 font-medium text-sm">{setting.name}</span>
            <code className="text-xs font-mono text-orange-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
              {setting.key}
            </code>
            {setting.proTip && (
              <button
                type="button"
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                className="relative text-orange-500 hover:text-orange-400 text-xs"
                aria-label="Pro tip"
              >
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-orange-500/50 hover:border-orange-400">
                  ?
                </span>
                {showTip && (
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-zinc-950 border border-orange-500/40 text-amber-100 text-xs p-2.5 rounded shadow-xl whitespace-normal w-64">
                    <span className="text-orange-400 font-semibold">Pro tip:</span> {setting.proTip}
                  </span>
                )}
              </button>
            )}
          </div>
          <p className="text-zinc-300 text-xs mt-1 leading-relaxed">{setting.description}</p>
        </div>
        <div className="lg:flex-shrink-0 flex items-center">
          <SettingControl setting={setting} value={value} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

function CategoryPanel({
  category,
  values,
  onChange,
}: {
  category: Category;
  values: Record<string, any>;
  onChange: (key: string, val: any) => void;
}) {
  return (
    <div>
      <div className="mb-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-amber-100">{category.name}</h2>
            <p className="text-zinc-300 text-sm">{category.description}</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-transparent">
        {category.settings.map((s) => (
          <SettingRow key={s.key} setting={s} value={values[s.key]} onChange={(v: any) => onChange(s.key, v)} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial = getInitialValues();
    // restore shared config from ?p=
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("p");
    if (shared) {
      const decoded = decodeState(shared);
      if (decoded) return { ...initial, ...decoded };
    }
    return initial;
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [pageTab, setPageTab] = useState<"config" | "binds" | "rank" | "demo" | "netcode" | "launch" | "proconfigs" | "prodb" | "weapons" | "netgraph" | "crosshair" | "server" | "ts3" | "timer">("config");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [crtMode, setCrtMode] = useState<"off" | "mild" | "full">("mild");
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  // fetch download counter once
  useEffect(() => {
    fetch("/api/count", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setDownloadCount(d.count))
      .catch(() => {});
  }, []);

  const config = useMemo(() => generateConfig(values), [values]);

  const handleChange = (key: string, val: any) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => setValues(getInitialValues());

  const handleDownload = () => {
    const blob = new Blob([config], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autoexec.cfg";
    a.click();
    URL.revokeObjectURL(url);
    // fire-and-forget counter bump (best effort)
    fetch("/api/count", { method: "POST" }).catch(() => {});
    setDownloadCount((c) => (c === null ? null : c + 1));
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?p=${encodeState(values)}`;
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {}
  };

  const handleLegend = (id: string) => {
    const legend = getLegendById(id);
    if (legend) setValues((prev) => ({ ...prev, ...legend.overrides }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const currentCategory = categories.find((c) => c.id === activeTab)!;

  const handlePreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) setValues(applyPreset(getInitialValues(), preset));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-amber-50 font-sans relative overflow-x-hidden">
      <NetworkTicker />

      {/* Scanline overlay for CRT vibe */}
      {crtMode !== "off" && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            opacity: crtMode === "full" ? 0.12 : 0.04,
            transition: "opacity 300ms",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)",
          }}
        />
      )}
      {crtMode === "full" && (
        <div
          className="fixed inset-0 pointer-events-none z-50 animate-pulse"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 60%, rgba(251,146,60,0.05) 100%)",
          }}
        />
      )}

      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,146,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Mohicans brand banner — image anchored to TOP edge (text visible at top) */}
      <header className="relative min-h-[240px] sm:min-h-[280px] lg:min-h-[320px] overflow-hidden border-b border-zinc-800 bg-zinc-950">
        <img
          src="/images/mohicans-logo.jpg"
          alt="Mohicans tactical logo banner"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(9,9,11,0.35) 0%, rgba(9,9,11,0.45) 45%, rgba(9,9,11,0.95) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-14 sm:pt-10 sm:pb-16 flex items-end min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]">
          <div className="w-full flex items-end justify-between flex-wrap gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-lg font-black text-zinc-950 shadow-[0_0_25px_rgba(251,146,60,0.4)] flex-shrink-0 leading-none">
                  1.6
                </div>
                <span className="text-[10px] sm:text-xs text-orange-400 font-mono tracking-[0.24em] uppercase">
                  Mohicans competitive command center
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-amber-50 leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                THE MOHICAN <span className="text-orange-500">CS 1.6</span> CONFIGURATOR
              </h1>
              <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mt-1.5">
                Tournament-grade autoexec.cfg — FPS, hit registration, pure competitive performance.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Page tabs — clean underline bar */}
        <div className="mb-3 flex gap-1 border-b border-zinc-800">
          {([
            { id: "config", label: "Config" },
            { id: "binds", label: "Binds & Buy" },
            { id: "server", label: "Server" },
            { id: "rank", label: "Ranks" },
            { id: "demo", label: "Demo Analyzer" },
            { id: "netcode", label: "Netcode" },
            { id: "launch", label: "Launch Options" },
            { id: "prodb", label: "Pro Database" },
            { id: "weapons", label: "Weapons" },
            { id: "netgraph", label: "Net Graph" },
            { id: "crosshair", label: "Crosshair" },
            { id: "ts3", label: "TeamSpeak" },
            { id: "timer", label: "Timer" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setPageTab(t.id as any)}
              className={cn(
                "px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 -mb-px whitespace-nowrap",
                pageTab === t.id
                  ? "border-orange-500 text-orange-300"
                  : "border-transparent text-zinc-300 hover:text-zinc-100"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {pageTab === "binds" && <BindsBuilder />}
        {pageTab === "rank" && <Leaderboard />}
        {pageTab === "demo" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <DemoUploader />
              <p className="mt-3 text-[10px] font-mono text-zinc-300 leading-relaxed">
                Drop any .dem from Counter-Strike (1.6, CZ, Condition Zero) or other GoldSrc games. Header is read locally — nothing is uploaded.
              </p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 text-[11px] font-mono text-zinc-300 space-y-2">
              <p className="text-orange-400 text-xs uppercase tracking-wider">About CS 1.6 demos</p>
              <p><code className="text-amber-300">.dem</code> files record every player's actions on the server.</p>
            </div>
          </div>
        )}
        {pageTab === "netcode" && <NetcodeCalc />}
        {pageTab === "launch" && <LaunchOptions />}
        {pageTab === "proconfigs" && <ProConfigs />}
        {pageTab === "prodb" && <ProDatabase />}
        {pageTab === "weapons" && <WeaponDatabase />}
        {pageTab === "netgraph" && <NetGraphAnalyzer />}
        {pageTab === "crosshair" && <CrosshairGallery />}
        {pageTab === "server" && <ServerBrowser />}
        {pageTab === "ts3" && <TeamSpeakEmbed />}
        {pageTab === "timer" && <RoundTimer />}

        {pageTab === "config" && (
        <>
        {/* Action bar */}
        <div className="mb-3 flex gap-2 flex-wrap items-center bg-zinc-900/60 border border-zinc-700 rounded-lg px-3 py-2.5">
          <button onClick={handleDownload} className="px-5 py-2 rounded bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(251,146,60,0.35)]">↓ DOWNLOAD autoexec.cfg</button>
          <button onClick={handleCopy} className="px-4 py-2 rounded border border-orange-500/50 hover:bg-orange-500/10 text-orange-300 hover:text-orange-200 text-sm font-mono transition-colors">{copied ? "✓ COPIED" : "COPY CONFIG"}</button>
          <button onClick={handleShare} className="px-4 py-2 rounded border border-sky-500/50 hover:bg-sky-500/10 text-sky-300 hover:text-sky-200 text-sm font-mono transition-colors" title="Copy a link that restores this exact config">{shareCopied ? "✓ LINK COPIED" : "🔗 SHARE"}</button>
          <div className="flex-1" />
          <button onClick={handleReset} className="px-3 py-2 rounded border border-zinc-700 hover:border-red-500/50 text-zinc-300 hover:text-red-300 text-xs font-mono transition-colors">RESET</button>
        </div>

        {/* Presets + Counter + CRT */}
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider">Presets:</span>
          <div className="flex gap-1.5 flex-wrap">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePreset(preset.id)}
                title={preset.description}
                className="group relative px-2.5 py-1 rounded border border-zinc-700 hover:border-orange-500 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-amber-100 text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <span>{preset.icon}</span>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {downloadCount !== null && (
              <span className="text-[10px] text-orange-400/80 font-mono">
                ⬇ {downloadCount.toLocaleString()} configs generated
              </span>
            )}
            <button
              onClick={() =>
                setCrtMode((m) => (m === "off" ? "mild" : m === "mild" ? "full" : "off"))
              }
              title="CRT scanline effect (off / mild / full)"
              className={cn(
                "px-2.5 py-1 rounded text-xs font-mono border transition-colors",
                crtMode === "off"
                  ? "border-zinc-700 text-zinc-300"
                  : crtMode === "full"
                  ? "border-orange-500 text-orange-300 bg-orange-500/10"
                  : "border-zinc-600 text-zinc-300"
              )}
            >
              📺 CRT: {crtMode.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr_380px] gap-4">
          <nav className="lg:sticky lg:top-4 lg:self-start h-fit">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                <p className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Categories</p>
              </div>
              <div className="p-2">
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={cn("w-full text-left px-3 py-2.5 rounded flex items-center gap-3 mb-1 transition-all group", activeTab === cat.id ? "bg-gradient-to-r from-orange-500/20 to-transparent border-l-2 border-orange-500 text-amber-100" : "hover:bg-zinc-800/50 text-zinc-300 hover:text-amber-100")}>
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{cat.name}</div>
                      <div className="text-xs text-zinc-300 truncate">{cat.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <LegendsSidebar onLoad={handleLegend} />
            <div className="mt-4 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-lg p-4">
              <div className="text-xs font-mono text-orange-400 uppercase mb-2">Quick Install</div>
              <ol className="text-xs text-zinc-300 space-y-1.5 font-mono list-decimal list-inside">
                <li>Download autoexec.cfg</li>
                <li>Move to cstrike/ folder</li>
                <li>Launch with -console</li>
                <li>Type: exec autoexec</li>
              </ol>
            </div>
          </nav>

          <main className="min-w-0">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
              <CategoryPanel category={currentCategory} values={values} onChange={handleChange} />
            </div>
          </main>

          <aside className="lg:sticky lg:top-4 lg:self-start h-fit space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                <p className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Crosshair Preview</p>
                <p className="text-xs text-zinc-300 mt-0.5">live — changes with HUD settings</p>
              </div>
              <div className="p-3">
                <CrosshairPreview size={String(values["cl_crosshair_size"] ?? "small")} color={String(values["cl_crosshair_color"] ?? "50 250 50")} translucent={Number(values["cl_crosshair_translucent"] ?? 0)} dynamic={!!values["cl_dynamiccrosshair"]} />
                <EdpiMeter sensitivity={Number(values["sensitivity"] ?? 2.1)} />
              </div>
            </div>
            <ConfigUploader onApply={(v) => setValues((prev) => ({ ...prev, ...v }))} />
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Live Config</p>
                  <p className="text-xs text-zinc-300 mt-0.5">autoexec.cfg</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
              </div>
              <pre className="p-4 text-xs font-mono text-amber-100/80 leading-relaxed max-h-[70vh] overflow-auto whitespace-pre-wrap break-all">
                <code>{config.split("\n").map((line, i) => {
                  if (line.startsWith("//")) return <div key={i} className="text-zinc-300">{line}</div>;
                  const [cmd, ...rest] = line.split(/\s+/);
                  if (!cmd) return <div key={i}>&nbsp;</div>;
                  return <div key={i}><span className="text-orange-400">{cmd}</span> <span className="text-amber-100/60">{rest.join(" ")}</span></div>;
                })}</code>
              </pre>
            </div>
          </aside>
        </div>
        </>
        )}

        {/* Footer tips — single compact strip */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 items-center bg-zinc-900/40 border border-zinc-800 rounded-lg px-4 py-3 text-[11px] font-mono text-zinc-300">
          <span>
            <span className="text-orange-400 uppercase">Launch:</span>{" "}
            <code className="text-amber-100">-novid -console -freq 144 +fps_max 0</code>
          </span>
          <span>
            <span className="text-orange-400 uppercase">Install:</span> cstrike/ folder →{" "}
            <code className="text-amber-100">exec autoexec</code>
          </span>
          <span className="ml-auto">
            <span className="text-orange-400 uppercase">Mouse:</span> raw input on · 400–800 DPI · 1000Hz ·
            eDPI ~880
          </span>
        </div>

        <footer className="mt-3 pb-4 text-center">
          <p className="text-[10px] text-zinc-700 font-mono">
            // MOHICAN CS 1.6 CONFIGURATOR · BUILT FOR COMPETITORS ·{" "}
            <a
              href="https://github.com/svdbrom/counterstrike/actions/workflows/deploy.yml"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:text-orange-400 transition-colors underline decoration-dotted"
            >
              build &amp; deploy status ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/svdbrom/counterstrike"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:text-orange-400 transition-colors underline decoration-dotted"
            >
              source ↗
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
