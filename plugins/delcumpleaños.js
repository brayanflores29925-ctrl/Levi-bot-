import { getDB, saveDB, getUser } from '../database.js'

export default {
  name: 'delcumple',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const db = getDB()
    const user = getUser(db, sender)
    user.cumple = 'No configurado'
    saveDB(db)

    await sock.sendMessage(chatId, { text: 'Fecha de cumpleaños eliminada.' }, { quoted: m })
  }
}
