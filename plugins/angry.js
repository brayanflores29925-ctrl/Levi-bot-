export default {
  name: 'angry',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    return sock.sendMessage(chatId, {
      text:
`😠 *ENOJADO/A*

@${sender.split('@')[0]} está mostrando enojo 😠💢`,
      mentions: [sender]
    }, { quoted: m })
  }
}
