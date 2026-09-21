const preguntas = [
  {
    pregunta: '🌎 ¿Cuál es el planeta más grande del sistema solar?',
    opciones: ['Marte', 'Júpiter', 'Venus'],
    correcta: 2
  },
  {
    pregunta: '🦁 ¿Cuál de estos es un mamífero?',
    opciones: ['Tiburón', 'Delfín', 'Pulpo'],
    correcta: 2
  },
  {
    pregunta: '🌙 ¿Qué es la Luna?',
    opciones: ['Un satélite natural', 'Un planeta', 'Una estrella'],
    correcta: 1
  },
  {
    pregunta: '💧 ¿Cuál es la fórmula del agua?',
    opciones: ['CO2', 'H2O', 'O2'],
    correcta: 2
  },
  {
    pregunta: '☀️ ¿Qué es el Sol?',
    opciones: ['Un planeta', 'Una estrella', 'Un satélite'],
    correcta: 2
  }
]

const juegos = new Map()

export default {
  name: 'quiz',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const respuesta = parts?.[0]

    if (!respuesta) {
      const pregunta =
        preguntas[Math.floor(Math.random() * preguntas.length)]

      juegos.set(chatId, pregunta)

      return sock.sendMessage(chatId, {
        text:
          '🧠 *QUIZ LEVIBOT*\n\n' +
          `${pregunta.pregunta}\n\n` +
          `1️⃣ ${pregunta.opciones[0]}\n` +
          `2️⃣ ${pregunta.opciones[1]}\n` +
          `3️⃣ ${pregunta.opciones[2]}\n\n` +
          '👉 Responde con:\n' +
          '*1*, *2* o *3*'
      })
    }

    if (!['1', '2', '3'].includes(respuesta)) {
      return sock.sendMessage(chatId, {
        text: '❌ Responde solamente con *1*, *2* o *3*.'
      })
    }

    const pregunta = juegos.get(chatId)

    if (!pregunta) {
      return sock.sendMessage(chatId, {
        text: '❓ Primero inicia un quiz usando:\n/quiz'
      })
    }

    juegos.delete(chatId)

    const correcto = Number(respuesta) === pregunta.correcta

    await sock.sendMessage(chatId, {
      text:
        '🧠 *RESULTADO DEL QUIZ*\n\n' +
        `${pregunta.pregunta}\n\n` +
        `👉 Tu respuesta: *${respuesta}*\n` +
        `✅ Respuesta correcta: *${pregunta.correcta}*\n\n` +
        (correcto
          ? '🎉 *¡Correcto! Ganaste.* 🏆'
          : '❌ *Incorrecto.*')
    })
  }
}
