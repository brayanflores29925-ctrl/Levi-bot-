export default {
  name: 'smug',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    return sock.sendMessage(chatId, {
      text:
`😏 *SMUG*

@${sender.split('@')[0]} está mostrando mucha confianza 😏✨`,
      mentions: [sender]
    }, { quoted: m })
  }
}
