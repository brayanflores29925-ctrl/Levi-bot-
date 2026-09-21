export const partidas = new Map()

export default {
  name: 'tresenlinea',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const texto = (m.text || m.message?.conversation || '').trim()

    let partida = partidas.get(chatId)

    // Crear partida
    if (!partida) {
      partida = {
        jugador1: sender,
        jugador2: null,
        turno: sender,
        tablero: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'],
        simbolos: {}
      }

      partida.simbolos[sender] = '❌'
      partidas.set(chatId, partida)

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 🎮 TRES EN LÍNEA 〕━━╮
┃
┃ 👤 Jugador 1: @${sender.split('@')[0]}
┃ ❌ Símbolo: ❌
┃
┃ 👥 Esperando al segundo jugador...
┃
┃ 👉 Otro usuario debe escribir:
┃ /tresenlinea
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: [sender]
      }, { quoted: m })
    }

    // Unirse como jugador 2
    if (!partida.jugador2 && sender !== partida.jugador1) {
      partida.jugador2 = sender
      partida.simbolos[sender] = '⭕'

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 🎮 TRES EN LÍNEA 〕━━╮
┃
┃ ❌ @${partida.jugador1.split('@')[0]}
┃ ⭕ @${partida.jugador2.split('@')[0]}
┃
┃ 🎯 ¡Partida iniciada!
┃
┃ Turno de: @${partida.turno.split('@')[0]}
┃
┃ Escribe un número del 1 al 9.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

${partida.tablero.slice(0,3).join(' │ ')}
──────────
${partida.tablero.slice(3,6).join(' │ ')}
──────────
${partida.tablero.slice(6,9).join(' │ ')}`,
        mentions: [partida.jugador1, partida.jugador2]
      }, { quoted: m })
    }

    // Movimiento
    if (partida.jugador2) {
      if (sender !== partida.jugador1 && sender !== partida.jugador2) return
      if (sender !== partida.turno) return

      const numero = texto.match(/(?:^|\s)([1-9])(?:\s|$)/)?.[1]
      if (!numero) return

      const posicion = Number(numero) - 1

      if (!['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'].includes(partida.tablero[posicion])) {
        return sock.sendMessage(chatId, {
          text: '⚠️ Esa casilla ya está ocupada. Elige otra del 1 al 9.'
        }, { quoted: m })
      }

      partida.tablero[posicion] = partida.simbolos[sender]

      const combinaciones = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ]

      const ganador = combinaciones.some(([a,b,c]) =>
        partida.tablero[a] === partida.tablero[b] &&
        partida.tablero[b] === partida.tablero[c]
      )

      const empate = partida.tablero.every(x => !x.match(/[1-9]/))

      let mensaje = ''

      if (ganador) {
        mensaje =
`🏆 ¡TENEMOS GANADOR!

🎉 @${sender.split('@')[0]} ganó la partida usando ${partida.simbolos[sender]}.

${partida.tablero.slice(0,3).join(' │ ')}
──────────
${partida.tablero.slice(3,6).join(' │ ')}
──────────
${partida.tablero.slice(6,9).join(' │ ')}

🎮 Escribe /tresenlinea para jugar otra partida.`

        partidas.delete(chatId)
      } else if (empate) {
        mensaje =
`🤝 ¡EMPATE!

Nadie ganó esta partida.

${partida.tablero.slice(0,3).join(' │ ')}
──────────
${partida.tablero.slice(3,6).join(' │ ')}
──────────
${partida.tablero.slice(6,9).join(' │ ')}

🎮 Escribe /tresenlinea para jugar otra partida.`

        partidas.delete(chatId)
      } else {
        partida.turno =
          sender === partida.jugador1
            ? partida.jugador2
            : partida.jugador1

        mensaje =
`🎮 TRES EN LÍNEA

${partida.tablero.slice(0,3).join(' │ ')}
──────────
${partida.tablero.slice(3,6).join(' │ ')}
──────────
${partida.tablero.slice(6,9).join(' │ ')}

🔔 Turno de: @${partida.turno.split('@')[0]}
👉 Escribe un número del 1 al 9.`
      }

      return sock.sendMessage(chatId, {
        text: mensaje,
        mentions: [partida.jugador1, partida.jugador2].filter(Boolean)
      }, { quoted: m })
    }
  }
}
