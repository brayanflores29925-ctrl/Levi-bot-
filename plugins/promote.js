export default {
  name: 'promote',

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

      const botId = sock.user?.id?.split(':')[0] + '@s.whatsapp.net'

      if (!admins.includes(botId)) {
        return enviar('❌ Necesito ser administrador para usar este comando.')
      }

      const mencionado =
        m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

      if (!mencionado) {
        return enviar(
          '❌ Menciona a la persona que quieres hacer administrador.\n\n' +
          'Ejemplo: /promote @usuario'
        )
      }

      await sock.groupParticipantsUpdate(
        chatId,
        [mencionado],
        'promote'
      )

      await enviar(
        `✅ @${mencionado.split('@')[0]} ahora es administrador del grupo.`,
        { mentions: [mencionado] }
      )

    } catch (error) {
      console.error('Error en /promote:', error)
      await enviar('❌ No se pudo hacer administrador a esa persona.')
    }
  }
}
