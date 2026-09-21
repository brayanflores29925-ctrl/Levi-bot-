export default {
  name: 'smile',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    return sock.sendMessage(chatId, {
      text:
`😊 *SONRISA*

@${sender.split('@')[0]} está sonriendo 😄✨`,
      mentions: [sender]
    }, { quoted: m })
  }
}
