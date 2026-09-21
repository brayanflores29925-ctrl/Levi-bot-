export default {
  name: 'comfort',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `🫂💙 *${usuario}* brinda apoyo y un abrazo amistoso al grupo 🤗`
    })
  }
}
