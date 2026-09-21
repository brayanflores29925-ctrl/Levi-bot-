import axios from 'axios'
import mfdlPkg from '@imeshsan2008/mfdl'
const { mfdl } = mfdlPkg

export default {
  name: 'mediafire',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '❌ Envía un enlace de MediaFire.\n\nEjemplo:\n/mediafire https://www.mediafire.com/file/...'
      })
    }

    if (!/^https?:\/\//i.test(url)) {
      return sock.sendMessage(chatId, {
        text: '❌ El enlace debe comenzar con http:// o https://'
      })
    }

    await sock.sendMessage(chatId, {
      text: '⏳ Procesando enlace de MediaFire...'
    })

    try {
      const resultado = await mfdl(url)

      const downloadUrl =
        resultado?.downloadUrl ||
        resultado?.url ||
        resultado?.download

      const fileName =
        resultado?.fileName ||
        resultado?.name ||
        'archivo'

      if (!downloadUrl) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener el enlace de descarga de MediaFire.'
        })
      }

      await sock.sendMessage(chatId, {
        text: `📥 *${fileName}*\n\n⏳ Descargando...`
      })

      const respuesta = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
        maxContentLength: 100 * 1024 * 1024
      })

      const buffer = Buffer.from(respuesta.data)

      await sock.sendMessage(chatId, {
        document: buffer,
        fileName,
        mimetype: 'application/octet-stream'
      })

    } catch (error) {
      console.error('Error en /mediafire:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude descargar el archivo de MediaFire.\n\n${error.message}`
      })
    }
  }
}
