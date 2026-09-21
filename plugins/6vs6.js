export const partidas = new Map()

export default {
  name: '6vs6',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    let partida = partidas.get(chatId)

    if (!partida) {
      partida = {
        jugadores: [sender],
        max: 12
      }

      partidas.set(chatId, partida)

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 ⚔️ 6 VS 6 〕━━╮
┃
┃ 👤 @${sender.split('@')[0]}
┃ se unió al Equipo A.
┃
┃ 👥 Jugadores: 1/12
┃
┃ 🎯 Se necesitan 12 jugadores.
┃
┃ 👉 Los demás deben escribir:
┃ /6vs6
┃
╰━━━━━━━━━━━━━━━━━━╯`,
        mentions: [sender]
      }, { quoted: m })
    }

    if (partida.jugadores.includes(sender)) {
      return sock.sendMessage(chatId, {
        text: '⚠️ Ya estás dentro de esta partida.'
      }, { quoted: m })
    }

    if (partida.jugadores.length >= partida.max) {
      return sock.sendMessage(chatId, {
        text: '⚠️ La partida ya está completa con 12 jugadores.'
      }, { quoted: m })
    }

    partida.jugadores.push(sender)

    const total = partida.jugadores.length

    if (total < 12) {
      return sock.sendMessage(chatId, {
        text:
`⚔️ *6 VS 6*

👤 @${sender.split('@')[0]} se unió.

👥 Jugadores: ${total}/12

⏳ Faltan ${12 - total} jugador(es).

👉 Escriban */6vs6* para unirse.`,
        mentions: [sender]
      }, { quoted: m })
    }

    const equipoA = partida.jugadores.slice(0, 6)
    const equipoB = partida.jugadores.slice(6, 12)

    const listaA = equipoA.map((j, i) =>
      `${i + 1}. @${j.split('@')[0]}`
    ).join('\n')

    const listaB = equipoB.map((j, i) =>
      `${i + 1}. @${j.split('@')[0]}`
    ).join('\n')

    partidas.delete(chatId)

    return sock.sendMessage(chatId, {
      text:
`╭━━〔 ⚔️ 6 VS 6 〕━━╮
┃
┃ 🎯 ¡EQUIPOS COMPLETOS!
┃
┃ 🔵 *EQUIPO A*
┃ ${listaA}
┃
┃ 🆚
┃
┃ 🔴 *EQUIPO B*
┃ ${listaB}
┃
┃ 🏆 ¡QUE COMIENCE LA BATALLA!
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
      mentions: partida.jugadores
    }, { quoted: m })
  }
}
