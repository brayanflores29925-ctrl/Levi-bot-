import { getDB } from '../database.js'

export default {
  name: 'adv',
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

    const opcion = args?.[0]?.toLowerCase()

    const db = getDB()
    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}

    if (opcion === 'on') {
      db.grupos[chatId].adv = true
      await sock.sendMessage(chatId, { text: 'Sistema de advertencias activado.' }, { quoted: m })
    } else if (opcion === 'off') {
      db.grupos[chatId].adv = false
      await sock.sendMessage(chatId, { text: 'Sistema de advertencias desactivado.' }, { quoted: m })
    } else if (!isNaN(parseInt(opcion))) {
      db.grupos[chatId].advLimite = parseInt(opcion)
      await sock.sendMessage(chatId, { text: 'Limite de advertencias establecido en: ' + opcion }, { quoted: m })
    } else {
      await sock.sendMessage(chatId, { text: 'Uso: /adv on | /adv off | /adv <numero>' }, { quoted: m })
    }
  }
}
