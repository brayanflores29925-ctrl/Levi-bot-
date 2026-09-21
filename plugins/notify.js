export default {
  name: 'notify',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const texto = parts?.join(' ').trim()

    if (!texto) {
      return sock.sendMessage(chatId, {
        text: '❌ Escribe el mensaje que quieres notificar.\n\nEjemplo:\n/notify Reunión del grupo a las 8 PM'
      })
    }

    try {
      const metadata = await sock.groupMetadata(chatId)
      const participantes = metadata.participants.map(p => p.id)

      await sock.sendMessage(chatId, {
        text: `📢 *NOTIFICACIÓN*\n\n${texto}`,
        mentions: participantes
      })
    } catch {
      await sock.sendMessage(chatId, {
        text: '❌ No pude enviar la notificación.'
      })
    }
  }
}
