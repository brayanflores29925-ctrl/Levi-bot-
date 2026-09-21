const preguntas = [
  { texto: '🌎 La Tierra gira alrededor del Sol.', respuesta: 'verdadero' },
  { texto: '🐟 Los peces pueden vivir fuera del agua para siempre.', respuesta: 'falso' },
  { texto: '🦁 El león es un mamífero.', respuesta: 'verdadero' },
  { texto: '🌙 La Luna es un planeta.', respuesta: 'falso' },
  { texto: '💧 El agua se congela aproximadamente a 0 °C.', respuesta: 'verdadero' },
  { texto: '☀️ El Sol es un planeta.', respuesta: 'falso' }
]

const juegos = new Map()

export default {
  name: 'verdadofalso',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const respuesta = parts?.join(' ').trim().toLowerCase()

    if (!respuesta) {
      const pregunta = preguntas[Math.floor(Math.random() * preguntas.length)]

      juegos.set(chatId, pregunta)

      return sock.sendMessage(chatId, {
        text:
          '✅❌ *VERDADERO O FALSO*\n\n' +
          `${pregunta.texto}\n\n` +
          'Responde:\n' +
          '👉 /verdadofalso verdadero\n' +
          '👉 /verdadofalso falso'
      })
    }

    if (respuesta !== 'verdadero' && respuesta !== 'falso') {
      return sock.sendMessage(chatId, {
        text: '❌ Responde solamente *verdadero* o *falso*.'
      })
    }

    const pregunta = juegos.get(chatId)

    if (!pregunta) {
      return sock.sendMessage(chatId, {
        text: '❓ Primero inicia una pregunta usando:\n/verdadofalso'
      })
    }

    juegos.delete(chatId)

    const correcto = respuesta === pregunta.respuesta

    await sock.sendMessage(chatId, {
      text:
        '✅❌ *VERDADERO O FALSO*\n\n' +
        `${pregunta.texto}\n\n` +
        `👉 Tu respuesta: *${respuesta}*\n` +
        `📚 Respuesta correcta: *${pregunta.respuesta}*\n\n` +
        (correcto
          ? '🎉 *¡Correcto! Ganaste.* 🏆'
          : '❌ *Incorrecto.*')
    })
  }
}
