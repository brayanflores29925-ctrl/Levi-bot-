import axios from 'axios'

export default {
  name: 'chatgpt',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = parts?.join(' ').trim()

    if (!texto) {
      return sock.sendMessage(chatId, {
        text: '🤖 Escribe una pregunta.\n\nEjemplo:\n/chatgpt ¿Qué es la inteligencia artificial?'
      })
    }

    try {
      const respuesta = await axios.get(
        'https://prexzyapis.com/ai/chatgpt',
        {
          params: { q: texto },
          timeout: 30000
        }
      )

      const resultado = respuesta.data?.result

      if (!resultado) {
        return sock.sendMessage(chatId, {
          text: '❌ La API no devolvió una respuesta válida.'
        })
      }

      await sock.sendMessage(chatId, {
        text: `🤖 *ChatGPT:*\n\n${resultado}`
      })

    } catch (error) {
      console.error('Error en /chatgpt:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /chatgpt:\n${error.message}`
      })
    }
  }
}
