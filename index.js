const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const P = require("pino");

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (u) => {
    if (u.connection === "open") {
      console.log("🤖 SUBARU BOT ONLINE");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    const from = msg.key.remoteJid;

    const reply = (t) =>
      sock.sendMessage(from, {
        text: "👑 SUBARU BOT\n\n" + t
      }, { quoted: msg });

    if (text === ".ping") return reply("🏓 Pong!");
    if (text === ".menu") return reply("📜 الأوامر:\n.ping\n.menu\n🔥 SUBARU");
  });
}

start();
