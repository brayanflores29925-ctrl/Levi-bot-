export default {
  name: 'trip',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😵‍💫👣 *${usuario}* tropezó de caricatura... ¡ups! 😂`
    })
  }
}
