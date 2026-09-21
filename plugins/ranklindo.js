export default {
  name: 'ranklindo',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `✨🏆 *RANKING DE BUENAS VIBRAS* 🏆✨\n\n🌟 *${usuario}* — ¡Persona destacada de la ronda! 😎✨\n\n💫 ¡Sigue compartiendo buenas vibras con el grupo!`
    })
  }
}
