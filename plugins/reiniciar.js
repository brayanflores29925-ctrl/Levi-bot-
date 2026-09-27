import { esOwner } from '../config.js'

export default {
  name: 'reiniciar',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    if (!esOwner(m)) {
      return await sock.sendMessage(chatId, {
        text: '❌ *ACCESO DENEGADO*\n\nEste comando es exclusivo del OWNER de LeviBot.'
      })
    }

    await sock.sendMessage(chatId, {
      text: '🔄 *REINICIANDO LEVIBOT...*\n\n⏳ La conexión se reiniciará automáticamente.'
    })

    setTimeout(() => {
      try {
        if (sock.ws?.close) {
          sock.ws.close()
        } else if (sock.end) {
          sock.end(new Error('Reinicio solicitado por el OWNER'))
        }
      } catch {}
    }, 1500)
  }
}
