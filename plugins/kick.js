export default {
  name: 'Kick',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const mentioned =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []

    const participant =
      m.message?.extendedTextMessage?.contextInfo?.participant

    const usuario = mentioned[0] || participant

    if (!usuario) {
      return await sock.sendMessage(chatId, {
        text: '❌ Menciona al usuario que quieres expulsar.\n\nEjemplo: /Kick @usuario'
      })
    }

    try {
      await sock.groupParticipantsUpdate(
        chatId,
        [usuario],
        'remove'
      )

      await sock.sendMessage(chatId, {
        text: `✅ Usuario expulsado correctamente.`
      })
    } catch (error) {
      await sock.sendMessage(chatId, {
        text: '❌ No pude expulsar al usuario. Asegúrate de que LeviBot sea administrador del grupo.'
      })
    }
  }
}
