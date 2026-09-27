import { enviarAnimacion } from './animaciones.js'

export default {
  name: 'kiss',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const mencionado = m.target || m.mentionedJid?.[0]

    if (!mencionado) {
      return sock.sendMessage(chatId, {
        text:
`😊 *BESO VIRTUAL*

Menciona a alguien para enviarle un beso virtual amistoso.

👉 Ejemplo:
 /kiss @usuario`
      }, { quoted: m })
    }

    const texto = 
`😊 *BESO VIRTUAL*

@${sender.split('@')[0]} envió un beso virtual a @${mencionado.split('@')[0]} 💫😊`

    await sock.sendMessage(chatId, {
      text: texto,
      mentions: [sender, mencionado]
    }, { quoted: m })

    await enviarAnimacion(sock, chatId, 'kiss')

    return true
  }
}
