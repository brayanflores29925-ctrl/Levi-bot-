export default {
  name: 'step',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `👣 *${usuario}* da un pasito hacia adelante 🚶✨`
    })
  }
}
