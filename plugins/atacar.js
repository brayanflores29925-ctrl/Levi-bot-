import { partidas } from './guerra.js'

export default {
  name: 'atacar',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const partida = partidas.get(chatId)

    if (!partida) {
      return sock.sendMessage(chatId, {
        text: '⚠️ No hay ninguna partida de ⚔️ *Guerra* activa.'
      }, { quoted: m })
    }

    if (!partida.jugador2) {
      return sock.sendMessage(chatId, {
        text: '⏳ Falta el segundo jugador para comenzar la batalla.'
      }, { quoted: m })
    }

    if (sender !== partida.jugador1 && sender !== partida.jugador2) {
      return
    }

    const esJugador1 = sender === partida.jugador1
    const objetivo = esJugador1 ? partida.jugador2 : partida.jugador1

    const dano = Math.floor(Math.random() * 21) + 10

    if (esJugador1) {
      partida.vida2 = Math.max(0, partida.vida2 - dano)
    } else {
      partida.vida1 = Math.max(0, partida.vida1 - dano)
    }

    const vidaAtacante = esJugador1 ? partida.vida1 : partida.vida2
    const vidaObjetivo = esJugador1 ? partida.vida2 : partida.vida1

    if (vidaObjetivo <= 0) {
      partidas.delete(chatId)

      return sock.sendMessage(chatId, {
        text:
`🏆 *¡FIN DE LA GUERRA!*

⚔️ @${sender.split('@')[0]} ganó la batalla.

💥 Daño realizado: ${dano}

❤️ Vida del ganador: ${vidaAtacante}
💀 Vida del rival: 0

🎮 Escribe */guerra* para comenzar otra batalla.`,
        mentions: [sender, objetivo]
      }, { quoted: m })
    }

    return sock.sendMessage(chatId, {
      text:
`⚔️ *ATAQUE REALIZADO*

👤 @${sender.split('@')[0]}
💥 Daño: ${dano}

❤️ Tu vida: ${vidaAtacante}
❤️ Vida de @${objetivo.split('@')[0]}: ${vidaObjetivo}

👉 @${objetivo.split('@')[0]}, ¡te toca atacar!

Escribe */atacar*`,
      mentions: [sender, objetivo]
    }, { quoted: m })
  }
}
