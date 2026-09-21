export default {
  name: 'modoadmin',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = m.text || m.message?.conversation || ''
    const args = texto.trim().split(/\s+/)

    if (!args[1]) {
      return await sock.sendMessage(chatId, {
        text: `🛡️ MODO ADMIN

📌 Uso:
 /modoadmin 1 — Activar
 /modoadmin 0 — Desactivar`
      })
    }

    if (args[1] === '1') {
      return await sock.sendMessage(chatId, {
        text: '🛡️✅ Modo administrador activado.'
      })
    }

    if (args[1] === '0') {
      return await sock.sendMessage(chatId, {
        text: '🛡️❌ Modo administrador desactivado.'
      })
    }

    await sock.sendMessage(chatId, {
      text: '❌ Usa /modoadmin 1 para activar o /modoadmin 0 para desactivar.'
    })
  }
}
