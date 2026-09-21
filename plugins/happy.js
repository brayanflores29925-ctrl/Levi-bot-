export default {
  name: 'happy',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    return sock.sendMessage(chatId, {
      text:
`😄 *FELICIDAD*

@${sender.split('@')[0]} está muy feliz hoy 😄✨🎉`,
      mentions: [sender]
    }, { quoted: m })
  }
}
