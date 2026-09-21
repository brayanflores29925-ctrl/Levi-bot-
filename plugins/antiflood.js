export default {
  name: 'antiflood',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    await sock.sendMessage(chatId, {
      text: `🌊 ANTIFLOOD

🛡️ Controla cuando un usuario envía muchos mensajes seguidos.

📌 Uso:
 /Antiflood on
 /Antiflood off

✅ on — Activar
❌ off — Desactivar`
    })
  }
}
