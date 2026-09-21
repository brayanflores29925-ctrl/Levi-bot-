import { getDB, saveDB, getUser } from '../database.js'

export default {
  name: 'aceptar',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const db = getDB()
    const propuesta = db.propuestas[sender]

    if (!propuesta) {
      return sock.sendMessage(chatId, { text: 'No tienes ninguna propuesta de matrimonio pendiente.' }, { quoted: m })
    }

    const suegroPropuesto = propuesta.de
    const user1 = getUser(db, sender)
    const user2 = getUser(db, suegroPropuesto)

    user1.pareja = suegroPropuesto
    user2.pareja = sender

    // Eliminar la propuesta pendiente
    delete db.propuestas[sender]
    saveDB(db)

    const bodaText = `*¡BODA OFICIAL!* 🎉\n\n` +
                     `@${sender.split('@')[0]} ha aceptado la propuesta de @${suegroPropuesto.split('@')[0]}.\n\n` +
                     `¡Ahora están oficialmente casados!✨`

    await sock.sendMessage(chatId, { text: bodaText, mentions: [sender, suegroPropuesto] }, { quoted: m })
  }
}
