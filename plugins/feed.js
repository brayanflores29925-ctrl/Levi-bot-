export default {
  name: 'feed',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const mencionado =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return sock.sendMessage(chatId, {
        text:
`🍔 *DAR COMIDA*

Menciona a alguien para darle comida virtual.

👉 Ejemplo:
 /feed @usuario`
      }, { quoted: m })
    }

    return sock.sendMessage(chatId, {
      text:
`🍔 *DAR COMIDA*

@${sender.split('@')[0]} le dio comida virtual a @${mencionado.split('@')[0]} 😋🍔`,
      mentions: [sender, mencionado]
    }, { quoted: m })
  }
}
