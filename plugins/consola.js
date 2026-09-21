import { OWNER_NUMBER } from '../config.js'

export default {
  name: 'consola',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''

    const numero = sender
      .split('@')[0]
      .replace(/\D/g, '')

    if (!numero.endsWith(OWNER_NUMBER)) {
      return await sock.sendMessage(chatId, {
        text: '❌ *ACCESO DENEGADO*\n\nEste comando es exclusivo del OWNER de LeviBot.'
      })
    }

    await sock.sendMessage(chatId, {
      text: '🖥️ *CONSOLA DE LEVIBOT*\n\n✅ Acceso autorizado.\n\n👑 OWNER verificado.\n\nLa consola controlada está activa.'
    })
  }
}
