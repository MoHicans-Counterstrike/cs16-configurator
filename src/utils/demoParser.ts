// Minimal GoldSrc / HL1 demo (.dem) header parser — pure client-side.
// Format reference: https://github.com/YaLTeR/hldemo-rs and community docs.
//
// Header layout (little-endian):
//   0x00  8 bytes  magic "HLDEMO\0"
//   0x08  4 bytes  demo protocol version (e.g. 5)
//   0x0C  4 bytes  network protocol (e.g. 48)
//   0x10  260 bytes map name (null-terminated)
//   0x114 260 bytes game directory (cstrike, czero, ...)
//   0x218 4 bytes  map checksum
//   0x21C 64 bytes client directory (enginedir)
// After that: directory entries / playback frames.

export interface DemoInfo {
  valid: boolean;
  magic?: string;
  demoProtocol?: number;
  netProtocol?: number;
  map?: string;
  gameDir?: string;
  engineDir?: string;
  sizeBytes?: number;
  error?: string;
}

function readCString(buf: DataView, offset: number, maxLen: number): string {
  let out = "";
  for (let i = 0; i < maxLen; i++) {
    const b = buf.getUint8(offset + i);
    if (b === 0) break;
    out += String.fromCharCode(b);
  }
  return out.trim();
}

export async function parseDemoHeader(file: File): Promise<DemoInfo> {
  const info: DemoInfo = { valid: false, sizeBytes: file.size };
  // Header region we care about is < 2KB; slice instead of loading whole file.
  const head = await file.slice(0, 2048).arrayBuffer();
  const view = new DataView(head);

  if (head.byteLength < 0x25C) {
    info.error = "File too small to be a Half-Life demo";
    return info;
  }

  const magic = readCString(view, 0, 8);
  if (magic !== "HLDEMO") {
    info.error = `Bad magic "${magic}" — expected HLDEMO. Not a GoldSrc demo.`;
    return info;
  }

  info.valid = true;
  info.magic = magic;
  info.demoProtocol = view.getInt32(0x08, true);
  info.netProtocol = view.getInt32(0x0C, true);
  info.map = readCString(view, 0x10, 260);
  info.gameDir = readCString(view, 0x114, 260);
  info.engineDir = readCString(view, 0x21C, 64);
  return info;
}

// Rough duration estimate: HL demos record ~64 frames/sec of network frames,
// but frame rate varies. We don't parse full frames here (heavy); instead we
// offer bytes-per-second heuristic only if we later parse directories. Skip.
