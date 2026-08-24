export type SettingType = "select" | "number" | "toggle" | "text";

export interface Setting {
  key: string;
  name: string;
  type: SettingType;
  default: string | number | boolean;
  options?: { value: string | number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description: string;
  proTip?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  settings: Setting[];
}

export const categories: Category[] = [
  {
    id: "performance",
    name: "Performance",
    icon: "⚡",
    description: "Max FPS and smooth gameplay",
    settings: [
      {
        key: "fps_max",
        name: "FPS Max",
        type: "number",
        default: 101,
        min: 60,
        max: 1000,
        step: 1,
        description: "Caps the maximum frames per second. 101 is the classic competitive value — stable, syncs with server tickrate on most platforms.",
        proTip: "On modern hardware you can push 300-1000 for slightly smoother mouse input processing.",
      },
      {
        key: "fps_modem",
        name: "FPS Modem",
        type: "toggle",
        default: false,
        description: "Disables the FPS cap when using the in-game modem (unused on LAN/internet). Keep off.",
      },
      {
        key: "r_dynamic",
        name: "Dynamic Lighting",
        type: "toggle",
        default: false,
        description: "Disables muzzle flash lighting and bullet impact lights. Huge FPS boost and cleaner visuals.",
        proTip: "Every pro plays with this off — it's pure visual noise.",
      },
      {
        key: "max_shadows",
        name: "Max Shadows",
        type: "number",
        default: 0,
        min: 0,
        max: 10,
        step: 1,
        description: "Number of player shadows. Set to 0 to remove them entirely and gain FPS.",
      },
      {
        key: "gl_picmip",
        name: "Texture Detail (Picmip)",
        type: "select",
        default: 3,
        options: [
          { value: 0, label: "Highest (blurry on purpose for perf)" },
          { value: 1, label: "High" },
          { value: 2, label: "Medium" },
          { value: 3, label: "Low (sharpest textures)" },
        ],
        description: "Higher = sharper textures (counter-intuitive naming). 3 gives the crispest wall detail for spotting enemies.",
        proTip: "Counter-Strike's naming is backwards — 3 is the pro choice.",
      },
      {
        key: "gl_clear",
        name: "Clear Screen Color",
        type: "toggle",
        default: false,
        description: "Removes the gray flash when looking at sky. Cleaner view.",
      },
      {
        key: "gl_ztrick",
        name: "GL Z-Trick",
        type: "toggle",
        default: true,
        description: "OpenGL depth buffer trick. Faster rendering on most cards. Keep on.",
      },
      {
        key: "r_decals",
        name: "Bullet Decals",
        type: "number",
        default: 20,
        min: 0,
        max: 500,
        step: 10,
        description: "Number of bullet holes kept on walls. 20 is a competitive sweet spot — enough to see recent spray, but doesn't tank FPS.",
        proTip: "0 disables them entirely. 20 keeps the wall readable.",
      },
      {
        key: "cl_weather",
        name: "Weather Effects",
        type: "number",
        default: 0,
        min: 0,
        max: 2,
        step: 1,
        description: "Rain/snow effects on maps like Aztec. 0 = off for pure FPS and visibility.",
      },
      {
        key: "r_waterwaves",
        name: "Water Waves",
        type: "toggle",
        default: false,
        description: "Animated water ripples. Off for FPS and cleaner water visuals.",
      },
      {
        key: "cl_highfps",
        name: "High FPS Mode",
        type: "toggle",
        default: true,
        description: "Enables high FPS rendering mode. Always on for competitive.",
      },
    ],
  },
  {
    id: "network",
    name: "Network",
    icon: "📡",
    description: "Registration & hit registration",
    settings: [
      {
        key: "rate",
        name: "Rate (bytes/sec)",
        type: "select",
        default: 100000,
        options: [
          { value: 25000, label: "25000 (classic 25k)" },
          { value: 60000, label: "60000 (standard)" },
          { value: 100000, label: "100000 (modern servers)" },
        ],
        description: "Max bytes per second from server. Match your server — 100000 is standard on modern 100-tick servers.",
        proTip: "Too low = choppy, too high = packet loss. 100000 is safe on any decent connection.",
      },
      {
        key: "cl_cmdrate",
        name: "Command Rate",
        type: "number",
        default: 101,
        min: 10,
        max: 128,
        step: 1,
        description: "How many commands you send to the server per second. 101 is the CS 1.6 sweet spot.",
        proTip: "Match your server tickrate when possible. 101 is universal.",
      },
      {
        key: "cl_updaterate",
        name: "Update Rate",
        type: "number",
        default: 101,
        min: 10,
        max: 128,
        step: 1,
        description: "How many updates you receive per second. 101 pairs perfectly with cl_cmdrate 101.",
        proTip: "Always match this to cmdrate for perfect synchronization.",
      },
      {
        key: "cl_interp",
        name: "Interpolation",
        type: "number",
        default: 0,
        min: 0,
        max: 1,
        step: 0.01,
        description: "Client-side interpolation in milliseconds. 0 gives the most responsive feel with minimal lag compensation.",
        proTip: "0 is the modern competitive standard.",
      },
      {
        key: "cl_interp_ratio",
        name: "Interp Ratio",
        type: "number",
        default: 1,
        min: 1,
        max: 4,
        step: 1,
        description: "Multiplier for interpolation. 1 is the lowest possible lag compensation.",
      },
      {
        key: "cl_lw",
        name: "Client Weapon Prediction",
        type: "toggle",
        default: true,
        description: "Predicts weapon behavior client-side. Leave at 1 — do not change or you will desync.",
      },
      {
        key: "cl_lc",
        name: "Lag Compensation",
        type: "toggle",
        default: true,
        description: "Enables lag compensation for hit registration. Never disable.",
      },
      {
        key: "ex_interp",
        name: "Ex Interp",
        type: "number",
        default: 0.1,
        min: 0.01,
        max: 1,
        step: 0.01,
        unit: "sec",
        description: "Extrapolation value. 0.1 is the universal competitive default — balances smoothness and responsiveness.",
      },
      {
        key: "net_graph",
        name: "Net Graph",
        type: "number",
        default: 3,
        min: 0,
        max: 3,
        step: 1,
        description: "Display network performance overlay. 3 shows the most detailed info including var, loss, choke.",
        proTip: "Keep on 3 to always know your connection health.",
      },
    ],
  },
  {
    id: "mouse",
    name: "Mouse",
    icon: "🖱️",
    description: "Raw input & sensitivity",
    settings: [
      {
        key: "sensitivity",
        name: "Mouse Sensitivity",
        type: "number",
        default: 2.1,
        min: 0.1,
        max: 10,
        step: 0.1,
        description: "In-game mouse multiplier. The pro average is 1.3–2.5. Lower = more precise aim.",
        proTip: "Most pros play between 1.5 and 3.0. Start low and work up.",
      },
      {
        key: "m_rawinput",
        name: "Raw Input",
        type: "toggle",
        default: true,
        description: "Bypasses Windows mouse acceleration entirely. MANDATORY for any serious player.",
        proTip: "If this is off, your aim will never be consistent. Always 1.",
      },
      {
        key: "m_customaccel",
        name: "Custom Acceleration",
        type: "number",
        default: 0,
        min: 0,
        max: 3,
        step: 1,
        description: "Custom mouse acceleration curve. 0 = off. You want this off.",
      },
      {
        key: "m_pitch",
        name: "Mouse Pitch",
        type: "number",
        default: 0.022,
        min: 0.01,
        max: 0.1,
        step: 0.001,
        description: "Vertical mouse sensitivity multiplier. 0.022 is the standard — matches horizontal 1:1.",
      },
      {
        key: "m_filter",
        name: "Mouse Filter",
        type: "toggle",
        default: false,
        description: "Averages mouse input for smoothing. Pros disable it — it adds input latency.",
      },
      {
        key: "m_mousethread",
        name: "Mouse Polling Thread",
        type: "toggle",
        default: true,
        description: "Forces 1000Hz polling on the mouse thread. Keep on for responsive aim.",
      },
      {
        key: "zoom_sensitivity_ratio",
        name: "Zoom Sensitivity",
        type: "number",
        default: 1.05,
        min: 0.1,
        max: 5,
        step: 0.05,
        description: "Multiplier when scoped with AWP/Scout. 1.05 feels almost identical to unscoped feel.",
      },
    ],
  },
  {
    id: "video",
    name: "Video & Display",
    icon: "🖥️",
    description: "Resolution, models & visuals",
    settings: [
      {
        key: "resolution",
        name: "Resolution",
        type: "select",
        default: "1024x768",
        options: [
          { value: "640x480", label: "640x480 (4:3 classic)" },
          { value: "800x600", label: "800x600 (4:3 standard)" },
          { value: "1024x768", label: "1024x768 (4:3 pro standard)" },
          { value: "1280x960", label: "1280x960 (4:3 high)" },
          { value: "1280x1024", label: "1280x1024 (5:4)" },
          { value: "1920x1080", label: "1920x1080 (16:9 native)" },
        ],
        description: "Most pros play 4:3 stretched. 1024x768 is the most common competitive resolution — makes heads bigger on screen.",
        proTip: "4:3 stretched on a 16:9 monitor = wider player models, easier to hit.",
      },
      {
        key: "brightness",
        name: "Brightness",
        type: "number",
        default: 1.5,
        min: 0.5,
        max: 3,
        step: 0.1,
        description: "Gamma / brightness level. 1.5 gives clear visibility in dark corners without washing out.",
      },
      {
        key: "cl_minmodels",
        name: "Force Enemy Models",
        type: "toggle",
        default: true,
        description: "Forces enemy players to use distinct models regardless of their choice. Critical for spotting.",
        proTip: "Never play without this — you need to tell CT from T instantly.",
      },
      {
        key: "cl_minT",
        name: "Min T Model (if minmodels on)",
        type: "select",
        default: 1,
        options: [
          { value: 1, label: "Arctic Avenger (most visible)" },
          { value: 2, label: "Elite Crew" },
          { value: 3, label: "Separatist" },
          { value: 4, label: "Guerrilla Warfare" },
          { value: 5, label: "Militia" },
        ],
        description: "Forces T model when cl_minmodels is on. Arctic Avenger is the most recognizable silhouette.",
      },
      {
        key: "cl_minCT",
        name: "Min CT Model (if minmodels on)",
        type: "select",
        default: 1,
        options: [
          { value: 1, label: "SEAL Team Six (most visible)" },
          { value: 2, label: "GSG-9" },
          { value: 3, label: "SAS" },
          { value: 4, label: "GIGN" },
          { value: 5, label: "Urban Commando" },
        ],
        description: "Forces CT model when cl_minmodels is on. SEAL Team Six has the clearest outline.",
      },
      {
        key: "cl_corpsestay",
        name: "Corpse Stay Duration",
        type: "number",
        default: 0,
        min: 0,
        max: 600,
        step: 30,
        unit: "sec",
        description: "How long dead bodies stay on the ground. 0 = instant removal, cleaner sightlines.",
      },
      {
        key: "cl_shadows",
        name: "Player Shadows",
        type: "toggle",
        default: false,
        description: "Circular shadows under players. Off for cleaner visuals.",
      },
    ],
  },
  {
    id: "hud",
    name: "HUD & Crosshair",
    icon: "🎯",
    description: "Interface & aim visuals",
    settings: [
      {
        key: "cl_dynamiccrosshair",
        name: "Dynamic Crosshair",
        type: "toggle",
        default: false,
        description: "Crosshair expands when moving/firing. OFF for a stable, always-consistent aiming point.",
        proTip: "Turn it off. You already know when you're moving — don't let the crosshair lie to you.",
      },
      {
        key: "cl_crosshair_size",
        name: "Crosshair Size",
        type: "select",
        default: "small",
        options: [
          { value: "auto", label: "Auto (scales with resolution)" },
          { value: "small", label: "Small (static)" },
          { value: "medium", label: "Medium (static)" },
          { value: "large", label: "Large (static)" },
        ],
        description: "Size of the crosshair. Small or auto gives the cleanest aim point.",
      },
      {
        key: "cl_crosshair_color",
        name: "Crosshair Color",
        type: "select",
        default: "50 250 50",
        options: [
          { value: "50 250 50", label: "Green (classic)" },
          { value: "250 50 50", label: "Red" },
          { value: "50 50 250", label: "Blue" },
          { value: "250 250 50", label: "Yellow" },
          { value: "250 250 250", label: "White" },
          { value: "0 0 0", label: "Black" },
        ],
        description: "RGB color of the crosshair. Green is the CS default and contrasts well on most maps.",
      },
      {
        key: "cl_crosshair_translucent",
        name: "Crosshair Translucency",
        type: "number",
        default: 0,
        min: 0,
        max: 2,
        step: 1,
        description: "0 = solid, 1 = translucent, 2 = more translucent. Solid is most visible.",
      },
      {
        key: "hud_fastswitch",
        name: "Fast Weapon Switch",
        type: "toggle",
        default: true,
        description: "Skip the weapon selection menu — weapons switch immediately on key press.",
        proTip: "Non-negotiable. Holding 1 and waiting for a menu wastes lives.",
      },
      {
        key: "cl_autowepswitch",
        name: "Auto Weapon Switch",
        type: "toggle",
        default: false,
        description: "Automatically switch to picked-up weapons. OFF prevents accidental weapon drops in fights.",
        proTip: "Turning this off has saved countless rounds when walking over enemy guns mid-fight.",
      },
      {
        key: "cl_righthand",
        name: "Right-Handed Viewmodel",
        type: "toggle",
        default: true,
        description: "Weapon held in right hand. Most players prefer this — left-hand blocks less of the screen.",
      },
      {
        key: "cl_showerror",
        name: "Show Net Errors",
        type: "toggle",
        default: false,
        description: "Display network error messages. Off for cleaner HUD.",
      },
      {
        key: "cl_radartype",
        name: "Radar Style",
        type: "select",
        default: 0,
        options: [
          { value: 0, label: "Solid (opaque background)" },
          { value: 1, label: "Transparent" },
        ],
        description: "Radar background style. Solid (0) is easier to read at a glance.",
      },
      {
        key: "cl_backspeed",
        name: "Back Speed",
        type: "number",
        default: 400,
        min: 200,
        max: 400,
        step: 10,
        description: "Movement speed backward. Keep at 400 (default) — changing this causes desync on some servers.",
      },
    ],
  },
  {
    id: "sound",
    name: "Sound",
    icon: "🔊",
    description: "Audio clarity & footsteps",
    settings: [
      {
        key: "volume",
        name: "Master Volume",
        type: "number",
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.05,
        description: "Master volume. 0.5 gives clear footstep audibility without ear fatigue.",
        proTip: "Never go above 0.7 — louder doesn't help you hear footsteps, it just hurts.",
      },
      {
        key: "snd_noextraupdate",
        name: "No Extra Sound Update",
        type: "toggle",
        default: true,
        description: "Disables extra sound processing. Keep on for cleaner audio.",
      },
      {
        key: "suitvolume",
        name: "HEV Suit Volume",
        type: "number",
        default: 0.1,
        min: 0,
        max: 1,
        step: 0.05,
        description: "Volume of your own suit beeps and footsteps. Lower = hear enemies better over your own noise.",
      },
      {
        key: "hisound",
        name: "High Quality Sound",
        type: "toggle",
        default: true,
        description: "Enables higher quality audio samples. Footsteps are crisper.",
      },
      {
        key: "voice_enable",
        name: "Voice Chat",
        type: "toggle",
        default: true,
        description: "Enable voice communication. Essential for team play.",
      },
      {
        key: "voice_scale",
        name: "Incoming Voice Volume",
        type: "number",
        default: 1,
        min: 0,
        max: 2,
        step: 0.1,
        description: "Volume of other players' voices.",
      },
    ],
  },
  {
    id: "bindings",
    name: "Bindings",
    icon: "⌨️",
    description: "Key configuration",
    settings: [
      {
        key: "cl_buybinds",
        name: "Modern Buy Binds",
        type: "toggle",
        default: true,
        description: "Adds numpad buy binds (F1-F12 or numpad 1-0) alongside number keys. Faster buying.",
        proTip: "Numpad binds are the fastest way to buy a full loadout in freeze time.",
      },
      {
        key: "cl_jumpbind",
        name: "Jump Bind",
        type: "select",
        default: "MWHEELDOWN",
        options: [
          { value: "SPACE", label: "Space only" },
          { value: "MWHEELDOWN", label: "Space + Mouse Wheel Down (bhop friendly)" },
          { value: "MWHEELUP", label: "Mouse Wheel Up" },
        ],
        description: "Jump bind configuration. Wheel down enables bunny hopping with consistent timing.",
      },
      {
        key: "cl_quickgrenade",
        name: "Quick Switch Binds",
        type: "toggle",
        default: true,
        description: "Adds Q/E quick-switch grenade binds and other common shortcuts.",
      },
      {
        key: "cl_scoreboardbind",
        name: "Scoreboard Hold",
        type: "select",
        default: "TAB",
        options: [
          { value: "TAB", label: "TAB (default)" },
          { value: "SHIFT", label: "Shift" },
        ],
        description: "Key to hold scoreboard. TAB is traditional and works with muscle memory.",
      },
    ],
  },
];

export function generateConfig(values: Record<string, string | number | boolean>): string {
  const lines: string[] = [];
  lines.push("// ==============================================");
  lines.push("// COUNTER-STRIKE 1.6 - PRO SETTINGS CONFIG");
  lines.push("// Generated by CS 1.6 Settings Generator");
  lines.push("// Save as: cstrike/autoexec.cfg");
  lines.push("// Launch options: -freq <hz> -novid -console");
  lines.push("// ==============================================");
  lines.push("");
  lines.push("// --- NETWORK ---");
  lines.push(`rate ${values["rate"] ?? 100000}`);
  lines.push(`cl_cmdrate ${values["cl_cmdrate"] ?? 101}`);
  lines.push(`cl_updaterate ${values["cl_updaterate"] ?? 101}`);
  lines.push(`cl_interp ${values["cl_interp"] ?? 0}`);
  lines.push(`cl_interp_ratio ${values["cl_interp_ratio"] ?? 1}`);
  lines.push(`cl_lw ${values["cl_lw"] ? 1 : 0}`);
  lines.push(`cl_lc ${values["cl_lc"] ? 1 : 0}`);
  lines.push(`ex_interp ${values["ex_interp"] ?? 0.1}`);
  lines.push(`net_graph ${values["net_graph"] ?? 3}`);
  lines.push("");
  lines.push("// --- MOUSE ---");
  lines.push(`sensitivity ${values["sensitivity"] ?? 2.1}`);
  lines.push(`m_rawinput ${values["m_rawinput"] ? 1 : 0}`);
  lines.push(`m_customaccel ${values["m_customaccel"] ?? 0}`);
  lines.push(`m_pitch ${values["m_pitch"] ?? 0.022}`);
  lines.push(`m_filter ${values["m_filter"] ? 1 : 0}`);
  lines.push(`m_mousethread ${values["m_mousethread"] ? 1 : 0}`);
  lines.push(`zoom_sensitivity_ratio ${values["zoom_sensitivity_ratio"] ?? 1.05}`);
  lines.push("");
  lines.push("// --- PERFORMANCE ---");
  lines.push(`fps_max ${values["fps_max"] ?? 101}`);
  lines.push(`fps_modem ${values["fps_modem"] ? 1 : 0}`);
  lines.push(`r_dynamic ${values["r_dynamic"] ? 1 : 0}`);
  lines.push(`max_shadows ${values["max_shadows"] ?? 0}`);
  lines.push(`gl_picmip ${values["gl_picmip"] ?? 3}`);
  lines.push(`gl_clear ${values["gl_clear"] ? 1 : 0}`);
  lines.push(`gl_ztrick ${values["gl_ztrick"] ? 1 : 0}`);
  lines.push(`r_decals ${values["r_decals"] ?? 20}`);
  lines.push(`cl_weather ${values["cl_weather"] ?? 0}`);
  lines.push(`r_waterwaves ${values["r_waterwaves"] ? 1 : 0}`);
  lines.push(`cl_highfps ${values["cl_highfps"] ? 1 : 0}`);
  lines.push("");
  lines.push("// --- VIDEO & DISPLAY ---");
  lines.push(`brightness ${values["brightness"] ?? 1.5}`);
  lines.push(`cl_minmodels ${values["cl_minmodels"] ? 1 : 0}`);
  lines.push(`cl_minT ${values["cl_minT"] ?? 1}`);
  lines.push(`cl_minCT ${values["cl_minCT"] ?? 1}`);
  lines.push(`cl_corpsestay ${values["cl_corpsestay"] ?? 0}`);
  lines.push(`cl_shadows ${values["cl_shadows"] ? 1 : 0}`);
  lines.push("");
  lines.push("// --- HUD & CROSSHAIR ---");
  lines.push(`cl_dynamiccrosshair ${values["cl_dynamiccrosshair"] ? 1 : 0}`);
  const size = values["cl_crosshair_size"] ?? "small";
  if (size === "auto") {
    lines.push(`cl_crosshair_size auto`);
  } else {
    lines.push(`cl_crosshair_size ${size === "small" ? 0 : size === "medium" ? 1 : 2}`);
  }
  const color = values["cl_crosshair_color"] ?? "50 250 50";
  lines.push(`cl_crosshair_color ${color}`);
  lines.push(`cl_crosshair_translucent ${values["cl_crosshair_translucent"] ?? 0}`);
  lines.push(`hud_fastswitch ${values["hud_fastswitch"] ? 1 : 0}`);
  lines.push(`cl_autowepswitch ${values["cl_autowepswitch"] ? 1 : 0}`);
  lines.push(`cl_righthand ${values["cl_righthand"] ? 1 : 0}`);
  lines.push(`cl_showerror ${values["cl_showerror"] ? 1 : 0}`);
  lines.push(`cl_radartype ${values["cl_radartype"] ?? 0}`);
  lines.push(`cl_backspeed ${values["cl_backspeed"] ?? 400}`);
  lines.push("");
  lines.push("// --- SOUND ---");
  lines.push(`volume ${values["volume"] ?? 0.5}`);
  lines.push(`snd_noextraupdate ${values["snd_noextraupdate"] ? 1 : 0}`);
  lines.push(`suitvolume ${values["suitvolume"] ?? 0.1}`);
  lines.push(`hisound ${values["hisound"] ? 1 : 0}`);
  lines.push(`voice_enable ${values["voice_enable"] ? 1 : 0}`);
  lines.push(`voice_scale ${values["voice_scale"] ?? 1}`);
  lines.push("");
  lines.push("// --- BINDINGS ---");
  if (values["cl_buybinds"]) {
    lines.push('// Modern buy binds');
    lines.push('bind "F1" "vest; vesthelm"');
    lines.push('bind "F2" "defuser"');
    lines.push('bind "F3" "flash"');
    lines.push('bind "F4" "hegren"');
    lines.push('bind "F5" "sgren"');
    lines.push('bind "F6" "primammo; secammo"');
    lines.push("");
    lines.push('// Numpad buy binds');
    lines.push('bind "KP_END" "ak47; m4a1"');
    lines.push('bind "KP_DOWNARROW" "awp"');
    lines.push('bind "KP_PGDN" "scout"');
    lines.push('bind "KP_LEFTARROW" "deagle"');
    lines.push('bind "KP_5" "vesthelm"');
    lines.push('bind "KP_RIGHTARROW" "defuser"');
    lines.push('bind "KP_HOME" "flash"');
    lines.push('bind "KP_UPARROW" "hegren"');
    lines.push('bind "KP_PGUP" "sgren"');
    lines.push('bind "KP_MULTIPLY" "primammo; secammo"');
    lines.push("");
  }
  const jumpBind = values["cl_jumpbind"] ?? "MWHEELDOWN";
  if (jumpBind === "MWHEELDOWN") {
    lines.push('// Bunny hop friendly jump bind');
    lines.push('bind "MWHEELDOWN" "+jump"');
    lines.push('bind "SPACE" "+jump"');
  } else if (jumpBind === "MWHEELUP") {
    lines.push('bind "MWHEELUP" "+jump"');
  }
  lines.push("");
  lines.push("// --- MISC PRO COMMANDS ---");
  lines.push('cl_dlmax 128');
  lines.push('cl_download_ingame 1');
  lines.push('cl_showfps 0');
  lines.push('cl_sidespeed 400');
  lines.push('cl_forwardspeed 400');
  lines.push('cl_observercrosshair 0');
  lines.push('name "YourNameHere"');
  lines.push("");
  lines.push("// ==============================================");
  lines.push("// End of config. Reload with: exec autoexec");
  lines.push("// ==============================================");

  return lines.join("\n");
}

export function getInitialValues(): Record<string, string | number | boolean> {
  const values: Record<string, string | number | boolean> = {};
  categories.forEach((cat) => {
    cat.settings.forEach((s) => {
      values[s.key] = s.default;
    });
  });
  return values;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  overrides: Partial<Record<string, string | number | boolean>>;
}

export const presets: Preset[] = [
  {
    id: "classic",
    name: "Classic Pro (2005)",
    description: "Settings used by HeatoN, f0rest, and CS legends in the golden era.",
    icon: "👑",
    overrides: {
      fps_max: 101,
      rate: 25000,
      cl_cmdrate: 101,
      cl_updaterate: 101,
      cl_interp: 0,
      cl_interp_ratio: 1,
      ex_interp: 0.1,
      sensitivity: 1.5,
      m_rawinput: true,
      m_customaccel: 0,
      m_filter: false,
      zoom_sensitivity_ratio: 1,
      resolution: "800x600",
      brightness: 1.3,
      r_dynamic: false,
      max_shadows: 0,
      gl_picmip: 3,
      r_decals: 0,
      cl_minmodels: true,
      cl_dynamiccrosshair: false,
      cl_crosshair_size: "small",
      cl_crosshair_color: "50 250 50",
      hud_fastswitch: true,
      cl_autowepswitch: false,
      cl_righthand: true,
      cl_corpsestay: 0,
      cl_shadows: false,
      volume: 0.5,
      cl_buybinds: true,
      cl_jumpbind: "SPACE",
    },
  },
  {
    id: "maxfps",
    name: "Max FPS Potato",
    description: "Turn every detail down for maximum framerates on low-end machines.",
    icon: "🚀",
    overrides: {
      fps_max: 1000,
      r_dynamic: false,
      max_shadows: 0,
      gl_picmip: 3,
      gl_clear: false,
      gl_ztrick: true,
      r_decals: 0,
      cl_weather: 0,
      r_waterwaves: false,
      cl_highfps: true,
      cl_minmodels: true,
      cl_corpsestay: 0,
      cl_shadows: false,
      cl_dynamiccrosshair: false,
      cl_showerror: false,
      net_graph: 0,
    },
  },
  {
    id: "modern",
    name: "Modern 100-Tick",
    description: "Optimized netcode for modern 100-tick community servers.",
    icon: "🎮",
    overrides: {
      fps_max: 300,
      rate: 100000,
      cl_cmdrate: 101,
      cl_updaterate: 101,
      cl_interp: 0,
      cl_interp_ratio: 1,
      ex_interp: 0.1,
      sensitivity: 2.0,
      m_rawinput: true,
      m_customaccel: 0,
      m_filter: false,
      zoom_sensitivity_ratio: 1.05,
      resolution: "1024x768",
      brightness: 1.5,
      r_dynamic: false,
      max_shadows: 0,
      gl_picmip: 3,
      r_decals: 20,
      cl_minmodels: true,
      cl_dynamiccrosshair: false,
      cl_crosshair_size: "small",
      hud_fastswitch: true,
      cl_autowepswitch: false,
      cl_righthand: true,
      volume: 0.5,
      cl_buybinds: true,
      cl_jumpbind: "MWHEELDOWN",
      net_graph: 3,
    },
  },
  {
    id: "awper",
    name: "AWPer Setup",
    description: "Low sens, perfect zoom ratio for snipers. Like JW or m0NESY.",
    icon: "🎯",
    overrides: {
      sensitivity: 1.4,
      zoom_sensitivity_ratio: 1.02,
      m_rawinput: true,
      m_customaccel: 0,
      m_filter: false,
      cl_dynamiccrosshair: false,
      cl_crosshair_size: "small",
      cl_crosshair_color: "250 50 50",
      cl_righthand: false,
      net_graph: 3,
    },
  },
];

export function applyPreset(
  base: Record<string, string | number | boolean>,
  preset: Preset
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = { ...base };
  for (const [key, value] of Object.entries(preset.overrides)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

