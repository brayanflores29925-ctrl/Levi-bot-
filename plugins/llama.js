import axios from 'axios'

export default {
  name: 'llama',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = parts?.join(' ').trim()

    if (!texto) {
      return sock.sendMessage(chatId, {
        text: '🦙 Escribe una pregunta.\n\nEjemplo:\n/llama ¿Qué es la inteligencia artificial?'
      })
    }

    try {
      const respuesta = await axios.get(
        'https://prexzyapis.com/ai/deepquery',
        {
          params: { prompt: texto },
          timeout: 30000
        }
      )

      const datos = respuesta.data

      const resultado =
        datos?.result ||
        datos?.response ||
        datos?.answer ||
        datos?.message ||
        datos?.text

      if (!resultado) {
        return sock.sendMessage(chatId, {
          text: '❌ La API no devolvió una respuesta válida.'
        })
      }

      await sock.sendMessage(chatId, {
        text: `🦙 *Llama:*\n\n${resultado}`
      })

    } catch (error) {
      console.error('Error en /llama:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /llama:\n${error.message}`
      })
    }
  }
}
