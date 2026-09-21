export default {
  name: 'blush',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    return sock.sendMessage(chatId, {
      text:
`😊 *BLUSH*

@${sender.split('@')[0]} se puso tímido/a 😊✨`,
      mentions: [sender]
    }, { quoted: m })
  }
}
