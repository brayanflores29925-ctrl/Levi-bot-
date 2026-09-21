export default {
  name: 'cry',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    return sock.sendMessage(chatId, {
      text:
`😢 *TRISTEZA*

@${sender.split('@')[0]} está triste 😢💧`,
      mentions: [sender]
    }, { quoted: m })
  }
}
