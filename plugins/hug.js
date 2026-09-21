export default {
  name: 'hug',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const texto = (m.text || m.message?.conversation || '').trim()

    const mencionado =
      m.mentionedJid?.[0] ||
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return sock.sendMessage(chatId, {
        text:
`🤗 *ABRAZO VIRTUAL*

Menciona a alguien para darle un abrazo.

👉 Ejemplo:
 /hug @usuario`
      }, { quoted: m })
    }

    return sock.sendMessage(chatId, {
      text:
`🤗 *ABRAZO VIRTUAL*

@${sender.split('@')[0]} le dio un abrazo a @${mencionado.split('@')[0]} 🫂

💫 ¡Qué bonito gesto!`,
      mentions: [sender, mencionado]
    }, { quoted: m })
  }
}
