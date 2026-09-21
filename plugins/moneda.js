export default {
  name: 'moneda',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const resultado = Math.random() < 0.5 ? 'CARA 🪙' : 'CRUZ 🪙'

    await sock.sendMessage(chatId, {
      text:
        '🪙 *MONEDA LEVIBOT*\n\n' +
        `🎯 Resultado: *${resultado}*\n\n` +
        '🍀 ¡Suerte!'
    })
  }
}
