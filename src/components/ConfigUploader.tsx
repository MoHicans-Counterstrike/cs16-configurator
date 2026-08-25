import { useRef, useState } from "react";
import { cn } from "../utils/cn";

// Upload your own config.cfg / autoexec.cfg / userconfig.cfg — values are
// parsed from console commands and applied to the generator state.
export default function ConfigUploader({ onApply }: { onApply: (values: Record<string, string>) => void }) {
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setInfo(null);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      const values: Record<string, string> = {};
      let found = 0;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("//")) continue;

        // match: cvar "value" or cvar value
        const m = trimmed.match(/^(\w+)\s+"?([^"]+)"?$/);
        if (!m) continue;
        const [, cvar, value] = m;
        if (value && value !== "") {
          values[cvar] = value;
          found++;
        }
      }

      if (found === 0) {
        setError("No CVARs found in file. Make sure it's a valid CS 1.6 config.");
        return;
      }

      setInfo(`Loaded ${found} values from ${file.name}`);
      onApply(values);
    } catch (e) {
      setError(`Failed to read file: ${e.message}`);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
      <p className="text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
        Upload your config
      </p>
      <p className="text-[10px] font-mono text-zinc-300 mb-3 leading-relaxed">
        Drop a <code className="text-amber-300">.cfg</code> file (autoexec.cfg, config.cfg,
        userconfig.cfg) — your values are parsed and applied to the generator. 100% local.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".cfg,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full px-4 py-3 rounded border border-dashed border-zinc-600 hover:border-orange-500/50 bg-zinc-900/30 hover:bg-zinc-900/60 text-zinc-300 hover:text-orange-300 text-xs font-mono transition-all"
      >
        ↓ click to upload .cfg
      </button>
      {info && (
        <p className="mt-2 text-[10px] font-mono text-emerald-400">✓ {info}</p>
      )}
      {error && (
        <p className="mt-2 text-[10px] font-mono text-red-400">✕ {error}</p>
      )}
    </div>
  );
}
