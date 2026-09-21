const palabras = [
  'LEVI',
  'MUSICA',
  'AMIGO',
  'JUEGO',
  'ESTRELLA',
  'FIESTA',
  'NAVIDAD',
  'PLANETA'
]

const juegos = new Map()

function ocultarPalabra(palabra, letras) {
  return palabra
    .split('')
    .map(letra => letras.includes(letra) ? letra : '⬜')
    .join(' ')
}

export default {
  name: 'ahorcado',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const letra = parts?.[0]?.toUpperCase()

    let juego = juegos.get(chatId)

    if (!juego || !letra) {
      const palabra = palabras[Math.floor(Math.random() * palabras.length)]

      juego = {
        palabra,
        letras: [],
        intentos: 6
      }

      juegos.set(chatId, juego)

      return sock.sendMessage(chatId, {
        text:
          '🔤 *AHORCADO LEVIBOT*\n\n' +
          `Palabra: ${ocultarPalabra(palabra, [])}\n\n` +
          '❤️ Intentos: *6*\n\n' +
          '👉 Escribe una letra para comenzar.\n' +
          'Ejemplo: /ahorcado A'
      })
    }

    if (letra.length !== 1 || !/[A-ZÑ]/.test(letra)) {
      return sock.sendMessage(chatId, {
        text: '❌ Escribe solamente *una letra*.\n\nEjemplo: /ahorcado A'
      })
    }

    if (juego.letras.includes(letra)) {
      return sock.sendMessage(chatId, {
        text: `⚠️ Ya habías usado la letra *${letra}*.`
      })
    }

    juego.letras.push(letra)

    if (!juego.palabra.includes(letra)) {
      juego.intentos--
    }

    const palabraOculta = ocultarPalabra(juego.palabra, juego.letras)
    const ganaste = juego.palabra
      .split('')
      .every(letraPalabra => juego.letras.includes(letraPalabra))

    if (ganaste) {
      juegos.delete(chatId)

      return sock.sendMessage(chatId, {
        text:
          '🎉 *¡GANASTE!*\n\n' +
          `🔤 La palabra era: *${juego.palabra}*\n` +
          '🏆 ¡Excelente!'
      })
    }

    if (juego.intentos <= 0) {
      juegos.delete(chatId)

      return sock.sendMessage(chatId, {
        text:
          '❌ *FIN DEL JUEGO*\n\n' +
          `🔤 La palabra era: *${juego.palabra}*`
      })
    }

    await sock.sendMessage(chatId, {
      text:
        '🔤 *AHORCADO LEVIBOT*\n\n' +
        `Palabra: ${palabraOculta}\n\n` +
        `❤️ Intentos restantes: *${juego.intentos}*\n` +
        `🔡 Letras usadas: ${juego.letras.join(', ')}`
    })
  }
}
