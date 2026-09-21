import { getDB, saveDB, getUser } from '../database.js'

export default {
  name: 'setgenero',
  async execute(sock, m, args) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const genero = args.join(' ')

    if (!genero) {
      return sock.sendMessage(chatId, { text: 'Especifica tu género. Ej: `/setgenero Masculino`' }, { quoted: m })
    }

    const db = getDB()
    const user = getUser(db, sender)
    user.genero = genero
    saveDB(db)

    await sock.sendMessage(chatId, { text: `Género guardado como: *${genero}*` }, { quoted: m })
  }
}
