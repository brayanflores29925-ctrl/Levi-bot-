export default {
  name: 'Activo',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    await sock.sendMessage(chatId, {
      text:
        '🟢 *LEVI BOT ACTIVO*\n\n' +
        '🤖 LeviBot está activo y listo para recibir comandos.\n\n' +
        '📋 Usa /menu para ver los comandos disponibles.'
    })
  }
}
