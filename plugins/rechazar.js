import { getDB, saveDB } from '../database.js'

export default {
  name: 'rechazar',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const db = getDB()
    const propuesta = db.propuestas[sender]

    if (!propuesta) {
      return sock.sendMessage(chatId, { text: 'No tienes ninguna propuesta pendiente.' }, { quoted: m })
    }

    const pretendiente = propuesta.de
    delete db.propuestas[sender]
    saveDB(db)

    const rejectText = `*PROPUESTA RECHAZADA* 💔\n\n` +
                       `@${sender.split('@')[0]} rechazó la propuesta de matrimonio de @${pretendiente.split('@')[0]}. F en el chat...`

    await sock.sendMessage(chatId, { text: rejectText, mentions: [sender, pretendiente] }, { quoted: m })
  }
}
