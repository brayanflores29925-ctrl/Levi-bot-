import axios from 'axios'

const ALLDL_API = 'https://ahm7xmakki.com/api/alldl'

export default {
  name: 'Instagram',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '❌ Envía el enlace público de Instagram.\n\nEjemplo: /Instagram https://www.instagram.com/...'
      })
    }

    await sock.sendMessage(chatId, {
      text: '⏳ Procesando Instagram...'
    })

    try {
      const respuesta = await axios.get(ALLDL_API, {
        params: { url },
        timeout: 30000
      })

      const datos = respuesta.data?.mediaInfo

      if (!respuesta.data?.success || !datos) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener el contenido de Instagram.'
        })
      }

      if (datos.videoUrl) {
        await sock.sendMessage(chatId, {
          video: { url: datos.videoUrl },
          mimetype: 'video/mp4',
          caption: `📸 ${datos.title || 'Instagram'}`
        })
      } else if (datos.audioUrl) {
        await sock.sendMessage(chatId, {
          audio: { url: datos.audioUrl },
          mimetype: 'audio/mpeg',
          fileName: 'instagram.mp3'
        })
      } else {
        return sock.sendMessage(chatId, {
          text: '❌ No encontré un archivo descargable.'
        })
      }

    } catch (error) {
      console.error('Error en /Instagram:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /Instagram: ${error.message}`
      })
    }
  }
}
