import axios from 'axios'

const ALLDL_API = 'https://ahm7xmakki.com/api/alldl'

export default {
  name: 'x',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '❌ Envía el enlace público de X/Twitter.\n\nEjemplo: /x https://x.com/...'
      })
    }

    await sock.sendMessage(chatId, {
      text: '⏳ Procesando contenido de X...'
    })

    try {
      const respuesta = await axios.get(ALLDL_API, {
        params: { url },
        timeout: 30000
      })

      const datos = respuesta.data?.mediaInfo

      if (!respuesta.data?.success || !datos) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener el contenido de ese enlace.'
        })
      }

      if (datos.videoUrl) {
        await sock.sendMessage(chatId, {
          video: { url: datos.videoUrl },
          mimetype: 'video/mp4',
          caption: `📥 ${datos.title || 'Contenido de X'}`
        })
      } else if (datos.audioUrl) {
        await sock.sendMessage(chatId, {
          audio: { url: datos.audioUrl },
          mimetype: 'audio/mpeg',
          fileName: `${(datos.title || 'audio').replace(/[\\/:*?"<>|]/g, '')}.mp3`
        })
      } else {
        await sock.sendMessage(chatId, {
          text: '❌ No encontré un archivo multimedia descargable.'
        })
      }

    } catch (error) {
      console.error('Error en /x:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /x: ${error.message}`
      })
    }
  }
}
