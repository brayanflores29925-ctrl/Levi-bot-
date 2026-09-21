import ytSearch from 'yt-search'
import axios from 'axios'

const ALLDL_API = 'https://ahm7xmakki.com/api/alldl'

export default {
  name: 'playvideo',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const busqueda = parts?.join(' ').trim()

    if (!busqueda) {
      return sock.sendMessage(chatId, {
        text: '❌ Escribe el nombre de un video.\n\nEjemplo: /playvideo Feliz Navidad'
      })
    }

    await sock.sendMessage(chatId, {
      text: `🔎 Buscando *${busqueda}*...`
    })

    try {
      const resultado = await ytSearch(busqueda)
      const video = resultado.videos?.[0]

      if (!video) {
        return sock.sendMessage(chatId, {
          text: '❌ No encontré ese video.'
        })
      }

      const respuesta = await axios.get(ALLDL_API, {
        params: { url: video.url },
        timeout: 30000
      })

      const datos = respuesta.data?.mediaInfo

      if (!respuesta.data?.success || !datos?.videoUrl) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener el video.'
        })
      }

      await sock.sendMessage(chatId, {
        text: `⏳ Descargando video...\n\n🎬 *${datos.title || video.title}*`
      })

      await sock.sendMessage(chatId, {
        video: { url: datos.videoUrl },
        mimetype: 'video/mp4',
        caption: `🎬 ${datos.title || video.title}`
      })

    } catch (error) {
      console.error('Error en /playvideo:', error)
      await sock.sendMessage(chatId, {
        text: `❌ Error en /playvideo: ${error.message}`
      })
    }
  }
}
