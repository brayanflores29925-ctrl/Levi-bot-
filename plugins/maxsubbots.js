import { obtenerSubbots, MAX_SUBBOTS, espaciosDisponibles } from './subbotmanager.js'

export default {
  name: 'maxsubbots',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    const subbots = obtenerSubbots()
    const disponibles = espaciosDisponibles()

    await sock.sendMessage(chatId, {
      text:
        '🤖 *LÍMITE DE SUBBOTS LEVIBOTS*\n\n' +
        `📊 Subbots registrados: *${subbots.length}/${MAX_SUBBOTS}*\n` +
        `🟢 Espacios disponibles: *${disponibles}*\n\n` +
        `⚙️ Límite máximo: *${MAX_SUBBOTS} subbots*`
    })
  }
}
