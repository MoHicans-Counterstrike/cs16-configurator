// MOHICAN network status poller
// Queries the CS 1.6 gameserver (A2S via gamedig) and the TeamSpeak 3
// ServerQuery interface (raw TCP, zero deps) and writes status.json
// next to the deployed static site. Runs on a loop; cheap & stateless.

import { writeFileSync } from "node:fs";
import net from "node:net";
import * as gamedigPkg from "gamedig";
const GameDig = gamedigPkg.GameDig ?? gamedigPkg.default ?? gamedigPkg;

const CS_HOST = process.env.CS_HOST || "217.160.10.128";
const CS_PORT = Number(process.env.CS_PORT || 27015);
const TS_HOST = process.env.TS_HOST || "127.0.0.1"; // ts3-server runs on this host; query port bound to loopback only
const TS_QPORT = Number(process.env.TS_QPORT || 10011);
const TS_VPORT = Number(process.env.TS_VPORT || 9987);
const OUT = process.env.OUT || "/home/ninja/cs16-config/status.json";
const INTERVAL = Number(process.env.INTERVAL_MS || 30000);

async function queryCS() {
  try {
    const state = await GameDig.query({
      type: "counterstrike16",
      host: CS_HOST,
      port: CS_PORT,
      maxAttempts: 2,
      socketTimeout: 5000,
      attemptTimeout: 8000,
    });
    return {
      online: true,
      name: state.name,
      map: state.map,
      players: state.players.length,
      maxPlayers: state.maxplayers,
      bots: state.players.filter((p) => p.bot).length,
      playerList: state.players
        .filter((p) => !p.bot)
        .map((p) => ({ name: p.name, score: p.score ?? 0, time: p.time ?? "" })),
    };
  } catch {
    return { online: false };
  }
}

// Minimal TS3 ServerQuery client (serveradmin read-only: channellist + clientlist)
function tsQuery() {
  const user = process.env.TS_USER || "serveradmin";
  const pass = process.env.TS_PASS || "";
  return new Promise((resolve) => {
    const sock = net.createConnection({ host: TS_HOST, port: TS_QPORT, timeout: 5000 });
    let buf = "";
    const step = { stage: 0, channels: null, clients: null };

    const finish = (result) => {
      try { sock.destroy(); } catch {}
      resolve(result);
    };

    const send = (cmd) => sock.write(cmd + "\n");

    const decode = (s) =>
      s
        .replaceAll("\\\\s", " ")
        .replaceAll("\\\\p", "|")
        .replaceAll("\\\\\\\\", "\\")
        .replaceAll("\\\\/", "/");

    sock.on("timeout", () => finish({ online: false }));
    sock.on("error", () => finish({ online: false }));

    sock.on("data", (d) => {
      buf += d.toString();
      if (step.stage === 0 && buf.includes("TS3")) {
        buf = "";
        step.stage = 1;
        send(`login ${user} ${pass}`);
      } else if (step.stage === 1 && buf.includes("error id=")) {
        if (!buf.includes("error id=0")) {
          console.error("TS login failed:", buf.trim().slice(0, 80));
          return finish({ online: false });
        }
        buf = "";
        step.stage = 2;
        send(`use port=${TS_VPORT}`);
      } else if (step.stage === 2 && buf.includes("error id=0")) {
        step.channels = buf.split("|").filter((l) => !l.startsWith("error"));
        buf = "";
        step.stage = 3;
        send("clientlist -country");
      } else if (step.stage === 3 && buf.includes("error id=")) {
        const ok = buf.includes("error id=0");
        if (!ok) return finish({ online: false });
        const clients = buf
          .split("|")
          .filter((l) => !l.startsWith("error") && l.trim())
          .map((line) => Object.fromEntries(line.split(" ").map((kv) => kv.split("="))))
          .filter((c) => c.client_type === "0" && c.cid !== "1") // real voice clients, not in server query channel
          .map((c) => ({ name: decode(c.client_nickname || "?"), cid: c.cid }));
        // attach channel names
        const chanMap = {};
        for (const line of step.channels || []) {
          const ch = Object.fromEntries(line.split(" ").map((kv) => kv.split("=")));
          chanMap[ch.cid] = decode(ch.channel_name || "");
        }
        finish({
          online: true,
          clients: clients.map((c) => ({ ...c, channel: chanMap[c.cid] || "" })),
        });
      }
    });
  });
}

async function main() {
  const [cs, ts] = await Promise.all([queryCS(), tsQuery()]);
  const status = {
    updated: new Date().toISOString(),
    cs,
    ts,
  };
  writeFileSync(OUT, JSON.stringify(status));
  console.log(`[${status.updated}] cs:${cs.online ? `${cs.players}/${cs.maxPlayers} ${cs.map}` : "down"} ts:${ts.online ? ts.clients.length : "down"}`);
}

main();
setInterval(main, INTERVAL);
