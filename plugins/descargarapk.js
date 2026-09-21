import axios from 'axios'

export default {
  name: 'descargarapk',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '❌ Envía un enlace directo al archivo APK.\n\nEjemplo:\n/descargarapk https://ejemplo.com/app.apk'
      })
    }

    if (!/^https?:\/\//i.test(url)) {
      return sock.sendMessage(chatId, {
        text: '❌ El enlace debe comenzar con http:// o https://'
      })
    }

    await sock.sendMessage(chatId, {
      text: '⏳ Descargando APK...'
    })

    try {
      const respuesta = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        maxContentLength: 100 * 1024 * 1024
      })

      const buffer = Buffer.from(respuesta.data)

      await sock.sendMessage(chatId, {
        document: buffer,
        mimetype: 'application/vnd.android.package-archive',
        fileName: 'aplicacion.apk'
      })

    } catch (error) {
      console.error('Error en /descargarapk:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude descargar el APK.\n\n${error.message}`
      })
    }
  }
}
