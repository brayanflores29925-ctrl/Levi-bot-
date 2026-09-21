import axios from 'axios'

const ALLDL_API = 'https://ahm7xmakki.com/api/alldl'

export default {
  name: 'tiktok',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '❌ Envía el enlace público de TikTok.\n\nEjemplo: /tiktok https://www.tiktok.com/...'
      })
    }

    await sock.sendMessage(chatId, {
      text: '⏳ Procesando TikTok...'
    })

    try {
      const respuesta = await axios.get(ALLDL_API, {
        params: { url },
        timeout: 30000
      })

      const datos = respuesta.data?.mediaInfo

      if (!respuesta.data?.success || !datos?.videoUrl) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener el video de TikTok.'
        })
      }

      await sock.sendMessage(chatId, {
        video: { url: datos.videoUrl },
        mimetype: 'video/mp4',
        caption: `📱 ${datos.title || 'TikTok'}`
      })

    } catch (error) {
      console.error('Error en /tiktok:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /tiktok: ${error.message}`
      })
    }
  }
}
