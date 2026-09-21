import { getDB } from '../database.js'

export default {
  name: 'warn',
  async execute(sock, m) {
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

    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if (!target) {
      return await sock.sendMessage(chatId, { text: 'Menciona a la persona que quieres advertir.' }, { quoted: m })
    }

    const db = getDB()
    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}
    if (!db.grupos[chatId].advertencias) db.grupos[chatId].advertencias = {}
    if (!db.grupos[chatId].advertencias[target]) db.grupos[chatId].advertencias[target] = 0

    db.grupos[chatId].advertencias[target]++
    const cantidad = db.grupos[chatId].advertencias[target]
    const limite = db.grupos[chatId].advLimite || 3

    await sock.sendMessage(chatId, {
      text: 'Advertencia registrada. (' + cantidad + '/' + limite + ')',
      mentions: [target]
    }, { quoted: m })

    if (cantidad >= limite) {
      await sock.groupParticipantsUpdate(chatId, [target], 'remove')
      db.grupos[chatId].advertencias[target] = 0
      await sock.sendMessage(chatId, { text: 'Usuario expulsado por alcanzar el limite de advertencias.' }, { quoted: m })
    }
  }
}
