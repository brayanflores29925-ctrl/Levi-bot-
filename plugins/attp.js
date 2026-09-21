import axios from 'axios'

export default {
  name: 'attp',

  async execute(sock, m, parts, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = parts.join(' ').trim()

    if (!texto) {
      return enviar(
        '✍️ *ATTP*\n\n' +
        'Escribe el texto que quieres convertir en sticker.\n\n' +
        'Ejemplo:\n' +
        '/attp Hola LeviBot'
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
      await enviar('❌ No se pudo crear el sticker ATTP.')
    }
  }
}
