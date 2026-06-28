const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");

async function start() {
  console.log("🚀 BOT STARTING...");

  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: "info" }) // مهم عشان نشوف logs
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    console.log("📡 STATUS:", connection);

    if (connection === "open") {
      console.log("🤖 BOT CONNECTED TO WHATSAPP");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      console.log("❌ CLOSED:", code);

      if (code !== DisconnectReason.loggedOut) {
        start();
      }
    }
  });
}

start();
