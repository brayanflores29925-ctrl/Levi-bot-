import axios from 'axios'

export default {
  name: 'google',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = parts?.join(' ').trim()

    if (!texto) {
      return sock.sendMessage(chatId, {
        text: '🔎 Escribe lo que quieres buscar.\n\nEjemplo:\n/google Shakira'
      })
    }

    try {
      const respuesta = await axios.get(
        'https://prexzyapis.com/ai/chatbot',
        {
          params: {
            text: texto,
            search: 'true'
          },
          timeout: 30000
        }
      )

      const datos = respuesta.data

      const resultado =
        typeof datos === 'string'
          ? datos
          : datos?.result ||
            datos?.response ||
            datos?.answer ||
            datos?.message ||
            datos?.text

      if (!resultado) {
        return sock.sendMessage(chatId, {
          text: '❌ No encontré resultados.'
        })
      }

      await sock.sendMessage(chatId, {
        text: `🔎 *Resultado de búsqueda:*\n\n${resultado}`
      })

    } catch (error) {
      console.error('Error en /google:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /google:\n${error.message}`
      })
    }
  }
}
