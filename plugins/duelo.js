const duelos = new Map()

export default {
  name: 'duelo',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const mencionado =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return sock.sendMessage(chatId, {
        text:
          '⚔️ *DUELO LEVIBOT*\n\n' +
          'Menciona a la persona que quieres desafiar.\n\n' +
          'Ejemplo:\n' +
          '/duelo @usuario',
        mentions: []
      })
    }

    if (mencionado === sender) {
      return sock.sendMessage(chatId, {
        text: '❌ No puedes desafiarte a ti mismo.'
      })
    }

    const jugador1 = Math.floor(Math.random() * 100) + 1
    const jugador2 = Math.floor(Math.random() * 100) + 1

    const ganador =
      jugador1 >= jugador2
        ? sender
        : mencionado

    const nombreGanador =
      ganador === sender ? 'Desafiante' : 'Desafiado'

    await sock.sendMessage(chatId, {
      text:
        '⚔️ *DUELO LEVIBOT*\n\n' +
        `👤 @${sender.split('@')[0]}: *${jugador1} puntos*\n` +
        `👤 @${mencionado.split('@')[0]}: *${jugador2} puntos*\n\n` +
        `🏆 *Ganador:* ${nombreGanador}\n\n` +
        `🎉 ¡Felicidades @${ganador.split('@')[0]}!`,
      mentions: [sender, mencionado, ganador]
    })
  }
}
