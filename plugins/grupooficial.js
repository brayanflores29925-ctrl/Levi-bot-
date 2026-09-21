export default {
  name: 'grupooficial',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    const GRUPO_OFICIAL = '120363405079498012@g.us'

    if (chatId === GRUPO_OFICIAL) {
      await sock.sendMessage(chatId, {
        text: '✅ Este es el GRUPO OFICIAL de LeviBot.\n\n📢 Canal oficial:\nhttps://whatsapp.com/channel/0029VbDBJk4BfxoCBx5ov41yy'
      })
    } else {
      await sock.sendMessage(chatId, {
        text: '❌ Este no es el grupo oficial de LeviBot.\n\n👥 Grupo oficial:\nhttps://chat.whatsapp.com/EIUm1G9DrrzB440yROjOEq\n\n📢 Canal oficial:\nhttps://whatsapp.com/channel/0029VbDBJk4BfxoCBx5ov41yy'
      })
    }
  }
}
