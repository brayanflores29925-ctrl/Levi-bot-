import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export default {
  name: 'placaloli',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const texto = parts.join(' ').trim()

    const imagen =
      m.message?.imageMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    if (!imagen) {
      return enviar(
        '🖼️ *PLACALOLI*\n\n' +
        'Responde a una imagen con:\n' +
        '/placaloli'
      )
    }

    try {
      const stream = await downloadContentFromMessage(imagen, 'image')
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)

      await sock.sendMessage(
        chatId,
        {
          sticker: buffer
        },
        { quoted: m }
      )
    } catch (error) {
      console.error('Error en /placaloli:', error)
      await enviar('❌ No se pudo crear el sticker.')
    }
  }
}
