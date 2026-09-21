export default {
  name: 'tableflip',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const usuario = m.pushName || 'Usuario'

    await sock.sendMessage(chatId, {
      text: `😤 *${usuario}* hizo un tableflip de caricatura (╯°□°）╯︵ ┻━┻`
    })
  }
}
