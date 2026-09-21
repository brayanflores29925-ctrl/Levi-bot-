export default {
  name: 'rankinfieles',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😂🏆 *RANKING DE BROMA* 🏆😂\n\n🎭 *${usuario}* — ¡Ganador de la ronda! 😎✨\n\n⚠️ Solo es por diversión y no afirma nada sobre la vida personal de nadie.`
    })
  }
}
