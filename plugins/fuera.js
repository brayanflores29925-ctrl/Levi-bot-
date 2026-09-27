export default {
  name: 'fuera',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.key?.participant || m.participant

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    try {
      const metadata = await sock.groupMetadata(chatId)

      const senderInfo = metadata.participants.find(
        p => p.id === sender
      )

      const senderIsAdmin =
        senderInfo?.admin === 'admin' ||
        senderInfo?.admin === 'superadmin'

      if (!senderIsAdmin) {
        return await sock.sendMessage(chatId, {
          text: '❌ Solo los administradores pueden usar /fuera.'
        })
      }

      await sock.sendMessage(chatId, {
        text:
          '👋 *FUERA*\n\n' +
          'Reacciona con 👋 al mensaje de una persona para expulsarla del grupo.'
      })
    } catch (error) {
      console.log(`[LEVI] Error en /fuera: ${error.message}`)
      await sock.sendMessage(chatId, {
        text: '❌ No pude comprobar los permisos del administrador.'
      })
    }
  }
}
