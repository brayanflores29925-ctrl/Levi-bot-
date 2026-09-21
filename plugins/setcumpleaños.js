import { getDB, saveDB, getUser } from '../database.js'

export default {
  name: 'setcumple',
  async execute(sock, m, args) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const cumple = args.join(' ')

    if (!cumple) {
      return sock.sendMessage(chatId, { text: 'Ingresa tu fecha de cumpleaños. Ej: `/setcumple 15 de Octubre`' }, { quoted: m })
    }

    const db = getDB()
    const user = getUser(db, sender)
    user.cumple = cumple
    saveDB(db)

    await sock.sendMessage(chatId, { text: `Fecha de cumpleaños actualizada: *${cumple}*` }, { quoted: m })
  }
}
