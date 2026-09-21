import { OWNER_NUMBER } from '../config.js'
import { getDB, saveDB } from '../database.js'

export default {
  name: 'emojimenu',

  async execute(sock, m, args, enviar) {
    const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''

    const numero = sender
      .split('@')[0]
      .replace(/\D/g, '')

    if (!numero.endsWith(OWNER_NUMBER)) {
      return enviar(
        '❌ *ACCESO DENEGADO*\n\n' +
        'Este comando es exclusivo del OWNER de LeviBot.'
      )
    }

    const emoji = args.join(' ').trim()
    const db = getDB()

    if (!db.config) db.config = {}

    if (!emoji) {
      const actual = db.config.emojimenu || '🤖'

      return enviar(
        '😀 *EMOJI DEL MENÚ*\n\n' +
        `📌 Emoji actual: *${actual}*\n\n` +
        '📌 Para cambiarlo usa:\n' +
        '/emojimenu 🔥\n\n' +
        '👑 Solo el OWNER puede modificarlo.'
      )
    }

    db.config.emojimenu = emoji
    saveDB(db)

    return enviar(
      '✅ *EMOJI DEL MENÚ ACTUALIZADO*\n\n' +
      `😀 Nuevo emoji: *${emoji}*\n\n` +
      '👑 Solo el OWNER puede modificarlo.'
    )
  }
}
