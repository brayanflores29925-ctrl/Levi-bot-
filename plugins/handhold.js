export default {
  name: 'handhold',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🤝 *${usuario}* toma la mano de alguien del grupo de forma amistosa 😊`
    })
  }
}
