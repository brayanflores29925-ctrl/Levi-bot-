export default {
  name: 'odelete',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId) return

    const context =
      m.message?.extendedTextMessage?.contextInfo

    const stanzaId = context?.stanzaId
    const participant =
      context?.participant ||
      context?.remoteJid ||
      chatId

    if (!stanzaId) {
      return await sock.sendMessage(chatId, {
        text:
          '❌ Debes responder al mensaje que quieres borrar.\n\n' +
          '👉 Responde al mensaje y escribe:\n' +
          '/odelete'
      })
    }

    try {
      await sock.sendMessage(chatId, {
        delete: {
          remoteJid: chatId,
          fromMe: participant === sock.user?.id,
          id: stanzaId,
          participant
        }
      })
    } catch (error) {
      await sock.sendMessage(chatId, {
        text:
          '❌ No pude borrar ese mensaje.\n\n' +
          'Puede que LeviBot no tenga permisos suficientes.'
      })
    }
  }
}
