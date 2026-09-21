import { OWNER_NUMBER } from '../config.js'
import { getDB, saveDB } from '../database.js'

export default {
  name: 'nombrebot',

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

    const nuevoNombre = args.join(' ').trim()

    if (!nuevoNombre) {
      const db = getDB()
      const actual = db.config?.nombrebot || 'LeviBot'

      return enviar(
        '🤖 *NOMBRE DEL BOT*\n\n' +
        `📌 Nombre actual: *${actual}*\n\n` +
        '📌 Para cambiarlo usa:\n' +
        '/nombrebot NuevoNombre'
      )
    }

    const db = getDB()

    if (!db.config) db.config = {}

    db.config.nombrebot = nuevoNombre
    saveDB(db)

    return enviar(
      '✅ *NOMBRE ACTUALIZADO*\n\n' +
      `🤖 Nuevo nombre: *${nuevoNombre}*`
    )
  }
}
