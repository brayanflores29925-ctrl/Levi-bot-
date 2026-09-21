import ytSearch from 'yt-search'
import axios from 'axios'

const ALLDL_API = 'https://ahm7xmakki.com/api/alldl'

export default {
  name: 'playdoc',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const busqueda = parts?.join(' ').trim()

    if (!busqueda) {
      return sock.sendMessage(chatId, {
        text: '❌ Escribe el nombre de una canción.\n\nEjemplo: /playdoc Feliz Navidad'
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
          text: '❌ No pude obtener el audio.'
        })
      }

      await sock.sendMessage(chatId, {
        text: `⏳ Preparando documento...\n\n📄 *${datos.title || video.title}*`
      })

      await sock.sendMessage(chatId, {
        document: { url: datos.audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${(datos.title || video.title).replace(/[\\/:*?"<>|]/g, '')}.mp3`
      })

    } catch (error) {
      console.error('Error en /playdoc:', error)
      await sock.sendMessage(chatId, {
        text: `❌ Error en /playdoc: ${error.message}`
      })
    }
  }
}
