export default {
  name: 'highfive',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🙌 *${usuario}* hace un choca esos cinco ✋😄`
    })
  }
}
