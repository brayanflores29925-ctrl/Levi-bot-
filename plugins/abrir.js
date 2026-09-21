export default {
  name: 'abrir',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const metadata = await sock.groupMetadata(chatId)
    const participante = metadata.participants.find(p => p.id === sender)

    const esAdmin =
      participante?.admin === 'admin' ||
      participante?.admin === 'superadmin'

    if (!esAdmin) {
      return sock.sendMessage(chatId, {
        text: '❌ Solo los administradores pueden usar /abrir.'
      })
    }

    await sock.groupSettingUpdate(chatId, 'not_announcement')

    await sock.sendMessage(chatId, {
      text: '🔓 *GRUPO ABIERTO*\n\nTodos los participantes pueden enviar mensajes.'
    })
  }
}
