import { getDB, saveDB, getUser } from '../database.js'

export default {
  name: 'delgenero',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const db = getDB()
    const user = getUser(db, sender)
    user.genero = 'No especificado'
    saveDB(db)

    await sock.sendMessage(chatId, { text: 'Campo de género restablecido.' }, { quoted: m })
  }
}
