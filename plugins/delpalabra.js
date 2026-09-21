export default {
  name: 'delpalabra',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = m.text || m.message?.conversation || ''
    const partes = texto.trim().split(/\s+/)
    const palabra = partes.slice(1).join(' ').trim()

    if (!palabra) {
      return await sock.sendMessage(chatId, {
        text: `❌ Uso incorrecto.

📌 Usa:
 /Delpalabra <palabra>

📝 Ejemplo:
 /Delpalabra groseria`
      })
    }

    await sock.sendMessage(chatId, {
      text: `✅ PALABRA ELIMINADA

➖ Palabra: *${palabra}*

🗑️ La palabra fue eliminada del filtro.`
    })
  }
}
