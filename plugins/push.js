export default {
  name: 'push',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `👉😄 *${usuario}* hace un empujoncito de caricatura 💨`
    })
  }
}
