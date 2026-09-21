export default {
  name: 'cringe',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😬 *${usuario}* está sintiendo un poquito de cringe... 😂`
    })
  }
}
