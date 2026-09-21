export default {
  name: 'rankotaku',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🎌🏆 *RANKING OTAKU* 🏆🎌\n\n⭐ *${usuario}* — ¡Otaku destacado de la ronda! 😎🔥\n\n🍥 ¡Que nunca falte el anime y el buen ambiente! ✨`
    })
  }
}
