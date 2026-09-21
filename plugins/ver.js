import { generarCodigo } from '../authcodes.js'
import { OWNER_NUMBER } from '../config.js'

export default {
  name: 'ver',

  async execute(sock, m, args) {
    const chatId = m.key?.remoteJid

    const senderRaw =
      m.key?.senderPn ||
      m.key?.participantPn ||
      m.sender ||
      m.key?.participant ||
      m.key?.remoteJid ||
      ''

    const sender = senderRaw
    console.log("[VER DEBUG] senderRaw:", senderRaw, "| sender:", sender, "| owner:", owner)
      .split('@')[0]
      .split(':')[0]

    const owner = String(OWNER_NUMBER)
      .replace(/\D/g, '')

    const senderNormalizado = sender.endsWith(owner)
      ? owner
      : sender

    if (senderNormalizado !== owner) {
      await sock.sendMessage(
        chatId,
        {
          text: 'Este comando solo puede usarlo el dueño.'
        },
        { quoted: m }
      )
      return
    }

    const mentioned =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mentioned) {
      await sock.sendMessage(
        chatId,
        {
          text: 'Uso: /ver @usuario'
        },
        { quoted: m }
      )
      return
    }

    const usuario = mentioned
      .split('@')[0]
      .split(':')[0]

    const codigo = generarCodigo(usuario)

    await sock.sendMessage(
      chatId,
      {
        text:
          'CODIGO DE AUTORIZACION\n\n' +
          'Usuario: @' + usuario + '\n' +
          'Codigo: *' + codigo + '*\n' +
          'Valido durante *15 minutos*.\n\n' +
          'Usa este codigo con:\n' +
          '`/auth codigo`',
        mentions: [mentioned]
      },
      { quoted: m }
    )
  }
}
