import { getDB, saveDB } from '../database.js'

export default {
  name: 'antipv',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ *ESTE COMANDO SOLO FUNCIONA EN GRUPOS.*')
    }

    const metadata = await sock.groupMetadata(chatId)

    const participante = metadata.participants.find(
      p => p.id === sender
    )

    const esAdmin =
      participante?.admin === 'admin' ||
      participante?.admin === 'superadmin'

    if (!esAdmin) {
      return enviar(
        '❌ *ACCESO DENEGADO*\n\n' +
        'Solo los administradores de este grupo pueden usar /antipv.'
      )
    }

    const db = getDB()

    if (!db.config) db.config = {}
    if (!db.config.antipv) db.config.antipv = {}

    if (!args[0]) {
      const estado = db.config.antipv[chatId]
        ? 'ACTIVADO 🟢'
        : 'DESACTIVADO 🔴'

      return enviar(
        '🛡️ *ANTI PRIVADOS*\n\n' +
        `📌 Estado: *${estado}*\n\n` +
        'Usa:\n' +
        '• /antipv on — Activar\n' +
        '• /antipv off — Desactivar\n' +
        '• /antipv estado — Ver estado\n\n' +
        '👑 Solo los administradores pueden modificarlo.'
      )
    }

    const opcion = args[0].toLowerCase()

    if (opcion === 'on' || opcion === 'activar') {
      db.config.antipv[chatId] = true
      saveDB(db)

      return enviar(
        '🛡️ *ANTI PRIVADOS ACTIVADO* 🟢\n\n' +
        'La protección quedó activada para este grupo.'
      )
    }

    if (opcion === 'off' || opcion === 'desactivar') {
      db.config.antipv[chatId] = false
      saveDB(db)

      return enviar(
        '🛡️ *ANTI PRIVADOS DESACTIVADO* 🔴\n\n' +
        'La protección quedó desactivada para este grupo.'
      )
    }

    if (opcion === 'estado') {
      const estado = db.config.antipv[chatId]
        ? 'ACTIVADO 🟢'
        : 'DESACTIVADO 🔴'

      return enviar(
        '🛡️ *ESTADO ANTI PRIVADOS*\n\n' +
        `📌 Este grupo: *${estado}*`
      )
    }

    return enviar(
      '❌ *OPCIÓN INVÁLIDA*\n\n' +
      'Usa:\n' +
      '• /antipv on\n' +
      '• /antipv off\n' +
      '• /antipv estado'
    )
  }
}
