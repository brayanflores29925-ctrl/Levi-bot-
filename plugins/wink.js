export default {
  name: 'wink',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    return sock.sendMessage(chatId, {
      text:
`😉 *GUIÑO*

@${sender.split('@')[0]} hizo un guiño virtual 😉✨`,
      mentions: [sender]
    }, { quoted: m })
  }
}
