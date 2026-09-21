import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export default {
  name: 'toimg',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const mensaje = m.message

    const sticker =
      mensaje?.stickerMessage ||
      mensaje?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage

    if (!sticker) {
      return enviar(
        '🖼️ *TOIMG*\n\n' +
        'Responde a un sticker con:\n' +
        '/toimg'
      )
    }

    try {
      const stream = await downloadContentFromMessage(sticker, 'sticker')
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)

      await sock.sendMessage(
        chatId,
        {
          image: buffer,
          caption: '🖼️ Sticker convertido a imagen'
        },
        { quoted: m }
      )
    } catch (error) {
      console.error('Error en /toimg:', error)
      await enviar('❌ No se pudo convertir el sticker a imagen.')
    }
  }
}
