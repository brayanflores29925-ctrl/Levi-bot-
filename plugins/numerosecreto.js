const juegos = new Map()

export default {
  name: 'numerosecreto',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const intentoTexto = parts?.[0]

    if (!intentoTexto) {
      const numero = Math.floor(Math.random() * 50) + 1

      juegos.set(chatId, {
        numero,
        intentos: 0
      })

      return sock.sendMessage(chatId, {
        text:
          '🔐 *NÚMERO SECRETO LEVIBOT*\n\n' +
          '🎯 He elegido un número secreto del *1 al 50*.\n\n' +
          '👉 Intenta encontrarlo usando:\n' +
          '/numerosecreto 25\n\n' +
          '💡 Te diré si debes buscar un número *más alto* o *más bajo*.'
      })
    }

    const juego = juegos.get(chatId)
    const intento = Number(intentoTexto)

    if (!juego) {
      return sock.sendMessage(chatId, {
        text:
          '❓ No hay un juego activo.\n\n' +
          'Usa */numerosecreto* para comenzar.'
      })
    }

    if (!Number.isInteger(intento) || intento < 1 || intento > 50) {
      return sock.sendMessage(chatId, {
        text: '❌ Escribe un número entero entre *1 y 50*.'
      })
    }

    juego.intentos++

    if (intento === juego.numero) {
      const intentos = juego.intentos
      juegos.delete(chatId)

      return sock.sendMessage(chatId, {
        text:
          '🎉 *¡GANASTE!*\n\n' +
          `🔐 El número secreto era: *${juego.numero}*\n` +
          `🎯 Lo encontraste en *${intentos} intento(s)*.\n\n` +
          '🏆 ¡Excelente!'
      })
    }

    if (intento < juego.numero) {
      return sock.sendMessage(chatId, {
        text:
          '❌ *No es ese número.*\n\n' +
          '⬆️ El número secreto es *más alto*.\n\n' +
          `🎯 Intentos: *${juego.intentos}*`
      })
    }

    return sock.sendMessage(chatId, {
      text:
        '❌ *No es ese número.*\n\n' +
        '⬇️ El número secreto es *más bajo*.\n\n' +
        `🎯 Intentos: *${juego.intentos}*`
    })
  }
}
