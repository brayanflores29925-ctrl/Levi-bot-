export default {
  name: 'demote',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    try {
      const metadata = await sock.groupMetadata(chatId)

      const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)

      if (!admins.includes(sender)) {
        return enviar('❌ Este comando es solo para administradores.')
      }

      const mencionado =
        m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

      if (!mencionado) {
        return enviar(
          '❌ Menciona al administrador que quieres quitar.\n\n' +
          'Ejemplo: /demote @usuario'
        )
      }

      await sock.groupParticipantsUpdate(
        chatId,
        [mencionado],
        'demote'
      )

      await enviar(
        `✅ @${mencionado.split('@')[0]} ya no es administrador.`,
        { mentions: [mencionado] }
      )

    } catch (error) {
      console.error('Error en /demote:', error)
      await enviar('❌ No se pudo quitar el administrador.')
    }
  }
}
