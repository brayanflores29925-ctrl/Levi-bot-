const OWNER = '50494874330@s.whatsapp.net'

export default {
  name: 'Addprefijo',

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
        text: '❌ Usa: /Addprefijo <prefijo>\n\nEjemplo: /Addprefijo $'
      })
    }

    if (prefijo.length > 3) {
      return await sock.sendMessage(chatId, {
        text: '❌ El prefijo no puede tener más de 3 caracteres.'
      })
    }

    await sock.sendMessage(chatId, {
      text: `✅ El prefijo *${prefijo}* fue configurado correctamente por el dueño de LeviBot.`
    })
  }
}
