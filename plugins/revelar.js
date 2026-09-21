import { getDB } from '../database.js'

export default {
  name: 'revelar',
  async execute(sock, m, args) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, { text: 'Este comando solo funciona en grupos.' }, { quoted: m })
    }

    const groupMeta = await sock.groupMetadata(chatId)
    const participants = groupMeta.participants
    const senderIsAdmin = participants.find(p => p.id === sender)?.admin

    if (!senderIsAdmin) {
      return await sock.sendMessage(chatId, { text: 'Solo un admin puede usar este comando.' }, { quoted: m })
    }

    const opcion = args?.[0]

    const db = getDB()
    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}

    if (opcion === '1') {
      db.grupos[chatId].revelar = true
      await sock.sendMessage(chatId, { text: 'Revelar mensajes de vista unica activado.' }, { quoted: m })
    } else if (opcion === '0') {
      db.grupos[chatId].revelar = false
      await sock.sendMessage(chatId, { text: 'Revelar mensajes de vista unica desactivado.' }, { quoted: m })
    } else {
      await sock.sendMessage(chatId, { text: 'Uso: /revelar 1 (activar) o /revelar 0 (desactivar)' }, { quoted: m })
    }
  }
}
