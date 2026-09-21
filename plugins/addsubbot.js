import { obtenerSubbots, MAX_SUBBOTS, espaciosDisponibles } from './subbotmanager.js'

const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'addsubbot',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    // En otros grupos no hace absolutamente nada.
    if (chatId !== GRUPO_OFICIAL) return

    const subbots = obtenerSubbots()
    const disponibles = espaciosDisponibles()

    if (subbots.length >= MAX_SUBBOTS) {
      return await sock.sendMessage(chatId, {
        text:
          '🚫 *LÍMITE DE SUB-BOTS ALCANZADO*\n\n' +
          `🤖 Actualmente hay *${MAX_SUBBOTS}/${MAX_SUBBOTS}* Sub-bots activos.\n\n` +
          '🔓 Cuando uno se desvincule quedará un espacio disponible.'
      })
    }

    await sock.sendMessage(chatId, {
      text:
        '🤖 *AGREGAR SUB-BOT*\n\n' +
        `📊 Sub-bots activos: *${subbots.length}/${MAX_SUBBOTS}*\n` +
        `🟢 Espacios disponibles: *${disponibles}*\n\n` +
        '📱 Para continuar con la vinculación por código, escribe:\n\n' +
        '*/addsubbot +504XXXXXXXX*\n\n' +
        '⚠️ Usa el número de la cuenta que quieres vincular, con código de país.'
    })
  }
}
