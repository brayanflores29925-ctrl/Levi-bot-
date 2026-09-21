export default {
  name: 'del',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const context = m.message?.extendedTextMessage?.contextInfo
    const stanzaId = context?.stanzaId

    if (!stanzaId) {
      return enviar(
        '🗑️ *DEL*\n\n' +
        'Responde a un mensaje con /del para eliminarlo.'
      )
    }

    const key = {
      remoteJid: chatId,
      fromMe: context?.participant ? false : true,
      id: stanzaId
    }

    if (context?.participant) {
      key.participant = context.participant
    }

    await sock.sendMessage(chatId, { delete: key })
  }
}
