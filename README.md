<div align="center">

# 🔫 MOHICAN CS 1.6 PRO SETTINGS CONFIGURATOR

**The ultimate competitive config generator for Counter-Strike 1.6**

[![Counter-Strike](https://img.shields.io/badge/Counter--Strike-1.6-DE9B35?logo=counterstrike&logoColor=white&labelColor=1a1a2e)](https://store.steampowered.com/app/10/CounterStrike/)
[![Half-Life Engine](https://img.shields.io/badge/Engine-GoldSrc-F0AD4E?logo=valve&logoColor=white&labelColor=1a1a2e)](https://en.wikipedia.org/wiki/GoldSrc)
[![Valve](https://img.shields.io/badge/Developer-Valve_Corporation-F74843?labelColor=1a1a2e)](https://www.valvesoftware.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=1a1a2e)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&labelColor=1a1a2e)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&labelColor=1a1a2e)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white&labelColor=1a1a2e)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?labelColor=1a1a2e)](LICENSE)

**Live:** [cfg.mohican.xyz](https://cfg.mohican.xyz)

</div>

---

> *"Trust your equipment — but tune it yourself."*

A tournament-grade **`autoexec.cfg` generator** built on settings used by CS legends — HeatoN, f0rest, and the Golden Era pros. Optimized for FPS, hit registration, and pure competitive performance on the GoldSrc engine.

## ⚡ Features

| | |
|---|---|
| 🎛️ **60+ tunable cvars** | Performance, network, mouse, video, HUD, sound, binds |
| 👑 **Pro presets** | Classic Pro (2005), Max FPS Potato, Modern 100-Tick, AWPer Setup |
| 📡 **Live config preview** | Syntax-highlighted `autoexec.cfg`, updates as you tweak |
| 💾 **One-click export** | Copy to clipboard or download a ready-to-use `autoexec.cfg` |
| 🧠 **Pro tips everywhere** | Every setting explains *why* the pros play it that way |
| 🖥️ **Single-file build** | Ships as one self-contained HTML file — zero backend needed |

## 🚀 Quick Start

```bash
git clone https://github.com/svdbrom/counterstrike.git
cd counterstrike
npm install
npm run dev      # dev server
npm run build    # production build → dist/index.html (single file!)
```

### Install your generated config

1. Download `autoexec.cfg`
2. Drop it into your `cstrike/` folder
3. Launch CS 1.6 with `-console -novid`
4. In console: `exec autoexec`

## 🎯 Recommended launch options

```
-game cstrike -width 1024 -height 768 -freq 144 -novid -console -nojoy +fps_max 0
```

## 🕹️ The nerdy details

- **GoldSrc netcode:** `cl_cmdrate 101` / `cl_updaterate 101` pairs perfectly with 100-tick servers
- **Raw input mandatory:** `m_rawinput 1` bypasses Windows mouse acceleration — no exceptions
- **eDPI sweet spot:** ~880 (`DPI × sensitivity`) — the pro average lives between 700–1200
- **4:3 stretched:** wider player models = easier heads. `1024x768` is the classic competitive pick
- **Zero interpolation:** `ex_interp 0.1` is the universal standard; `cl_interp 0` keeps lag comp tight

## 🏗️ Tech stack

`React 18` · `TypeScript` · `Vite 5` · `Tailwind CSS v4` · `vite-plugin-singlefile`

---

<div align="center">

*Built for competitors. RIP to everyone who plays with mouse acceleration.* 💀

</div>
