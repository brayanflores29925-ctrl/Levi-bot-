import { getDB, saveDB } from '../database.js'

export default {
  name: 'delpalabra',

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
        text: '❌ Solo un administrador puede eliminar palabras del filtro.'
      }, { quoted: m })
    }

    const palabra = args?.join(' ').trim().toLowerCase()

    if (!palabra) {
      return await sock.sendMessage(chatId, {
        text: `❌ Uso incorrecto.

📌 Usa:
 /Delpalabra <palabra>

📝 Ejemplo:
 /Delpalabra idiota`
      }, { quoted: m })
    }

    const db = getDB()

    if (!db.grupos?.[chatId]?.palabrasProhibidas) {
      return await sock.sendMessage(chatId, {
        text: `⚠️ La palabra *${palabra}* no está registrada.`
      }, { quoted: m })
    }

    const lista = db.grupos[chatId].palabrasProhibidas
    const indice = lista.indexOf(palabra)

    if (indice === -1) {
      return await sock.sendMessage(chatId, {
        text: `⚠️ La palabra *${palabra}* no está registrada.`
      }, { quoted: m })
    }

    lista.splice(indice, 1)
    saveDB(db)

    await sock.sendMessage(chatId, {
      text: `✅ *PALABRA ELIMINADA*

➖ Palabra: *${palabra}*

🛡️ Ya no será bloqueada por el filtro.`
    }, { quoted: m })
  }
}
