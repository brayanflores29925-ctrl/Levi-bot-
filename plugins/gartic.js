export const partidas = new Map()

const palabras = [
  'gato',
  'perro',
  'avion',
  'pizza',
  'casa',
  'arbol',
  'telefono',
  'sol',
  'luna',
  'coche'
]

export default {
  name: 'gartic',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (partidas.has(chatId)) {
      return sock.sendMessage(chatId, {
        text: '🎨 Ya hay una partida de *Gartic* activa en este grupo.\n\n👉 Usa /revelargartic para revelar la palabra.'
      }, { quoted: m })
    }

    const palabra = palabras[Math.floor(Math.random() * palabras.length)]

    partidas.set(chatId, {
      creador: sender,
      palabra
    })

    return sock.sendMessage(chatId, {
      text:
`╭━━〔 🎨 GARTIC 〕━━╮
┃
┃ 👤 Jugador: @${sender.split('@')[0]}
┃
┃ 🎯 ¡Nueva ronda!
┃
┃ 🤫 Hay una palabra secreta.
┃
┃ 👥 Los demás jugadores deben
┃ intentar adivinarla.
┃
┃ 💡 Escriban sus respuestas
┃ directamente en el grupo.
┃
┃ 🔓 Para revelar la respuesta:
┃ /revelargartic
┃
╰━━━━━━━━━━━━━━━━━━╯`,
      mentions: [sender]
    }, { quoted: m })
  }
}
