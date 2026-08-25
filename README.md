# MOHICAN CS 1.6 Configurator

**The competitive config generator for Counter-Strike 1.6**

[![Counter-Strike](https://img.shields.io/badge/Counter--Strike-1.6-555555)](https://store.steampowered.com/app/10/CounterStrike/)
[![Engine](https://img.shields.io/badge/Engine-GoldSrc-555555)](https://en.wikipedia.org/wiki/GoldSrc)
[![React](https://img.shields.io/badge/React-18-555555)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-555555)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-555555)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-555555)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-555555)](LICENSE)

**Live:** [cfg.mohican.xyz](https://cfg.mohican.xyz)

---

A tournament-grade `autoexec.cfg` generator built on settings used by CS legends —
HeatoN, f0rest, Neo, GeT_RiGhT, markeloff and more. Optimized for FPS, hit
registration and pure competitive performance on the GoldSrc engine.

## Features

| | |
|---|---|
| **60+ tunable cvars** | Performance, network, mouse, video, HUD, sound, binds |
| **14 legend presets** | Documented pro configs grouped by clan (SK, fnatic, VP, Na'Vi) |
| **4 quick presets** | Classic Pro 2005, Max FPS Potato, Modern 100-Tick, AWPer Setup |
| **Live config preview** | Syntax-highlighted `autoexec.cfg`, updates as you tweak |
| **Crosshair POV tester** | Test your crosshair on dust2/inferno/nuke/train scenes |
| **eDPI calculator** | Live DPI x sensitivity with pro-average verdict meter |
| **Share URLs** | Config state encoded in the link — post it anywhere |
| **Network status bar** | Live CS server and TeamSpeak occupancy, QuakeNet IRC |
| **Single-file build** | Ships as one self-contained HTML file — zero backend |

## Quick Start

```bash
git clone https://github.com/svdbrom/counterstrike.git
cd counterstrike
npm install
npm run dev      # dev server
npm run build    # production build -> dist/index.html (single file)
```

### Install your generated config

1. Download `autoexec.cfg`
2. Drop it into your `cstrike/` folder
3. Launch CS 1.6 with `-console -novid`
4. In console: `exec autoexec`

### Recommended launch options

```
-game cstrike -width 1024 -height 768 -freq 144 -novid -console -nojoy +fps_max 0
```

## The nerdy details

- **GoldSrc netcode:** `cl_cmdrate 101` / `cl_updaterate 101` pairs perfectly with 100-tick servers
- **Raw input mandatory:** `m_rawinput 1` bypasses Windows mouse acceleration — no exceptions
- **eDPI sweet spot:** ~880 (`DPI x sensitivity`) — the pro average lives between 700–1200
- **4:3 stretched:** wider player models = easier heads. `1024x768` is the classic competitive pick
- **Zero interpolation:** `ex_interp 0.1` is the universal standard; `cl_interp 0` keeps lag comp tight

## Legend configs included

| Clan | Players |
|---|---|
| SK Gaming | HeatoN, fisker, ahl |
| fnatic / NiP | f0rest, GeT_RiGhT, Gux |
| Virtus.pro | Neo, TaZ, Loord |
| Natus Vincere | markeloff, Edward, Zeus |
| International | cyx, roman |

Values are community-documented approximations from public interviews and cfg
dumps of the era. Treat them as historically flavored starting points, not
gospel.

## Tech stack

`React 18` · `TypeScript` · `Vite 5` · `Tailwind CSS v4` · `vite-plugin-singlefile`

## Server components

The `server/` directory contains optional VPS-side tooling:

- `status.mjs` — polls the CS server (A2S via gamedig) and TeamSpeak 3
  ServerQuery, writes `status.json` for the network status bar
- `serve.py` — static file server with a `/api/count` download counter
- `reset-ts-pw.sh` — TS3 serveradmin query password reset helper

---

*Built for competitors. RIP to everyone who plays with mouse acceleration.*
