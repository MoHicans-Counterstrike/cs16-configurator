// URL state: encode only NON-default values (delta) as compact key:value pairs.
// Much shorter than base64-JSON of the whole object.
import { categories } from "../data/settings";

const DEFAULTS: Record<string, string | number | boolean> = (() => {
  const d: Record<string, string | number | boolean> = {};
  for (const cat of categories) for (const s of cat.settings) d[s.key] = s.default;
  return d;
})();

export function getDefaults() {
  return { ...DEFAULTS };
}

export function encodeState(values: Record<string, string | number | boolean>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(values)) {
    if (!(k in DEFAULTS)) continue;
    if (DEFAULTS[k] === v) continue; // only deltas
    parts.push(`${k}:${encodeURIComponent(String(v))}`);
  }
  return parts.join("~");
}

export function decodeState(encoded: string): Record<string, string | number | boolean> | null {
  try {
    if (!encoded) return null;
    const out: Record<string, string | number | boolean> = {};
    for (const part of encoded.split("~")) {
      const idx = part.indexOf(":");
      if (idx < 1) continue;
      const key = part.slice(0, idx);
      let raw = decodeURIComponent(part.slice(idx + 1));
      if (!(key in DEFAULTS)) continue;
      const def = DEFAULTS[key];
      // coerce back to the default's type
      if (typeof def === "boolean") out[key] = raw === "1" || raw === "true";
      else if (typeof def === "number") {
        const n = Number(raw);
        out[key] = Number.isNaN(n) ? def : n;
      } else out[key] = raw;
    }
    return out;
  } catch {
    return null;
  }
}
