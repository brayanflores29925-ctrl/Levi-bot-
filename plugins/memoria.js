const juegos = new Map()

const emojis = ['🍎', '🚀', '🐱', '⭐', '🎲', '🌈', '🔥', '🎵']

export default {
  name: 'memoria',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const respuesta = parts?.join(' ').trim()

    if (respuesta) {
      const juego = juegos.get(chatId)

      if (!juego) {
        return sock.sendMessage(chatId, {
          text: '🧠 No hay un juego de memoria activo.\n\nUsa /memoria para comenzar.'
        })
      }

      const correcto = respuesta.replace(/\s/g, '') === juego.secuencia.join('')
      juegos.delete(chatId)

      return sock.sendMessage(chatId, {
        text: correcto
          ? '🎉 *¡Correcto! Ganaste el juego de memoria.* 🧠🏆'
          : `❌ *Incorrecto.*\n\nLa secuencia era:\n${juego.secuencia.join(' ')}`
      })
    }

    const secuencia = Array.from(
      { length: 4 },
      () => emojis[Math.floor(Math.random() * emojis.length)]
    )

    juegos.set(chatId, { secuencia })

    await sock.sendMessage(chatId, {
      text:
        '🧠 *JUEGO DE MEMORIA*\n\n' +
        `👀 Memoriza esta secuencia:\n\n${secuencia.join(' ')}\n\n` +
        '⏳ Ahora escribe los emojis en el mismo orden.\n\n' +
        'Ejemplo: 🍎🚀🐱⭐'
    })
  }
}
