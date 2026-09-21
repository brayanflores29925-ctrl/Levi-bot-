const partidas = new Map()

export default {
  name: 'resettresenlinea',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    return sock.sendMessage(chatId, {
      text: `🔄 La partida de 🎮 *Tres en línea* ha sido reiniciada.\n\n👉 Escribe /tresenlinea para comenzar una nueva partida.`
    }, { quoted: m })
  }
}
