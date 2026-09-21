export const partidas = new Map()

export default {
  name: 'guerra',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const texto = (m.text || m.message?.conversation || '').trim()

    let partida = partidas.get(chatId)

    if (!partida) {
      partida = {
        jugador1: sender,
        jugador2: null,
        vida1: 100,
        vida2: 100
      }

      partidas.set(chatId, partida)

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 ⚔️ GUERRA 〕━━╮
┃
┃ 👤 Jugador 1:
┃ @${sender.split('@')[0]}
┃
┃ ❤️ Vida: 100
┃
┃ 👥 Esperando al jugador 2...
┃
┃ 👉 Otro jugador debe escribir:
┃ /guerra
┃
╰━━━━━━━━━━━━━━━━━━╯`,
        mentions: [sender]
      }, { quoted: m })
    }

    if (!partida.jugador2 && sender !== partida.jugador1) {
      partida.jugador2 = sender

      return sock.sendMessage(chatId, {
        text:
`╭━━〔 ⚔️ GUERRA 〕━━╮
┃
┃ 👤 Jugador 1:
┃ @${partida.jugador1.split('@')[0]}
┃ ❤️ 100 HP
┃
┃ 🆚
┃
┃ 👤 Jugador 2:
┃ @${partida.jugador2.split('@')[0]}
┃ ❤️ 100 HP
┃
┃ 🎯 ¡BATALLA INICIADA!
┃
┃ Escriban:
┃ /atacar
┃
╰━━━━━━━━━━━━━━━━━━╯`,
        mentions: [partida.jugador1, partida.jugador2]
      }, { quoted: m })
    }

    if (partida.jugador2) {
      return sock.sendMessage(chatId, {
        text: `⚔️ La partida ya está iniciada.\n\n👉 Usa */atacar* para atacar.`
      }, { quoted: m })
    }
  }
}
