export default {
  name: 'rankgay',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🏳️‍🌈😂 *RANKING DE BROMA* 😂🏳️‍🌈\n\n🏆 *${usuario}* — ¡Ganador de la ronda! 😎✨\n\n⚠️ Ranking solo por diversión, no define la orientación de nadie.`
    })
  }
}
