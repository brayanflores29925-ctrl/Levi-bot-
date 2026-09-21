import { getDB } from '../database.js'

export default {
  name: 'advlist',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, { text: 'Este comando solo funciona en grupos.' }, { quoted: m })
    }

    const db = getDB()
    const advertencias = db.grupos?.[chatId]?.advertencias || {}

    const usuarios = Object.keys(advertencias).filter(id => advertencias[id] > 0)

    if (usuarios.length === 0) {
      return await sock.sendMessage(chatId, { text: 'No hay usuarios con advertencias en este grupo.' }, { quoted: m })
    }

    let texto = '*USUARIOS CON ADVERTENCIAS*\n\n'
    usuarios.forEach(id => {
      texto += '@' + id.split('@')[0] + ': ' + advertencias[id] + '\n'
    })

    await sock.sendMessage(chatId, { text: texto, mentions: usuarios }, { quoted: m })
  }
}
