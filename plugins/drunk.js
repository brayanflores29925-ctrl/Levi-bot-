export default {
  name: 'drunk',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🤪🌀 *${usuario}* anda todo mareado de caricatura 😂`
    })
  }
}
