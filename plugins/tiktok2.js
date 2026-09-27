import axios from 'axios'

const SOCIALCRAWL_API = 'https://www.socialcrawl.dev/v1/tiktok/search'
const ALLDL_API = 'https://ahm7xmakki.com/api/alldl'

export default {
  name: 'tiktok2',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const busqueda = parts?.join(' ').trim()

    if (!busqueda) {
      return sock.sendMessage(chatId, {
        text: '❌ Escribe lo que quieres buscar.\n\nEjemplo: /tiktok2 musica de Bad Bunny'
      })
    }

    if (!process.env.SOCIALCRAWL_API_KEY) {
      return sock.sendMessage(chatId, {
        text: '❌ Falta configurar SOCIALCRAWL_API_KEY en el archivo .env.'
      })
    }

    await sock.sendMessage(chatId, {
      text: `🔎 Buscando en TikTok: *${busqueda}*...`
    })

    try {
      const respuesta = await axios.get(SOCIALCRAWL_API, {
        params: {
          query: busqueda,
          count: 1
        },
        headers: {
          'x-api-key': process.env.SOCIALCRAWL_API_KEY
        },
        timeout: 30000
      })

      const item = respuesta.data?.data?.items?.[0]
      const tiktokUrl = item?.post?.url

      if (!respuesta.data?.success || !tiktokUrl) {
        return sock.sendMessage(chatId, {
          text: '❌ No encontré ningún video de TikTok para esa búsqueda.'
        })
      }

      await sock.sendMessage(chatId, {
        text: '⏳ Encontré un video. Descargándolo...'
      })

      const descarga = await axios.get(ALLDL_API, {
        params: {
          url: tiktokUrl
        },
        timeout: 30000
      })

      const datos = descarga.data?.mediaInfo

      if (!descarga.data?.success || !datos?.videoUrl) {
        return sock.sendMessage(chatId, {
          text: '❌ Encontré el TikTok, pero no pude descargar el video.'
        })
      }

      const titulo =
        datos.title ||
        item?.post?.content?.text ||
        'TikTok'

      await sock.sendMessage(chatId, {
        video: { url: datos.videoUrl },
        mimetype: 'video/mp4',
        caption: `📱 ${titulo}`
      })

    } catch (error) {
      console.error('Error en /tiktok2:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /tiktok2: ${error.message}`
      })
    }
  }
}
