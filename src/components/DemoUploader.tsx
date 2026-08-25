import { useRef, useState } from "react";
import { parseDemoHeader, type DemoInfo } from "../utils/demoParser";
import { cn } from "../utils/cn";

// Drag & drop .dem uploader — parses the HLDEMO header client-side.
export default function DemoUploader() {
  const [info, setInfo] = useState<DemoInfo | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFileName(f.name);
    setInfo(await parseDemoHeader(f));
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors",
        dragging
          ? "border-orange-500 bg-orange-500/10"
          : "border-zinc-700 hover:border-zinc-500 bg-zinc-950/40"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".dem"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {!info ? (
        <div className="text-xs font-mono text-zinc-300">
          <span className="text-orange-400">drop a .dem</span> or click — GoldSrc demo header analysis,
          runs 100% locally
        </div>
      ) : info.valid ? (
        <div className="text-left text-[11px] font-mono space-y-0.5">
          <div className="flex justify-between gap-2">
            <span className="text-zinc-300">file</span>
            <span className="text-amber-100 truncate max-w-[200px]">{fileName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-300">map</span>
            <span className="text-orange-300">{info.map}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-300">mod</span>
            <span className="text-sky-300">{info.gameDir}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-300">net proto</span>
            <span className="text-zinc-300">{info.netProtocol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-300">size</span>
            <span className="text-zinc-300">{((info.sizeBytes ?? 0) / 1024 / 1024).toFixed(1)} MB</span>
          </div>
        </div>
      ) : (
        <div className="text-xs font-mono text-red-400">{info.error}</div>
      )}
    </div>
  );
}
