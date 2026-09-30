import axios from 'axios'
import * as cheerio from 'cheerio'

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

      const respuesta = await axios.get('https://www.google.com/search', {
        params: {
          q: texto,
          hl: 'es'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36'
        },
        timeout: 30000
      })

      const $ = cheerio.load(respuesta.data)
      const resultados = []

      $('div.MjjYud').each((_, elemento) => {
        const titulo = $(elemento).find('h3').first().text().trim()
        const enlace = $(elemento).find('a').first().attr('href')
        const descripcion = $(elemento).find('.VwiC3b').first().text().trim()

        if (titulo && enlace && enlace.startsWith('http')) {
          resultados.push({
            titulo,
            enlace,
            descripcion
          })
        }
      })

      if (!resultados.length) {
        return sock.sendMessage(chatId, {
          text:
            '❌ No encontré resultados para esa búsqueda.\n\n' +
            `🔎 Consulta: ${texto}`
        })
      }

      const lista = resultados
        .slice(0, 5)
        .map((resultado, indice) => {
          return (
            `*${indice + 1}. ${resultado.titulo}*\n` +
            `${resultado.descripcion || 'Sin descripción disponible.'}\n` +
            `🔗 ${resultado.enlace}`
          )
        })
        .join('\n\n')

      await sock.sendMessage(chatId, {
        text:
          `🔎 *RESULTADOS DE BÚSQUEDA*\n\n` +
          `📌 *Consulta:* ${texto}\n\n` +
          `${lista}`
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
