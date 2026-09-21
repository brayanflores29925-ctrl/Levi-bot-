export default {
  name: 'bored',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    return sock.sendMessage(chatId, {
      text:
`😐 *ABURRIDO/A*

@${sender.split('@')[0]} está aburrido/a 😐💤`,
      mentions: [sender]
    }, { quoted: m })
  }
}
