export default {
  name: 'yeet',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😂💨 *${usuario}* hizo un YEET de caricatura 🚀`
    })
  }
}
