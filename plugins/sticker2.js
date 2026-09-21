import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export default {
  name: 'sticker2',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid

    const imagen =
      m.message?.imageMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    const video =
      m.message?.videoMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage

    if (!imagen && !video) {
      return enviar(
        '🖼️ *STICKER*\n\n' +
        'Envía o responde a una imagen o video con:\n' +
        '/sticker'
      )
    }

    try {
      const tipo = imagen ? 'image' : 'video'
      const contenido = imagen || video
      const stream = await downloadContentFromMessage(contenido, tipo)
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)

      await sock.sendMessage(
        chatId,
        { sticker: buffer },
        { quoted: m }
      )
    } catch (error) {
      console.error('Error en /sticker:', error)
      await enviar('❌ No se pudo crear el sticker.')
    }
  }
}
