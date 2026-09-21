export default {
  name: 'avatar',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const mencionado =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    const usuario = mencionado || m.key?.participant || m.participant || chatId

    try {
      const url = await sock.profilePictureUrl(usuario, 'image')

      await sock.sendMessage(
        chatId,
        {
          image: { url },
          caption: `🖼️ Foto de perfil de @${usuario.split('@')[0]}`
        },
        {
          quoted: m,
          mentions: [usuario]
        }
      )
    } catch (error) {
      console.error('Error en /avatar:', error)
      await enviar('❌ No pude obtener la foto de perfil.')
    }
  }
}
