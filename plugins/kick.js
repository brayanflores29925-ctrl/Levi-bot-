export default {
  name: 'Kick',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const contextInfo =
      m.message?.extendedTextMessage?.contextInfo || {}

    const mentioned = contextInfo.mentionedJid || []

    const citado =
      contextInfo.participant

    const usuario = mentioned[0] || citado

    if (!usuario) {
      return await sock.sendMessage(chatId, {
        text:
          '❌ Menciona al usuario o responde a su mensaje.\n\n' +
          'Ejemplos:\n' +
          '/kick @usuario\n' +
          'Responde a un mensaje con /kick'
      })
    }

    try {
      await sock.groupParticipantsUpdate(
        chatId,
        [usuario],
        'remove'
      )

      await sock.sendMessage(chatId, {
        text: '✅ Usuario expulsado correctamente.'
      })
    } catch (error) {
      console.error('❌ ERROR EN KICK:', error)

      await sock.sendMessage(chatId, {
        text:
          '❌ No pude expulsar al usuario. ' +
          'Asegúrate de que LeviBot sea administrador del grupo.'
      })
    }
  }
}
