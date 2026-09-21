export default {
  name: 'smoke',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🌫️💨 *${usuario}* aparece entre una nube de humo de caricatura 😂`
    })
  }
}
