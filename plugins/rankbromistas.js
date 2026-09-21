export default {
  name: 'rankbromistas',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😂🏆 *RANKING DE BROMISTAS* 🏆😂\n\n🥇 *${usuario}* — ¡Bromista del momento! 😎\n🎭 ¡Sigue haciendo reír al grupo! 🤣`
    })
  }
}
