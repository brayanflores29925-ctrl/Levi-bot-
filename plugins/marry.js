import { getDB, saveDB, getUser } from '../database.js'

export default {
  name: 'marry',
  aliases: ['casarse'],
  async execute(sock, m, args) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!target || target === sender) {
      return sock.sendMessage(chatId, { text: 'Debes etiquetar a la persona a la que le quieres proponer matrimonio.' }, { quoted: m })
    }

    const db = getDB()
    const user1 = getUser(db, sender)
    const user2 = getUser(db, target)

    if (user1.pareja) {
      return sock.sendMessage(chatId, { text: 'Ya estás casado. Primero debes divorciarte (`/divorcio`).' }, { quoted: m })
    }

    if (user2.pareja) {
      return sock.sendMessage(chatId, { text: '👀 La persona etiquetada ya está casada con alguien más.' }, { quoted: m })
    }

    db.propuestas[target] = {
      de: sender,
      fecha: Date.now()
    }
    saveDB(db)

    const propuestaText = `*¡PROPUESTA DE MATRIMONIO!* \n\n` +
                          `@${sender.split('@')[0]} le ha propuesto matrimonio a @${target.split('@')[0]}.\n\n` +
                          `@${target.split('@')[0]}, responde con:\n` +
                          `• \`/aceptar\` para dar el SÍ ❤️\n` +
                          `• \`/rechazar\` para romperle el corazón 💔`

    await sock.sendMessage(chatId, { text: propuestaText, mentions: [sender, target] }, { quoted: m })
  }
}
