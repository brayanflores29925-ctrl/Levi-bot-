const OWNER = '50494874330@s.whatsapp.net'

export default {
  name: 'delprefijo',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (sender !== OWNER) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando es exclusivo del dueño de LeviBot.'
      })
    }

    const prefijo = parts?.[0]

    if (!prefijo) {
      return await sock.sendMessage(chatId, {
        text: '❌ Usa: /delprefijo <prefijo>\n\nEjemplo: /delprefijo $'
      })
    }

    await sock.sendMessage(chatId, {
      text: `✅ El prefijo *${prefijo}* fue eliminado correctamente.`
    })
  }
}
