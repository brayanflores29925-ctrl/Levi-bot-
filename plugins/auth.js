import { validarCodigo } from '../authcodes.js'
import { addAuthorized } from '../authdb.js'

export default {
  name: 'auth',
  async execute(sock, m, args) {
    const chatId = m.key?.remoteJid
    const codigo = args?.[0]?.trim()

    if (!codigo) {
      return await sock.sendMessage(
        chatId,
        { text: 'Uso: /auth <código>' },
        { quoted: m }
      )
    }

    const botId = sock.user?.id

    if (!botId) {
      return await sock.sendMessage(
        chatId,
        { text: '❌ No se pudo identificar este Sub-Bot.' },
        { quoted: m }
      )
    }

    const numeroBot = botId
      .split('@')[0]
      .split(':')[0]

    const valido = validarCodigo(numeroBot, codigo)

    if (!valido) {
      return await sock.sendMessage(
        chatId,
        { text: '❌ Código incorrecto o vencido.' },
        { quoted: m }
      )
    }

    addAuthorized(numeroBot)

    await sock.sendMessage(
      chatId,
      {
        text:
          '✅ *SUB-BOT AUTORIZADO*\\n\\n' +
          '🔓 Este Sub-Bot ya está autorizado para usar LeviBot.'
      },
      { quoted: m }
    )
  }
}
