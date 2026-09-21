export default {
  name: 'slap',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const mencionado =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return sock.sendMessage(chatId, {
        text:
`✋ *BOFETADA VIRTUAL*

Menciona a alguien para darle una bofetada virtual de broma.

👉 Ejemplo:
 /slap @usuario`
      }, { quoted: m })
    }

    return sock.sendMessage(chatId, {
      text:
`✋ *BOFETADA VIRTUAL*

@${sender.split('@')[0]} le dio una bofetada virtual de broma a @${mencionado.split('@')[0]} 😂`,
      mentions: [sender, mencionado]
    }, { quoted: m })
  }
}
