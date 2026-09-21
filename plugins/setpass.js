import { setPassword } from '../authdb.js'

export default {
  name: 'setpass',
  async execute(sock, m, args) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const ownerNumber = sock.user.id.split(':')[0].split('@')[0]

    if (sender.split('@')[0] !== ownerNumber) {
      return await sock.sendMessage(chatId, { text: 'Solo el dueño del bot puede usar este comando.' }, { quoted: m })
    }

    const nueva = args?.[0]
    if (!nueva) {
      return await sock.sendMessage(chatId, { text: 'Uso: /setpass <nueva_contraseña>' }, { quoted: m })
    }

    setPassword(nueva)
    await sock.sendMessage(chatId, { text: 'Contraseña actualizada a: ' + nueva }, { quoted: m })
  }
}
