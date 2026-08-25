// Deterministic pixel-art avatars from a name seed — GitHub-identicon style,
// rendered as SVG. 5x5 mirrored grid, clan-colored.

function hashName(name: string): number {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const CLAN_COLORS: Record<string, [string, string]> = {
  "SK Gaming": ["#f59e0b", "#78350f"],
  "fnatic": ["#f97316", "#431407"],
  "fnatic / NiP": ["#f97316", "#431407"],
  "fnatic / SK": ["#f97316", "#431407"],
  "NiP": ["#eab308", "#422006"],
  "Natus Vincere": ["#facc15", "#422006"],
  "Natus Vincere / HellRaisers": ["#facc15", "#422006"],
  "Team 3D": ["#ef4444", "#450a0a"],
  "compLexity": ["#ef4444", "#450a0a"],
  "Team 3D / NoA": ["#ef4444", "#450a0a"],
  "Team 3D / compLexity": ["#ef4444", "#450a0a"],
  "mTw": ["#3b82f6", "#1e3a8a"],
  "NoA": ["#8b5cf6", "#2e1065"],
  "WeMade FOX / mTw": ["#3b82f6", "#1e3a8a"],
  "mTw / NoA": ["#3b82f6", "#1e3a8a"],
  "SK Gaming / NiP": ["#f59e0b", "#78350f"],
  "SK Gaming / GoL": ["#f59e0b", "#78350f"],
  "GoL": ["#f59e0b", "#78350f"],
  "International": ["#6b7280", "#1f2937"],
  "Pre-1.6": ["#6b7280", "#1f2937"],
};

export default function ProAvatar({
  name,
  clan,
  size = 36,
}: {
  name: string;
  clan: string;
  size?: number;
}) {
  const h = hashName(name);
  const fg = CLAN_COLORS[clan]?.[0] ?? "#fb923c";
  const bg = CLAN_COLORS[clan]?.[1] ?? "#27272a";

  // build 3x5 half-grid (mirrored to 5x5)
  const cells: boolean[] = [];
  let bits = h;
  for (let i = 0; i < 15; i++) {
    cells.push((bits & 1) === 1);
    bits >>>= 1;
  }
  // ensure some density
  const filled = cells.filter(Boolean).length;
  if (filled < 6) {
    for (let i = 0; i < 15 && cells.filter(Boolean).length < 8; i++) {
      if (!cells[i]) cells[i] = ((h >> (i + 7)) & 1) === 1;
    }
  }

  const rects: JSX.Element[] = [];
  const cellSize = 10;
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 5; row++) {
      if (cells[col * 5 + row]) {
        rects.push(
          <rect
            key={`${col}-${row}`}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill={fg}
          />
        );
        if (col < 2) {
          // mirror col 0->4, 1->3
          rects.push(
            <rect
              key={`m${col}-${row}`}
              x={(4 - col) * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fg}
            />
          );
        }
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="rounded-md flex-shrink-0 border border-zinc-700"
      style={{ backgroundColor: bg }}
      aria-label={`${name} avatar`}
    >
      {rects}
    </svg>
  );
}
