import axios from 'axios'

export default {
  name: 'buscar',
  aliases: ['search'],

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = parts?.join(' ').trim()

    if (!texto) {
      return sock.sendMessage(chatId, {
        text:
          '🔎 *BUSCADOR LEVI BOTS*\n\n' +
          'Escribe lo que quieres buscar.\n\n' +
          '📌 Ejemplos:\n' +
          '• /buscar Shakira\n' +
          '• /buscar noticias de Honduras\n' +
          '• /buscar Minecraft\n' +
          '• /buscar cómo funciona la fotosíntesis\n' +
          '• /buscar música de Navidad'
      })
    }

    try {
      await sock.sendMessage(chatId, {
        text: `🔎 Buscando: *${texto}*...`
      })

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
          text:
            '❌ No encontré resultados para esa búsqueda.\n\n' +
            `🔎 Consulta: ${texto}`
        })
      }

      await sock.sendMessage(chatId, {
        text:
          `🔎 *RESULTADOS DE BÚSQUEDA*\n\n` +
          `📌 *Consulta:* ${texto}\n\n` +
          `${resultado}`
      })

    } catch (error) {
      console.error('Error en /buscar:', error)

      await sock.sendMessage(chatId, {
        text:
          '❌ No se pudo realizar la búsqueda.\n\n' +
          `Error: ${error.message}`
      })
    }
  }
}
