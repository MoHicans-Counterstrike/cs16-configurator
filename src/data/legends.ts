// Legendary CS 1.6 pro player presets — values are community-documented
// approximations from their golden-era configs (public interviews, cfg dumps).

import type { Preset } from "../data/settings";

export interface Legend extends Omit<Preset, "overrides"> {
  realName: string;
  era: string;
  team: string;
  role: string;
  claim: string;
  edpi: number; // dpi * sensitivity (documented)
  accent: string; // tailwind color class fragment
}

export const legends: Legend[] = [
  {
    id: "heaton",
    name: "HeatoN",
    realName: "Christoffer Johansson",
    era: "2001–2007",
    team: "SK Gaming / NiP",
    role: "Rifler / IGL",
    claim:
      "The face of Swedish CS. Aiming philosophy shaped a generation — low sens, pure crosshair placement.",
    edpi: 660,
    accent: "from-amber-500/20",
    icon: "👑",
    description: "SK legend. Low sens, 800x600, the aiming textbook.",
    overrides: {
      sensitivity: 2.2,
      m_rawinput: false, // pre rawinput era
      m_customaccel: 0,
      m_filter: false,
      zoom_sensitivity_ratio: 1,
      resolution: "800x600",
      brightness: 1.6,
      fps_max: 101,
      rate: 25000,
      cl_cmdrate: 101,
      cl_updaterate: 101,
      ex_interp: 0.1,
      r_dynamic: false,
      max_shadows: 0,
      gl_picmip: 3,
      cl_minmodels: true,
      cl_dynamiccrosshair: false,
      cl_crosshair_size: "small",
      cl_crosshair_color: "50 250 50",
      hud_fastswitch: true,
      cl_autowepswitch: false,
    },
  },
  {
    id: "f0rest",
    name: "f0rest",
    realName: "Patrik Lindberg",
    era: "2005–heute",
    team: "NiP / fnatic / Dignitas",
    role: "Rifler",
    claim:
      "The most naturally talented aimers to ever touch GoldSrc and Source. Smooth, precise, eternal.",
    edpi: 880,
    accent: "from-sky-500/20",
    icon: "🌲",
    description: "Silky aim. 1024x768, moderate sens, forever young.",
    overrides: {
      sensitivity: 2.2,
      m_rawinput: true,
      m_customaccel: 0,
      m_filter: false,
      zoom_sensitivity_ratio: 1,
      resolution: "1024x768",
      brightness: 1.5,
      fps_max: 300,
      rate: 100000,
      cl_cmdrate: 101,
      cl_updaterate: 101,
      ex_interp: 0.1,
      r_dynamic: false,
      gl_picmip: 3,
      cl_minmodels: true,
      cl_dynamiccrosshair: false,
      cl_crosshair_size: "small",
      cl_crosshair_color: "50 250 50",
      hud_fastswitch: true,
      cl_autowepswitch: false,
    },
  },
  {
    id: "neo",
    name: "Neo",
    realName: "Filip Kubski",
    era: "2004–2019",
    team: "Virtus.pro / ESC Gaming",
    role: "Entry Fragger",
    claim:
      "Polish superstar, EMS One Cologne champion. Aggressive entries built on insane movement and spray control.",
    edpi: 800,
    accent: "from-orange-500/20",
    icon: "🔥",
    description: "VP entry machine. High FPS, tight interp, aggressive binds.",
    overrides: {
      sensitivity: 2.0,
      m_rawinput: true,
      m_customaccel: 0,
      m_filter: false,
      zoom_sensitivity_ratio: 1.05,
      resolution: "1024x768",
      brightness: 1.4,
      fps_max: 400,
      rate: 100000,
      cl_cmdrate: 105,
      cl_updaterate: 105,
      ex_interp: 0.01, // famous for ultra-low interp
      cl_interp: 0,
      r_dynamic: false,
      gl_picmip: 3,
      cl_minmodels: true,
      cl_dynamiccrosshair: false,
      cl_crosshair_size: "small",
      cl_crosshair_color: "50 250 50",
      hud_fastswitch: true,
      cl_autowepswitch: false,
      cl_jumpbind: "MWHEELDOWN",
    },
  },
  {
    id: "getright",
    name: "GeT_RiGhT",
    realName: "Christopher Alesund",
    era: "2008–2021",
    team: "NiP / Dignitas",
    role: "Lurker",
    claim:
      "Invented modern lurking. The 87-0 map streak with NiP. Master of timing and map psychology.",
    edpi: 720,
    accent: "from-violet-500/20",
    icon: "👻",
    description: "Ghost of NiP. Unusual angles, quiet footsteps, deadly timing.",
    overrides: {
      sensitivity: 1.8,
      m_rawinput: true,
      m_customaccel: 0,
      m_filter: false,
      zoom_sensitivity_ratio: 1,
      resolution: "1024x768",
      brightness: 1.3, // darker corners don't scare lurkers
      fps_max: 300,
      rate: 100000,
      cl_cmdrate: 101,
      cl_updaterate: 101,
      ex_interp: 0.1,
      r_dynamic: false,
      gl_picmip: 2,
      cl_minmodels: true,
      cl_dynamiccrosshair: true, // yes, he used dynamic!
      cl_crosshair_size: "medium",
      cl_crosshair_color: "50 50 250", // blue
      hud_fastswitch: true,
      cl_autowepswitch: false,
      volume: 0.65, // sound-whoring lurker
    },
  },
  {
    id: "markeloff",
    name: "markeloff",
    realName: "Yegor Markelov",
    era: "2007–2018",
    team: "Natus Vincere / AST",
    role: "AWPer",
    claim:
      "Na'Vi's founding sniper. IEM Dubai, WCG, ESWC — the most feared AWP of his generation.",
    edpi: 640,
    accent: "from-yellow-400/20",
    icon: "🎯",
    description: "Ukrainian AWP god. Low sens, perfect flicks, yellow crosshair.",
    overrides: {
      sensitivity: 1.6,
      m_rawinput: true,
      m_customaccel: 0,
      m_filter: false,
      zoom_sensitivity_ratio: 1,
      resolution: "800x600",
      brightness: 1.5,
      fps_max: 250,
      rate: 100000,
      cl_cmdrate: 101,
      cl_updaterate: 101,
      ex_interp: 0.1,
      r_dynamic: false,
      gl_picmip: 3,
      cl_minmodels: true,
      cl_dynamiccrosshair: false,
      cl_crosshair_size: "small",
      cl_crosshair_color: "250 250 50", // yellow
      cl_righthand: false, // left-handed viewmodel like many AWPers
      hud_fastswitch: true,
      cl_autowepswitch: false,
    },
  },
];

export const getLegendById = (id: string) => legends.find((l) => l.id === id);
