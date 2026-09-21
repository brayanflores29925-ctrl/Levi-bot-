import { OWNER_NUMBER } from '../config.js'
import { getDB, saveDB } from '../database.js'

export default {
  name: 'nombredinero',

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

    const nombre = args.join(' ').trim()
    const db = getDB()

    if (!db.config) db.config = {}

    if (!nombre) {
      const actual = db.config.nombredinero || 'Coins'

      return enviar(
        '💰 *NOMBRE DEL DINERO*\n\n' +
        `📌 Nombre actual: *${actual}*\n\n` +
        '📌 Para cambiarlo usa:\n' +
        '/nombredinero LeviCoins\n\n' +
        '👑 Solo el OWNER puede modificarlo.'
      )
    }

    if (nombre.length > 30) {
      return enviar(
        '❌ *NOMBRE DEMASIADO LARGO*\n\n' +
        'El nombre no puede superar los 30 caracteres.'
      )
    }

    db.config.nombredinero = nombre
    saveDB(db)

    return enviar(
      '✅ *NOMBRE DEL DINERO ACTUALIZADO*\n\n' +
      `💰 Nuevo nombre: *${nombre}*\n\n` +
      '👑 Solo el OWNER puede modificarlo.'
    )
  }
}
