export default {
  name: 'scream',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😱📢 *${usuario}* pega un grito de caricatura: ¡AAAAAH! 😂`
    })
  }
}
