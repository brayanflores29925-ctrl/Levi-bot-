export default {
  name: 'cold',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🥶❄️ *${usuario}* tiene mucho frío... brrr 🧣`
    })
  }
}
