export const partidas = new Map()

const enigmas = [
  {
    pregunta: '🧩 Tengo agujas y no sé coser. ¿Qué soy?',
    respuesta: 'reloj'
  },
  {
    pregunta: '🧩 Tiene dientes y no puede comer. ¿Qué es?',
    respuesta: 'peine'
  },
  {
    pregunta: '🧩 Cuanto más quitas, más grande se vuelve. ¿Qué es?',
    respuesta: 'agujero'
  },
  {
    pregunta: '🧩 Vuelo sin alas y lloro sin ojos. ¿Qué soy?',
    respuesta: 'nube'
  }
]

export default {
  name: 'enigma',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (partidas.has(chatId)) {
      return sock.sendMessage(chatId, {
        text: '🧩 Ya hay un *enigma* activo en este grupo.\n\n👉 Usa /revelarenigma para revelar la respuesta.'
      }, { quoted: m })
    }

    const enigma = enigmas[Math.floor(Math.random() * enigmas.length)]

    partidas.set(chatId, {
      creador: sender,
      pregunta: enigma.pregunta,
      respuesta: enigma.respuesta
    })

    return sock.sendMessage(chatId, {
      text:
`╭━━〔 🧩 ENIGMA 〕━━╮
┃
┃ 👤 @${sender.split('@')[0]} inició el juego.
┃
┃ ${enigma.pregunta}
┃
┃ 💭 ¡Adivina la respuesta!
┃
┃ 🔓 Para revelar la respuesta:
┃ /revelarenigma
┃
╰━━━━━━━━━━━━━━━━━━╯`,
      mentions: [sender]
    }, { quoted: m })
  }
}
