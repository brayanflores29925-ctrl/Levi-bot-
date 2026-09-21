export default {
  name: 'handshake',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🤝 *${usuario}* da un apretón de manos al grupo 😄`
    })
  }
}
