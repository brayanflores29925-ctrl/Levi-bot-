export default {
  name: 'Bangp',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ *Este comando solo funciona en grupos.*')
    }

    const metadata = await sock.groupMetadata(chatId)
    const participante = metadata.participants.find(p => p.id === sender)

    const esAdmin =
      participante?.admin === 'admin' ||
      participante?.admin === 'superadmin'

    if (!esAdmin) {
      return enviar('❌ *ACCESO DENEGADO*\n\nSolo los administradores pueden usar /Bangp.')
    }

    const opcion = (args[0] || '').toLowerCase()

    if (!opcion) {
      return enviar(
        '👑 *ADMINISTRACIÓN DEL GRUPO*\n\n' +
        '📌 *Uso:*\n\n' +
        '/Bangp abrir — Abrir el grupo\n' +
        '/Bangp cerrar — Cerrar el grupo\n' +
        '/Bangp info — Información del grupo'
      )
    }

    if (opcion === 'abrir') {
      await sock.groupSettingUpdate(chatId, 'not_announcement')

      return enviar(
        '🔓 *GRUPO ABIERTO*\n\n' +
        'Todos los participantes pueden enviar mensajes.'
      )
    }

    if (opcion === 'cerrar') {
      await sock.groupSettingUpdate(chatId, 'announcement')

      return enviar(
        '🔒 *GRUPO CERRADO*\n\n' +
        'Solo los administradores pueden enviar mensajes.'
      )
    }

    if (opcion === 'info') {
      const nombre = metadata.subject || 'Sin nombre'
      const miembros = metadata.participants?.length || 0

      return enviar(
        '👥 *INFORMACIÓN DEL GRUPO*\n\n' +
        `📌 Nombre: *${nombre}*\n` +
        `👥 Miembros: *${miembros}*`
      )
    }

    return enviar(
      '❌ *OPCIÓN INVÁLIDA*\n\n' +
      'Usa:\n' +
      '/Bangp abrir\n' +
      '/Bangp cerrar\n' +
      '/Bangp info'
    )
  }
}
