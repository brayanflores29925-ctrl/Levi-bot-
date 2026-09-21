export default {
  name: 'cerrar',

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
        text: '❌ Solo los administradores pueden usar /cerrar.'
      })
    }

    await sock.groupSettingUpdate(chatId, 'announcement')

    await sock.sendMessage(chatId, {
      text: '🔒 *GRUPO CERRADO*\n\nSolo los administradores pueden enviar mensajes.'
    })
  }
}
