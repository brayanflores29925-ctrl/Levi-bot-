export default {
  name: 'Degradar',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const mentioned =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []

    const participant =
      m.message?.extendedTextMessage?.contextInfo?.participant

    const usuario = mentioned[0] || participant

    if (!usuario) {
      return sock.sendMessage(chatId, {
        text: '❌ Menciona al administrador que quieres degradar.\n\nEjemplo: /Degradar @usuario'
      })
    }

    try {
      await sock.groupParticipantsUpdate(
        chatId,
        [usuario],
        'demote'
      )

      await sock.sendMessage(chatId, {
        text: '✅ Usuario degradado correctamente.'
      })
    } catch {
      await sock.sendMessage(chatId, {
        text: '❌ No pude degradar al usuario. Asegúrate de que LeviBot sea administrador.'
      })
    }
  }
}
