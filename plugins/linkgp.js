export default {
  name: 'Linkgp',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    try {
      const codigo = await sock.groupInviteCode(chatId)
      const enlace = `https://chat.whatsapp.com/${codigo}`

      await sock.sendMessage(chatId, {
        text: `🔗 *ENLACE DEL GRUPO*\n\n${enlace}`
      })
    } catch {
      await sock.sendMessage(chatId, {
        text: '❌ No pude obtener el enlace. LeviBot debe tener permisos de administrador.'
      })
    }
  }
}
