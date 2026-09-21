export default {
  name: 'ship',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []

    if (mentions.length < 2) {
      return enviar(
        '❤️ *SHIP*\n\n' +
        'Debes etiquetar a dos personas.\n\n' +
        'Ejemplo:\n' +
        '/ship @persona1 @persona2'
      )
    }

    const persona1 = mentions[0]
    const persona2 = mentions[1]

    const porcentaje = Math.floor(Math.random() * 101)

    await sock.sendMessage(chatId, {
      text:
        `❤️ *COMPATIBILIDAD*\n\n` +
        `@${persona1.split('@')[0]} ❤️ @${persona2.split('@')[0]}\n\n` +
        `💘 Compatibilidad: *${porcentaje}%*`,
      mentions: [persona1, persona2]
    }, { quoted: m })
  }
}
