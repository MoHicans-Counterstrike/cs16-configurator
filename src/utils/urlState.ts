// URL state: encode/decode the full values object as base64 JSON in ?p=
export function encodeState(values: Record<string, string | number | boolean>): string {
  try {
    const json = JSON.stringify(values);
    // btoa with unicode safety
    return btoa(String.fromCharCode(...new TextEncoder().encode(json)));
  } catch {
    return "";
  }
}

export function decodeState(encoded: string): Record<string, string | number | boolean> | null {
  try {
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
