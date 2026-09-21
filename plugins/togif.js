import { downloadContentFromMessage } from '@whiskeysockets/baileys'

export default {
  name: 'togif',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const video = m.message?.videoMessage || quoted?.videoMessage

    if (!video) {
      return enviar(
        '🎬 *TOGIF*\n\n' +
        'Responde a un video con:\n' +
        '/togif'
      )
    }

    try {
      const stream = await downloadContentFromMessage(video, 'video')
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)

      await sock.sendMessage(
        chatId,
        {
          video: buffer,
          gifPlayback: true,
          caption: '🎬 GIF creado por LeviBot'
        },
        { quoted: m }
      )
    } catch (error) {
      console.error('Error en /togif:', error)
      await enviar('❌ No se pudo convertir el video a GIF.')
    }
  }
}
