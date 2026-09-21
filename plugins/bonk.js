export default {
  name: 'bonk',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🔨😅 *${usuario}* recibió un BONK de caricatura 💫`
    })
  }
}
