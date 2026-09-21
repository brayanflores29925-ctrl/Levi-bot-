import { getDB, saveDB } from '../database.js'

export default {
  name: 'antipv2',

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
        'Solo los administradores de este grupo pueden usar /antipv2.'
      )
    }

    const db = getDB()

    if (!db.config) db.config = {}
    if (!db.config.antipv2) db.config.antipv2 = {}

    if (!args[0]) {
      const estado = db.config.antipv2[chatId]
        ? 'ACTIVADO 🟢'
        : 'DESACTIVADO 🔴'

      return enviar(
        '🛡️ *ANTI PRIVADOS V2*\n\n' +
        `📌 Estado: *${estado}*\n\n` +
        'Usa:\n' +
        '• /antipv2 on — Activar\n' +
        '• /antipv2 off — Desactivar\n' +
        '• /antipv2 estado — Ver estado\n\n' +
        '👑 Solo los administradores pueden modificarlo.'
      )
    }

    const opcion = args[0].toLowerCase()

    if (opcion === 'on' || opcion === 'activar') {
      db.config.antipv2[chatId] = true
      saveDB(db)

      return enviar(
        '🛡️ *ANTI PRIVADOS V2 ACTIVADO* 🟢\n\n' +
        'La protección avanzada quedó activada para este grupo.'
      )
    }

    if (opcion === 'off' || opcion === 'desactivar') {
      db.config.antipv2[chatId] = false
      saveDB(db)

      return enviar(
        '🛡️ *ANTI PRIVADOS V2 DESACTIVADO* 🔴\n\n' +
        'La protección avanzada quedó desactivada para este grupo.'
      )
    }

    if (opcion === 'estado') {
      const estado = db.config.antipv2[chatId]
        ? 'ACTIVADO 🟢'
        : 'DESACTIVADO 🔴'

      return enviar(
        '🛡️ *ESTADO ANTI PRIVADOS V2*\n\n' +
        `📌 Este grupo: *${estado}*`
      )
    }

    return enviar(
      '❌ *OPCIÓN INVÁLIDA*\n\n' +
      'Usa:\n' +
      '• /antipv2 on\n' +
      '• /antipv2 off\n' +
      '• /antipv2 estado'
    )
  }
}
