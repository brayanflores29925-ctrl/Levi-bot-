import { getDB, saveDB } from '../database.js'

export default {
  name: 'addpalabra',

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
        text: '❌ Solo un administrador puede agregar palabras al filtro.'
      }, { quoted: m })
    }

    const palabra = args?.join(' ').trim().toLowerCase()

    if (!palabra) {
      return await sock.sendMessage(chatId, {
        text: `❌ Uso incorrecto.

📌 Usa:
 /Addpalabra <palabra>

📝 Ejemplo:
 /Addpalabra groseria`
      }, { quoted: m })
    }

    const db = getDB()

    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}
    if (!Array.isArray(db.grupos[chatId].palabrasProhibidas)) {
      db.grupos[chatId].palabrasProhibidas = []
    }

    const lista = db.grupos[chatId].palabrasProhibidas

    if (lista.includes(palabra)) {
      return await sock.sendMessage(chatId, {
        text: `⚠️ La palabra *${palabra}* ya está registrada en el filtro.`
      }, { quoted: m })
    }

    lista.push(palabra)
    saveDB(db)

    await sock.sendMessage(chatId, {
      text: `✅ *PALABRA AGREGADA*

➕ Palabra: *${palabra}*

🛡️ La palabra fue añadida correctamente al filtro.`
    }, { quoted: m })
  }
}
