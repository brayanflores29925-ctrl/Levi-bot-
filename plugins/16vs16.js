export const partidas = new Map()

export default {
  name: '16vs16',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    let partida = partidas.get(chatId)

    if (!partida) {
      partida = {
        jugadores: [sender],
        max: 32
      }

      partidas.set(chatId, partida)

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 ⚔️ 16 VS 16 〕━━╮
┃
┃ 👤 @${sender.split('@')[0]}
┃ se unió al Equipo A.
┃
┃ 👥 Jugadores: 1/32
┃
┃ 🎯 Se necesitan 32 jugadores.
┃
┃ 👉 Los demás deben escribir:
┃ /16vs16
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
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
        text: '⚠️ La partida ya está completa con 32 jugadores.'
      }, { quoted: m })
    }

    partida.jugadores.push(sender)

    const total = partida.jugadores.length

    if (total < 32) {
      return sock.sendMessage(chatId, {
        text:
`⚔️ *16 VS 16*

👤 @${sender.split('@')[0]} se unió.

👥 Jugadores: ${total}/32

⏳ Faltan ${32 - total} jugador(es).

👉 Escriban */16vs16* para unirse.`,
        mentions: [sender]
      }, { quoted: m })
    }

    const equipoA = partida.jugadores.slice(0, 16)
    const equipoB = partida.jugadores.slice(16, 32)

    const listaA = equipoA.map((j, i) =>
      `${i + 1}. @${j.split('@')[0]}`
    ).join('\n')

    const listaB = equipoB.map((j, i) =>
      `${i + 1}. @${j.split('@')[0]}`
    ).join('\n')

    partidas.delete(chatId)

    return sock.sendMessage(chatId, {
      text:
`╭━━〔 ⚔️ 16 VS 16 〕━━╮
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
