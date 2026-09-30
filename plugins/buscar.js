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

      const respuesta = await axios.get('https://www.bing.com/search', {
        params: {
          q: texto,
          setlang: 'es'
        },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'
        },
        timeout: 15000
      })

      const $ = cheerio.load(respuesta.data)
      const resultados = []
      const vistos = new Set()

      $('a').each((_, elemento) => {
        const enlace = $(elemento).attr('href')
        const titulo = $(elemento).text().trim().replace(/\s+/g, ' ')

        if (
          !titulo ||
          !enlace ||
          !enlace.startsWith('http') ||
          enlace.includes('bing.com')
        ) {
          return
        }

        if (vistos.has(enlace)) return
        vistos.add(enlace)

        resultados.push({
          titulo: titulo.slice(0, 150),
          enlace
        })
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
