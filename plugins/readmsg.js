import { OWNER_NUMBER } from '../config.js'
import { getDB, saveDB } from '../database.js'

export default {
  name: 'readmsg',

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

    const db = getDB()

    if (!db.config) db.config = {}

    if (!args[0]) {
      const estado = db.config.readmsg
        ? 'ACTIVADO 🟢'
        : 'DESACTIVADO 🔴'

      return enviar(
        '📖 *LECTURA DE MENSAJES*\n\n' +
        `📌 Estado: *${estado}*\n\n` +
        'Usa:\n' +
        '• /readmsg on — Activar\n' +
        '• /readmsg off — Desactivar\n' +
        '• /readmsg estado — Ver estado\n\n' +
        '👑 Solo el OWNER puede modificarlo.'
      )
    }

    const opcion = args[0].toLowerCase()

    if (opcion === 'on' || opcion === 'activar') {
      db.config.readmsg = true
      saveDB(db)

      return enviar(
        '📖 *LECTURA DE MENSAJES ACTIVADA* 🟢\n\n' +
        'LeviBot marcará los mensajes como leídos.'
      )
    }

    if (opcion === 'off' || opcion === 'desactivar') {
      db.config.readmsg = false
      saveDB(db)

      return enviar(
        '📖 *LECTURA DE MENSAJES DESACTIVADA* 🔴\n\n' +
        'LeviBot dejará de marcar los mensajes como leídos.'
      )
    }

    if (opcion === 'estado') {
      const estado = db.config.readmsg
        ? 'ACTIVADO 🟢'
        : 'DESACTIVADO 🔴'

      return enviar(
        '📖 *ESTADO DE LECTURA*\n\n' +
        `📌 Estado: *${estado}*`
      )
    }

    return enviar(
      '❌ *OPCIÓN INVÁLIDA*\n\n' +
      'Usa:\n' +
      '• /readmsg on\n' +
      '• /readmsg off\n' +
      '• /readmsg estado'
    )
  }
}
