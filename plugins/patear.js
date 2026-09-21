export default {
  name: 'patear',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const mencionado =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return sock.sendMessage(chatId, {
        text:
`🦵 *PATADA VIRTUAL*

Menciona a alguien para patearlo virtualmente de broma.

👉 Ejemplo:
 /patear @usuario`
      }, { quoted: m })
    }

    return sock.sendMessage(chatId, {
      text:
`🦵 *PATADA VIRTUAL*

@${sender.split('@')[0]} le dio una patada virtual de broma a @${mencionado.split('@')[0]} 😂`,
      mentions: [sender, mencionado]
    }, { quoted: m })
  }
}
