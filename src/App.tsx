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
import LegendsRow from "./components/LegendsRow";
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
          {setting.unit && <span className="text-zinc-500 ml-0.5 text-xs">{setting.unit}</span>}
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
        <div className="flex-1 min-w-0">
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
          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{setting.description}</p>
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
            <p className="text-zinc-400 text-sm">{category.description}</p>
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
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [crtMode, setCrtMode] = useState<"mild" | "full">("mild");
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
      {/* Scanline overlay for CRT vibe */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          opacity: crtMode === "full" ? 0.12 : 0.04,
          transition: "opacity 300ms",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)",
        }}
      />
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

      {/* Mohicans brand banner */}
      <header className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] overflow-hidden border-b border-zinc-800 bg-zinc-950">
        <img
          src="/images/mohicans-logo.jpg"
          alt="Mohicans tactical logo banner"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-10 min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] flex items-end">
          <div className="w-full flex items-end justify-between flex-wrap gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-xl sm:text-2xl font-black text-zinc-950 shadow-[0_0_30px_rgba(251,146,60,0.4)]">
                  1.6
                </div>
                <span className="text-xs sm:text-sm text-orange-400 font-mono tracking-[0.24em] uppercase">
                  Mohicans competitive command center
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-amber-50 leading-tight">
                THE MOHICAN CS 1.6 PRO SETTINGS CONFIGURATOR
              </h1>
              <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mt-3">
                Build a tournament-grade Counter-Strike 1.6 config optimized for FPS, hit registration,
                and pure competitive performance. Based on settings used by CS legends.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => setCrtMode((m) => (m === "mild" ? "full" : "mild"))}
                title="Toggle CRT effect intensity"
                className={cn(
                  "px-3 py-2 rounded border text-sm font-mono transition-colors bg-zinc-900/50",
                  crtMode === "full"
                    ? "border-orange-500/70 text-orange-300"
                    : "border-zinc-700 text-zinc-400 hover:text-amber-100"
                )}
              >
                {crtMode === "full" ? "📺 CRT: FULL" : "📺 CRT: MILD"}
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded border border-sky-500/50 hover:bg-sky-500/10 text-sky-300 hover:text-sky-200 text-sm font-mono transition-colors bg-zinc-900/50"
                title="Copy a link that restores this exact config"
              >
                {shareCopied ? "✓ LINK COPIED" : "🔗 SHARE CONFIG"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded border border-zinc-700 hover:border-orange-500/50 text-zinc-300 hover:text-amber-100 text-sm font-mono transition-colors bg-zinc-900/50"
              >
                RESET
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded border border-orange-500/50 hover:bg-orange-500/10 text-orange-300 hover:text-orange-200 text-sm font-mono transition-colors bg-zinc-950/70"
              >
                {copied ? "✓ COPIED" : "COPY CONFIG"}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:shadow-[0_0_30px_rgba(251,146,60,0.5)]"
              >
                ↓ DOWNLOAD autoexec.cfg
              </button>
            </div>
          </div>
        </div>
      </header>

      <NetworkTicker />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Presets */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Presets:</span>
            <div className="flex gap-2 flex-wrap">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePreset(preset.id)}
                  title={preset.description}
                  className="group relative px-3 py-1.5 rounded border border-zinc-700 hover:border-orange-500 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-amber-100 text-xs font-mono transition-all flex items-center gap-2"
                >
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-500 italic">
            Click a preset to load a pro-verified configuration. You can customize further after.
            {downloadCount !== null && (
              <span className="ml-2 text-orange-400/80 font-mono not-italic">
                ⬇ {downloadCount.toLocaleString()} configs generated
              </span>
            )}
          </p>
        </div>

        <LegendsRow onLoad={handleLegend} />

        <div className="grid lg:grid-cols-[260px_1fr_380px] gap-4">
          {/* Left nav */}
          <nav className="lg:sticky lg:top-4 lg:self-start h-fit">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Categories</p>
              </div>
              <div className="p-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded flex items-center gap-3 mb-1 transition-all group",
                      activeTab === cat.id
                        ? "bg-gradient-to-r from-orange-500/20 to-transparent border-l-2 border-orange-500 text-amber-100"
                        : "hover:bg-zinc-800/50 text-zinc-400 hover:text-amber-100"
                    )}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{cat.name}</div>
                      <div className="text-xs text-zinc-500 truncate">{cat.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-lg p-4">
              <div className="text-xs font-mono text-orange-400 uppercase mb-2">Quick Install</div>
              <ol className="text-xs text-zinc-400 space-y-1.5 font-mono list-decimal list-inside">
                <li>Download autoexec.cfg</li>
                <li>Move to cstrike/ folder</li>
                <li>Launch with -console</li>
                <li>Type: exec autoexec</li>
              </ol>
            </div>
          </nav>

          {/* Main settings panel */}
          <main className="min-w-0">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
              <CategoryPanel
                category={currentCategory}
                values={values}
                onChange={handleChange}
              />
            </div>
          </main>

          {/* Right: live config preview */}
          <aside className="lg:sticky lg:top-4 lg:self-start h-fit space-y-4">
            {/* Crosshair live preview */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Crosshair Preview</p>
                <p className="text-xs text-zinc-400 mt-0.5">live — changes with HUD settings</p>
              </div>
              <div className="p-3">
                <CrosshairPreview
                  size={String(values["cl_crosshair_size"] ?? "small")}
                  color={String(values["cl_crosshair_color"] ?? "50 250 50")}
                  translucent={Number(values["cl_crosshair_translucent"] ?? 0)}
                  dynamic={Boolean(values["cl_dynamiccrosshair"])}
                />
                <EdpiMeter sensitivity={Number(values["sensitivity"] ?? 2.1)} />
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur">
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Live Config</p>
                  <p className="text-xs text-zinc-400 mt-0.5">autoexec.cfg</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
              </div>
              <pre className="p-4 text-xs font-mono text-amber-100/80 leading-relaxed max-h-[70vh] overflow-auto whitespace-pre-wrap break-all">
                <code>{config.split("\n").map((line, i) => {
                  if (line.startsWith("//")) {
                    return (
                      <div key={i} className="text-zinc-500">
                        {line}
                      </div>
                    );
                  }
                  const [cmd, ...rest] = line.split(/\s+/);
                  if (!cmd) return <div key={i}>&nbsp;</div>;
                  return (
                    <div key={i}>
                      <span className="text-orange-400">{cmd}</span>
                      {rest.length > 0 && (
                        <>
                          {" "}
                          <span className="text-amber-200">{rest.join(" ")}</span>
                        </>
                      )}
                    </div>
                  );
                })}</code>
              </pre>
            </div>
          </aside>
        </div>

        {/* Footer tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
            <div className="text-orange-500 font-mono text-xs uppercase mb-2">Launch Options</div>
            <code className="text-xs text-amber-100 font-mono block bg-black/40 rounded p-2 break-all">
              -game cstrike -width 1024 -height 768 -freq 144 -novid -console -nojoy +fps_max 0
            </code>
            <p className="text-xs text-zinc-500 mt-2">Right-click CS 1.6 in Steam → Properties → Launch Options</p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
            <div className="text-orange-500 font-mono text-xs uppercase mb-2">Console Commands</div>
            <code className="text-xs text-amber-100 font-mono block bg-black/40 rounded p-2 space-y-0.5">
              <div>exec autoexec</div>
              <div>echo "Config loaded!"</div>
              <div>writeip</div>
            </code>
            <p className="text-xs text-zinc-500 mt-2">Open console with ~ key to run these.</p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
            <div className="text-orange-500 font-mono text-xs uppercase mb-2">Mouse Setup</div>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Disable "Enhance pointer precision"</li>
              <li>• Set DPI: 400–800 (pro standard)</li>
              <li>• 1000Hz polling rate</li>
              <li>• eDPI = DPI × sensitivity</li>
              <li>• Target eDPI: ~880 (ideal)</li>
            </ul>
          </div>
        </div>

        <footer className="mt-8 pb-8 text-center">
          <p className="text-xs text-zinc-600 font-mono">
            // THE MOHICAN CS 1.6 PRO SETTINGS CONFIGURATOR · BUILT FOR COMPETITORS · 2000—2026
          </p>
        </footer>
      </div>
    </div>
  );
}
