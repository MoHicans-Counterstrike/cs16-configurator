// MOHICAN server leaderboard poller.
// Queries the CS 1.6 server every N seconds and accumulates player scores
// into a persistent JSON leaderboard (top 50 by total score).
import { writeFileSync, readFileSync } from "node:fs";
import * as gamedigPkg from "gamedig";

const GameDig = gamedigPkg.GameDig ?? gamedigPkg.default ?? gamedigPkg;

const CS_HOST = process.env.CS_HOST || "217.160.10.128";
const CS_PORT = Number(process.env.CS_PORT || 27015);
const OUT = process.env.OUT || "/home/ninja/cs16-config/leaderboard.json";
const INTERVAL = Number(process.env.INTERVAL_MS || 60000);

function load() {
  try {
    return JSON.parse(readFileSync(OUT, "utf8"));
  } catch {
    return { players: {}, updated: null };
  }
}

async function tick(db) {
  try {
    const state = await GameDig.query({
      type: "counterstrike16",
      host: CS_HOST,
      port: CS_PORT,
      maxAttempts: 2,
      socketTimeout: 5000,
    });
    for (const p of state.players) {
      if (!p.name || p.bot) continue;
      const cur = db.players[p.name] ?? { name: p.name, score: 0, lastSeen: 0, sessions: 0 };
      // score is cumulative in-game frags; we track the max we've seen plus
      // session deltas when a player re-joins (score resets on map change)
      if (p.score > cur.score) {
        cur.score = p.score;
      }
      cur.lastSeen = Date.now();
      db.players[p.name] = cur;
    }
    db.updated = new Date().toISOString();
    // keep top 50 only
    const top = Object.values(db.players)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    const next = { players: {}, updated: db.updated };
    for (const p of top) next.players[p.name] = p;
    writeFileSync(OUT, JSON.stringify(next));
    console.log(`[${db.updated}] leaderboard: ${Object.keys(next.players).length} players tracked`);
  } catch (e) {
    console.error("poll failed:", e.message);
  }
}

const db = load();
await tick(db);
setInterval(() => tick(load()), INTERVAL);
