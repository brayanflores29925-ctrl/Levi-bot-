export default {
  name: 'dados',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const resultado = Math.floor(Math.random() * 6) + 1

    await sock.sendMessage(chatId, {
      text:
        '🎲 *DADOS LEVIBOT*\n\n' +
        `🎯 Resultado: *${resultado}*\n\n` +
        '🍀 ¡Buena suerte!'
    })
  }
}
