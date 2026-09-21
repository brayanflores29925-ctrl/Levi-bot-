import axios from 'axios'

export default {
  name: 'Hd',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    const mensaje = m.message?.imageMessage

    if (!mensaje) {
      return sock.sendMessage(chatId, {
        text: '🖼️ Responde a una imagen con /Hd para mejorar su calidad.'
      })
    }

    await sock.sendMessage(chatId, {
      text: '⏳ Mejorando la imagen...'
    })

    try {
      const { downloadContentFromMessage } = await import('@whiskeysockets/baileys')

      const stream = await downloadContentFromMessage(mensaje, 'image')
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)

      const respuesta = await axios.post(
        'https://imageupscaler.com/api/',
        buffer,
        {
          headers: {
            'Content-Type': 'image/jpeg'
          },
          responseType: 'arraybuffer',
          timeout: 60000
        }
      )

      await sock.sendMessage(chatId, {
        image: Buffer.from(respuesta.data),
        caption: '✨ Imagen mejorada con /Hd'
      })

    } catch (error) {
      console.error('Error en /Hd:', error)

      await sock.sendMessage(chatId, {
        text: '❌ No pude mejorar la imagen. La API requiere configuración adicional.'
      })
    }
  }
}
