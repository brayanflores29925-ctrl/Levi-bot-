export default {
  name: 'coffee',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `☕ *${usuario}* se está tomando un cafecito 😌`
    })
  }
}
