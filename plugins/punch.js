export default {
  name: 'punch',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const mencionado =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return sock.sendMessage(chatId, {
        text:
`👊 *GOLPE VIRTUAL*

Menciona a alguien para hacerle un golpe virtual de broma.

👉 Ejemplo:
 /punch @usuario`
      }, { quoted: m })
    }

    return sock.sendMessage(chatId, {
      text:
`👊 *GOLPE VIRTUAL*

@${sender.split('@')[0]} hizo un golpe virtual de broma a @${mencionado.split('@')[0]} 😂`,
      mentions: [sender, mencionado]
    }, { quoted: m })
  }
}
