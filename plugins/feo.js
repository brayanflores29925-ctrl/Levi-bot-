export default {
  name: 'feo',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😂🎭 *${usuario}* puso su cara más graciosa de caricatura... ¡qué expresión! 😆`
    })
  }
}
