import axios from 'axios'

export default {
  name: 'emojimix',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const emojis = parts.join(' ').trim().split(/\s+/)

    if (emojis.length < 2) {
      return enviar(
        '❌ Debes escribir 2 emojis.\n\n' +
        'Ejemplo:\n' +
        '/emojimix 😎 😂'
      )
    }

    try {
      const emoji1 = encodeURIComponent(emojis[0])
      const emoji2 = encodeURIComponent(emojis[1])

      const url = `https://emojik.vercel.app/api/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`

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
      console.error('Error en /emojimix:', error)
      await enviar('❌ No se pudo crear el EmojiMix.')
    }
  }
}
