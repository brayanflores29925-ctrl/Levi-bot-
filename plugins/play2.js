import ytSearch from 'yt-search'
import axios from 'axios'

const ALLDL_API = 'https://ahm7xmakki.com/api/alldl'

export default {
  name: 'play2',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const busqueda = parts?.join(' ').trim()

    if (!busqueda) {
      return sock.sendMessage(chatId, {
        text: '❌ Escribe el nombre de una canción.\n\nEjemplo: /play2 Feliz Navidad'
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
          text: '❌ No encontré esa canción.'
        })
      }

      const respuesta = await axios.get(ALLDL_API, {
        params: { url: video.url },
        timeout: 30000
      })

      const datos = respuesta.data?.mediaInfo

      if (!respuesta.data?.success || !datos?.audioUrl) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener el audio de esa canción.'
        })
      }

      await sock.sendMessage(chatId, {
        text: `⏳ Descargando audio...\n\n🎵 *${datos.title || video.title}*`
      })

      await sock.sendMessage(chatId, {
        audio: { url: datos.audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${(datos.title || video.title).replace(/[\\/:*?"<>|]/g, '')}.mp3`
      })

    } catch (error) {
      console.error('Error en /play2:', error)
      await sock.sendMessage(chatId, {
        text: `❌ Error en /play2: ${error.message}`
      })
    }
  }
}
