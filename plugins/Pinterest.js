import axios from 'axios'

export default {
  name: 'Pinterest',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '❌ Envía el enlace público de Pinterest.\n\nEjemplo:\n/Pinterest https://pin.it/...'
      })
    }

    if (!/^https?:\/\//i.test(url)) {
      return sock.sendMessage(chatId, {
        text: '❌ El enlace debe comenzar con http:// o https://'
      })
    }

    await sock.sendMessage(chatId, {
      text: '📌 ⏳ Procesando Pinterest...'
    })

    try {
      const respuesta = await axios.get(
        'https://www.expertsphp.com/download.php',
        {
          params: { url },
          timeout: 30000,
          responseType: 'arraybuffer'
        }
      )

      const contentType = respuesta.headers['content-type'] || ''

      if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener una imagen o video descargable de ese Pin.'
        })
      }

      if (contentType.startsWith('video/')) {
        await sock.sendMessage(chatId, {
          video: Buffer.from(respuesta.data),
          mimetype: contentType,
          caption: '📌 Pinterest'
        })
      } else {
        await sock.sendMessage(chatId, {
          image: Buffer.from(respuesta.data),
          mimetype: contentType,
          caption: '📌 Pinterest'
        })
      }

    } catch (error) {
      console.error('Error en /Pinterest:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude descargar el contenido de Pinterest.\n\n${error.message}`
      })
    }
  }
}
