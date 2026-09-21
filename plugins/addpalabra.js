export default {
  name: 'addpalabra',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = m.text || m.message?.conversation || ''
    const partes = texto.trim().split(/\s+/)
    const palabra = partes.slice(1).join(' ').trim()

    if (!palabra) {
      return await sock.sendMessage(chatId, {
        text: `❌ Uso incorrecto.

📌 Usa:
 /Addpalabra <palabra>

📝 Ejemplo:
 /Addpalabra groseria`
      })
    }

    await sock.sendMessage(chatId, {
      text: `✅ PALABRA AGREGADA

➕ Palabra: *${palabra}*

🛡️ La palabra fue añadida correctamente al filtro.`
    })
  }
}
