import { useState, useEffect } from "react";
import { cn } from "../utils/cn";

// Round Timer / Bomb Plant Trainer
const ROUND_TIMES = [
  { label: "Bomb Timer", seconds: 40, color: "red" },
  { label: "Round Start", seconds: 5, color: "blue" },
  { label: "Freeze Time", seconds: 3, color: "cyan" },
  { label: "Buy Time", seconds: 15, color: "green" },
];

export default function RoundTimer() {
  const [selected, setSelected] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIMES[0].seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running, timeLeft]);

  const reset = () => {
    setRunning(false);
    setTimeLeft(ROUND_TIMES[selected].seconds);
  };

  const selectTimer = (idx: number) => {
    setSelected(idx);
    setRunning(false);
    setTimeLeft(ROUND_TIMES[idx].seconds);
  };

  const progress = (timeLeft / ROUND_TIMES[selected].seconds) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-6">
        <div className="flex gap-2 mb-4">
          {ROUND_TIMES.map((t, i) => (
            <button
              key={i}
              onClick={() => selectTimer(i)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-mono border transition-all",
                selected === i
                  ? "border-orange-500 bg-orange-500/10 text-orange-200"
                  : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="text-center">
          <div className="text-6xl font-mono font-black text-amber-100 mb-2">
            {timeLeft}
          </div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
            {ROUND_TIMES[selected].label}
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                ROUND_TIMES[selected].color === "red" && "bg-red-500",
                ROUND_TIMES[selected].color === "blue" && "bg-blue-500",
                ROUND_TIMES[selected].color === "cyan" && "bg-cyan-500",
                ROUND_TIMES[selected].color === "green" && "bg-emerald-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setRunning(!running)}
              className={cn(
                "px-6 py-2 rounded font-bold text-sm font-mono transition-all",
                running
                  ? "bg-red-500/20 border border-red-500/50 text-red-300"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950"
              )}
            >
              {running ? "⏸ PAUSE" : "▶ START"}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded border border-zinc-700 text-zinc-300 text-sm font-mono hover:border-zinc-500"
            >
              ↺ RESET
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
        <p className="text-xs font-mono text-zinc-400">
          Use this timer to practice bomb plant timing, round start positioning, and buy phase management.
          The bomb timer counts down from 40 seconds — the time you have before the bomb explodes.
        </p>
      </div>
    </div>
  );
}
