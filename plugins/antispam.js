import { getDB, saveDB } from '../database.js'

export default {
  name: 'antispam',

  async execute(sock, m, args) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      }, { quoted: m })
    }

    const metadata = await sock.groupMetadata(chatId)
    const participante = metadata.participants.find(p => p.id === sender)

    if (!participante?.admin) {
      return await sock.sendMessage(chatId, {
        text: '❌ Solo un administrador puede configurar el Antispam.'
      }, { quoted: m })
    }

    const opcion = String(args?.[0] || '').toLowerCase()

    if (opcion !== '1' && opcion !== '0') {
      return await sock.sendMessage(chatId, {
        text: `🛡️ *ANTISPAM*

📌 Uso:
 /Antispam 1 — Activar
 /Antispam 0 — Desactivar`
      }, { quoted: m })
    }

    const db = getDB()

    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}

    db.grupos[chatId].antispam = opcion === '1'
    saveDB(db)

    await sock.sendMessage(chatId, {
      text: opcion === '1'
        ? '✅ *ANTISPAM ACTIVADO*\n\n🛡️ La protección contra spam quedó activada en este grupo.'
        : '❌ *ANTISPAM DESACTIVADO*\n\n🛡️ La protección contra spam quedó desactivada en este grupo.'
    }, { quoted: m })
  }
}
