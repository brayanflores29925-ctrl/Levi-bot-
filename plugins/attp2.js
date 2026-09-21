import axios from 'axios'

export default {
  name: 'attp2',

  async execute(sock, m, parts, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = parts.join(' ').trim()

    if (!texto) {
      return enviar(
        '✍️ *ATTP2*\n\n' +
        'Escribe el texto para crear el sticker.\n\n' +
        'Ejemplo:\n' +
        '/attp2 Hola LeviBot'
      )
    }

    try {
      const url = `https://api.erdwpe.com/api/maker/attp?text=${encodeURIComponent(texto)}`
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000
      })

      await sock.sendMessage(
        chatId,
        { sticker: Buffer.from(response.data) },
        { quoted: m }
      )
    } catch (error) {
      console.error('Error en /attp2:', error)
      await enviar('❌ No se pudo crear el sticker ATTP2.')
    }
  }
}
