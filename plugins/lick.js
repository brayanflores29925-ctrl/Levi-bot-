export default {
  name: 'lick',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😛👅 *${usuario}* hace una pequeña reacción de caricatura 😂`
    })
  }
}
