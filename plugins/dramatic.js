export default {
  name: 'dramatic',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🎭😱 *${usuario}* hace una entrada dramática... ¡TARÁN! ✨`
    })
  }
}
