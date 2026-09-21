export default {
  name: 'kiss',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const mencionado =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return sock.sendMessage(chatId, {
        text:
`😊 *BESO VIRTUAL*

Menciona a alguien para enviarle un beso virtual amistoso.

👉 Ejemplo:
 /kiss @usuario`
      }, { quoted: m })
    }

    return sock.sendMessage(chatId, {
      text:
`😊 *BESO VIRTUAL*

@${sender.split('@')[0]} envió un beso virtual a @${mencionado.split('@')[0]} 💫😊`,
      mentions: [sender, mencionado]
    }, { quoted: m })
  }
}
