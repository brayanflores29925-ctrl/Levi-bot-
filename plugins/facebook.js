import axios from 'axios'

const API_KEY = 'api-jSdKK'
const STELLAR_API = 'https://api.stellarwa.xyz/dl/facebook'

export default {
  name: 'facebook',
  aliases: ['fb', 'fbdl', 'facebookdl'],

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const inputUrl = parts?.join(' ').trim()

    if (!inputUrl) {
      return sock.sendMessage(chatId, {
        text: '*DESCARGADOR DE FACEBOOK*\n\n' +
              'Proporciona un enlace de Facebook.\n\n' +
              '*Uso:* /facebook <url>\n' +
              '*Ejemplo:* /facebook https://fb.watch/example'
      }, { quoted: m })
    }

    // Validación estricta de URL de Facebook
    const fbRegex = /(https?:\/\/)?(www\.|web\.|m\.)?(facebook\.com|fb\.watch)\/.+/i
    if (!fbRegex.test(inputUrl)) {
      return sock.sendMessage(chatId, {
        text: 'Error: El enlace proporcionado no es una URL válida de Facebook.'
      }, { quoted: m })
    }

    await sock.sendMessage(chatId, {
      text: 'Procesando el enlace de Facebook...'
    }, { quoted: m })

    try {
      const respuesta = await axios.get(STELLAR_API, {
        params: {
          key: API_KEY,
          url: inputUrl
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        timeout: 45000
      })

      const res = respuesta.data

      // Verificación de estado de respuesta de la API
      if (!res || res.status === false) {
        const errorMsg = res?.message || res?.error || 'La API no devolvió contenido para este enlace.'
        return sock.sendMessage(chatId, {
          text: `Error de la API: ${errorMsg}`
        }, { quoted: m })
      }

      // Estructuración de datos con redundancia
      const result = res.result || res.data || res
      const hdUrl = result.hd || result.high || result.video_hd
      const sdUrl = result.sd || result.low || result.video_sd || result.url || result.link || (typeof result === 'string' ? result : null)

      const videoUrl = hdUrl || sdUrl
      const calidad = hdUrl ? 'HD' : 'SD'
      const titulo = result.title || result.caption || result.description || 'Video de Facebook'

      if (!videoUrl || typeof videoUrl !== 'string') {
        return sock.sendMessage(chatId, {
          text: 'Error: No se encontró un enlace de video descargable en la publicación.'
        }, { quoted: m })
      }

      await sock.sendMessage(chatId, {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        caption: `*FACEBOOK DOWNLOADER*\n\n` +
                 `*Título:* ${titulo}\n` +
                 `*Calidad:* ${calidad}\n` +
                 `*Origen:* Facebook`
      }, { quoted: m })

    } catch (error) {
      console.error('[FACEBOOK PLUGIN ERROR]:', error?.response?.data || error.message)

      let mensajeError = 'No se pudo procesar la solicitud.'

      if (error.code === 'ECONNABORTED') {
        mensajeError = 'El servidor de la API tardó demasiado en responder (Timeout).'
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        mensajeError = 'La API Key no es válida o ha superado su límite de uso.'
      } else if (error.response?.data?.message) {
        mensajeError = error.response.data.message
      } else if (error.message) {
        mensajeError = error.message
      }

      await sock.sendMessage(chatId, {
        text: `Error: ${mensajeError}`
      }, { quoted: m })
    }
  }
}
