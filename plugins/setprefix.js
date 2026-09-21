import { OWNER_NUMBER } from '../config.js'
import { getDB, saveDB } from '../database.js'

export default {
  name: 'setprefix',

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

    const nuevoPrefijo = args.join(' ').trim()

    if (!nuevoPrefijo) {
      const db = getDB()
      const actual = db.config?.prefix || '/'

      return enviar(
        '🔤 *PREFIJO DEL BOT*\n\n' +
        `📌 Prefijo actual: *${actual}*\n\n` +
        '📌 Para cambiarlo usa:\n' +
        '/setprefix .\n\n' +
        '⚠️ Solo el OWNER puede cambiarlo.'
      )
    }

    if (nuevoPrefijo.length > 3) {
      return enviar(
        '❌ *PREFIJO INVÁLIDO*\n\n' +
        'El prefijo no puede tener más de 3 caracteres.'
      )
    }

    const db = getDB()

    if (!db.config) db.config = {}

    db.config.prefix = nuevoPrefijo
    saveDB(db)

    return enviar(
      '✅ *PREFIJO ACTUALIZADO*\n\n' +
      `🔤 Nuevo prefijo: *${nuevoPrefijo}*\n\n` +
      '👑 Solo el OWNER puede modificarlo.'
    )
  }
}
