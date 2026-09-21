export default {
  name: 'antispam',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    await sock.sendMessage(chatId, {
      text: `🚫 ANTISPAM

🛡️ Protección contra spam.

📌 Uso:
 /Antispam on
 /Antispam off

✅ on — Activar
❌ off — Desactivar`
    })
  }
}
