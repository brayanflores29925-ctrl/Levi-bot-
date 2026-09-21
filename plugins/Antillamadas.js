import { getDB, saveDB } from '../database.js'

export default {
  name: 'Antillamadas',

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
        'Solo los administradores de este grupo pueden usar /Antillamadas.'
      )
    }

    const db = getDB()

    if (!db.config) db.config = {}
    if (!db.config.antillamadas) db.config.antillamadas = {}

    if (!args[0]) {
      const estado = db.config.antillamadas[chatId] ? 'ACTIVADO 🟢' : 'DESACTIVADO 🔴'

      return enviar(
        '📵 *ANTI LLAMADAS*\n\n' +
        `📌 Estado: *${estado}*\n\n` +
        'Usa:\n' +
        '• /Antillamadas on — Activar\n' +
        '• /Antillamadas off — Desactivar\n' +
        '• /Antillamadas estado — Ver estado\n\n' +
        '👑 Solo los administradores pueden modificarlo.'
      )
    }

    const opcion = args[0].toLowerCase()

    if (opcion === 'on' || opcion === 'activar') {
      db.config.antillamadas[chatId] = true
      saveDB(db)

      return enviar(
        '📵 *ANTI LLAMADAS ACTIVADO* 🟢\n\n' +
        'Las llamadas quedarán bloqueadas para este grupo.'
      )
    }

    if (opcion === 'off' || opcion === 'desactivar') {
      db.config.antillamadas[chatId] = false
      saveDB(db)

      return enviar(
        '📵 *ANTI LLAMADAS DESACTIVADO* 🔴\n\n' +
        'El control de llamadas quedó desactivado para este grupo.'
      )
    }

    if (opcion === 'estado') {
      const estado = db.config.antillamadas[chatId] ? 'ACTIVADO 🟢' : 'DESACTIVADO 🔴'

      return enviar(
        '📵 *ESTADO ANTI LLAMADAS*\n\n' +
        `📌 Este grupo: *${estado}*`
      )
    }

    return enviar(
      '❌ *OPCIÓN INVÁLIDA*\n\n' +
      'Usa:\n' +
      '• /Antillamadas on\n' +
      '• /Antillamadas off\n' +
      '• /Antillamadas estado'
    )
  }
}
