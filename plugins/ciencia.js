export default {
  name: 'ciencia',
  aliases: ['ciencias', 'science'],
  description: '🔬 Busca y explica temas científicos.',
  category: 'EDUCACIÓN',

  async execute(sock, m, parts, enviar) {
    const tema = parts.join(' ').trim()

    if (!tema) {
      return enviar(
        '🔬 *CIENCIA*\n\n' +
        'Escribe el tema científico que quieres investigar.\n\n' +
        '📌 Ejemplos:\n' +
        '❑ /ciencia sistema solar\n' +
        '❑ /ciencia fotosíntesis\n' +
        '❑ /ciencia gravedad\n' +
        '❑ /ciencia células\n' +
        '❑ /ciencia agujeros negros'
      )
    }

    try {
      await enviar(`🔎 *Buscando información sobre:* ${tema}...`)

      const url =
        `https://es.wikipedia.org/api/rest_v1/page/summary/` +
        encodeURIComponent(tema.replace(/ /g, '_'))

      const respuesta = await fetch(url)

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`)
      }

      const datos = await respuesta.json()

      if (!datos.extract) {
        return enviar(
          `❌ No encontré información sobre *${tema}*.\n\n` +
          'Prueba escribiendo el nombre del tema de otra forma.'
        )
      }

      let texto = datos.extract

      if (texto.length > 3000) {
        texto = texto.slice(0, 3000) + '...'
      }

      return enviar(
        '🔬 *CIENCIA*\n\n' +
        `📚 *Tema:* ${datos.title || tema}\n\n` +
        `${texto}\n\n` +
        'ℹ️ Información consultada en Wikipedia.'
      )

    } catch (error) {
      console.error('[CIENCIA] Error:', error.message)

      return enviar(
        '❌ *No pude consultar la información científica.*\n\n' +
        'Comprueba tu conexión a Internet e inténtalo nuevamente.'
      )
    }
  }
}
