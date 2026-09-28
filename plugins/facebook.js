import axios from 'axios'

const ALLDL_API = 'https://ahm7xmakki.com/api/alldl'

export default {
  name: 'facebook',
  aliases: ['fb', 'fbdl'],

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '📘 *DESCARGADOR DE FACEBOOK*\n\n' +
              'Por favor, proporciona un enlace válido de Facebook.\n\n' +
              '📌 *Uso:* `/facebook <link>`\n' +
              '💡 *Ejemplo:* `/facebook https://www.facebook.com/watch?v=123456789`'
      })
    }

    if (!/facebook\.com|fb\.watch/i.test(url)) {
      return sock.sendMessage(chatId, {
        text: '❌ *ENLACE INVÁLIDO*\n\nEl enlace proporcionado no pertenece a Facebook.'
      })
    }

    if (m.key) {
      await sock.sendMessage(chatId, {
        react: { text: '⏳', key: m.key }
      })
    }

    try {
      const respuesta = await axios.get(ALLDL_API, {
        params: { url },
        timeout: 30000
      })

      const datos = respuesta.data?.mediaInfo

      if (!respuesta.data?.success || !datos) {
        if (m.key) await sock.sendMessage(chatId, {
          react: { text: '❌', key: m.key }
        })

        return sock.sendMessage(chatId, {
          text: '❌ *ERROR EN DESCARGA*\n\nNo se pudo obtener el contenido. Asegúrate de que la publicación sea pública.'
        })
      }

      const videoUrl = datos.videoUrl || datos.hd || datos.sd
      const audioUrl = datos.audioUrl
      const imageUrl = datos.imageUrl || datos.photo
      const titulo = datos.title?.trim() || 'Video de Facebook'

      if (videoUrl) {
        await sock.sendMessage(chatId, {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: `📘 *FACEBOOK DOWNLOADER*\n\n` +
                   `📄 *Título:* ${titulo}\n\n` +
                   `✨ *Descargado con LeviBot*`
        })
      } else if (imageUrl) {
        await sock.sendMessage(chatId, {
          image: { url: imageUrl },
          caption: `📘 *FACEBOOK DOWNLOADER*\n\n` +
                   `📄 *Título:* ${titulo}\n\n` +
                   `✨ *Descargado con LeviBot*`
        })
      } else if (audioUrl) {
        await sock.sendMessage(chatId, {
          audio: { url: audioUrl },
          mimetype: 'audio/mpeg',
          fileName: `${titulo.slice(0, 20)}.mp3`
        })
      } else {
        if (m.key) await sock.sendMessage(chatId, {
          react: { text: '❌', key: m.key }
        })

        return sock.sendMessage(chatId, {
          text: '❌ *SIN CONTENIDO*\n\nNo se encontró ningún archivo multimedia descargable en este enlace.'
        })
      }

      if (m.key) {
        await sock.sendMessage(chatId, {
          react: { text: '✅', key: m.key }
        })
      }

    } catch (error) {
      console.error('Error en /facebook:', error)

      if (m.key) {
        await sock.sendMessage(chatId, {
          react: { text: '❌', key: m.key }
        })
      }

      await sock.sendMessage(chatId, {
        text: '❌ *OCURRIÓ UN ERROR*\n\n' +
              `No se pudo procesar la solicitud.\n` +
              `📌 *Detalle:* \`${error.message}\``
      })
    }
  }
}
