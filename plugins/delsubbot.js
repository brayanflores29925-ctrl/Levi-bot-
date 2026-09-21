import { obtenerSubbots, eliminarSubbot } from './subbotmanager.js'

const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'delsubbot',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid

    if (chatId !== GRUPO_OFICIAL) return

    const numero = parts?.join('').replace(/\D/g, '')

    if (!numero) {
      return await sock.sendMessage(chatId, {
        text:
          '❌ Debes indicar el número del Sub-bot.\n\n' +
          'Ejemplo:\n' +
          '*/delsubbot 504XXXXXXXX*'
      })
    }

    const subbots = obtenerSubbots()
    const encontrado = subbots.find(subbot => subbot.numero === numero)

    if (!encontrado) {
      return await sock.sendMessage(chatId, {
        text: `❌ El número *${numero}* no está registrado como Sub-bot.`
      })
    }

    const eliminado = eliminarSubbot(numero)

    if (!eliminado) {
      return await sock.sendMessage(chatId, {
        text: '❌ No pude liberar ese Sub-bot.'
      })
    }

    await sock.sendMessage(chatId, {
      text:
        '🗑️ *SUB-BOT ELIMINADO*\n\n' +
        `📱 Número: *${numero}*\n` +
        '🔓 El espacio quedó disponible para otro Sub-bot.\n\n' +
        'Usa */subbots* para comprobar los espacios.'
    })
  }
}
