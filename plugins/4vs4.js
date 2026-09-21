export const partidas = new Map()

export default {
  name: '4vs4',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    let partida = partidas.get(chatId)

    if (!partida) {
      partida = {
        jugadores: [sender],
        max: 8
      }

      partidas.set(chatId, partida)

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 ⚔️ 4 VS 4 〕━━╮
┃
┃ 👤 @${sender.split('@')[0]}
┃ se unió al Equipo A.
┃
┃ 👥 Jugadores: 1/8
┃
┃ 🎯 Se necesitan 8 jugadores.
┃
┃ 👉 Los demás deben escribir:
┃ /4vs4
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
        text: '⚠️ La partida ya está completa con 8 jugadores.'
      }, { quoted: m })
    }

    partida.jugadores.push(sender)

    const total = partida.jugadores.length

    if (total < 8) {
      return sock.sendMessage(chatId, {
        text:
`⚔️ *4 VS 4*

👤 @${sender.split('@')[0]} se unió.

👥 Jugadores: ${total}/8

⏳ Faltan ${8 - total} jugador(es).

👉 Escriban */4vs4* para unirse.`,
        mentions: [sender]
      }, { quoted: m })
    }

    const equipoA = partida.jugadores.slice(0, 4)
    const equipoB = partida.jugadores.slice(4, 8)

    const listaA = equipoA.map((j, i) =>
      `${i + 1}. @${j.split('@')[0]}`
    ).join('\n')

    const listaB = equipoB.map((j, i) =>
      `${i + 1}. @${j.split('@')[0]}`
    ).join('\n')

    partidas.delete(chatId)

    return sock.sendMessage(chatId, {
      text:
`╭━━〔 ⚔️ 4 VS 4 〕━━╮
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
╰━━━━━━━━━━━━━━━━━━╯`,
      mentions: partida.jugadores
    }, { quoted: m })
  }
}
