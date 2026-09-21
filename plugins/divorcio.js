import { getDB, saveDB, getUser } from '../database.js'

export default {
  name: 'divorcio',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const db = getDB()
    const user = getUser(db, sender)

    if (!user.pareja) {
      return sock.sendMessage(chatId, { text: 'No estás casado/a con nadie actualmente.' }, { quoted: m })
    }

    const ex = user.pareja
    const exUser = getUser(db, ex)

    user.pareja = null
    exUser.pareja = null
    saveDB(db)

    const divorcioText = `*DIVORCIO COMPLETADO*\n\n` +
                         `@${sender.split('@')[0]} se ha divorciado de @${ex.split('@')[0]}.\n` +
                         `Ambos vuelven a estar disponibles en el mercado.`

    await sock.sendMessage(chatId, { text: divorcioText, mentions: [sender, ex] }, { quoted: m })
  }
}
