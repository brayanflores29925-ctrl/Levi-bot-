export const partidas = new Map()

export default {
  name: 'ppt',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const texto = (m.text || m.message?.conversation || '').trim().toLowerCase()

    let partida = partidas.get(chatId)

    if (!partida) {
      partida = {
        jugador1: sender,
        jugador2: null,
        jugadas: {}
      }

      partidas.set(chatId, partida)

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 ✊ PIEDRA PAPEL TIJERA 〕━━╮
┃
┃ 👤 Jugador 1: @${sender.split('@')[0]}
┃
┃ 👥 Esperando al jugador 2...
┃
┃ 👉 Otro jugador debe escribir:
┃ /ppt
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: [sender]
      }, { quoted: m })
    }

    if (!partida.jugador2 && sender !== partida.jugador1) {
      partida.jugador2 = sender

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 ✊ PIEDRA PAPEL TIJERA 〕━━╮
┃
┃ ❌ @${partida.jugador1.split('@')[0]}
┃ 🆚
┃ ⭕ @${partida.jugador2.split('@')[0]}
┃
┃ 🎮 ¡Partida iniciada!
┃
┃ Cada jugador debe elegir:
┃
┃ ✊ piedra
┃ 📄 papel
┃ ✂️ tijera
┃
┃ Escribe tu elección directamente.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: [partida.jugador1, partida.jugador2]
      }, { quoted: m })
    }

    if (partida.jugador2) {
      if (sender !== partida.jugador1 && sender !== partida.jugador2) return

      const opciones = {
        piedra: '✊',
        papel: '📄',
        tijera: '✂️'
      }

      if (!opciones[texto]) return

      partida.jugadas[sender] = texto

      if (!partida.jugadas[partida.jugador1] ||
          !partida.jugadas[partida.jugador2]) {
        return sock.sendMessage(chatId, {
          text: `✅ @${sender.split('@')[0]} ya hizo su elección.\n\n⏳ Esperando al otro jugador...`,
          mentions: [sender]
        }, { quoted: m })
      }

      const j1 = partida.jugadas[partida.jugador1]
      const j2 = partida.jugadas[partida.jugador2]

      let resultado

      if (j1 === j2) {
        resultado = '🤝 ¡EMPATE!'
      } else if (
        (j1 === 'piedra' && j2 === 'tijera') ||
        (j1 === 'papel' && j2 === 'piedra') ||
        (j1 === 'tijera' && j2 === 'papel')
      ) {
        resultado = `🏆 ¡GANÓ @${partida.jugador1.split('@')[0]}!`
      } else {
        resultado = `🏆 ¡GANÓ @${partida.jugador2.split('@')[0]}!`
      }

      const mensaje =
`╭━━〔 🏆 RESULTADO 〕━━╮
┃
┃ 👤 @${partida.jugador1.split('@')[0]}: ${opciones[j1]}
┃ 👤 @${partida.jugador2.split('@')[0]}: ${opciones[j2]}
┃
┃ ${resultado}
┃
┃ 🎮 Escribe /ppt para jugar otra vez.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`

      partidas.delete(chatId)

      return sock.sendMessage(chatId, {
        text: mensaje,
        mentions: [partida.jugador1, partida.jugador2]
      }, { quoted: m })
    }
  }
}
