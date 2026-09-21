export default {
  name: 'historia',
  aliases: ['history', 'historias'],
  description: '📚 Busca y explica temas históricos.',
  category: 'EDUCACIÓN',

  async execute(sock, m, parts, enviar) {
    const tema = parts.join(' ').trim()

    if (!tema) {
      return enviar(
        '📚 *HISTORIA*\n\n' +
        'Escribe el tema histórico que quieres investigar.\n\n' +
        '📌 Ejemplos:\n' +
        '❑ /historia Segunda Guerra Mundial\n' +
        '❑ /historia Cristóbal Colón\n' +
        '❑ /historia Imperio Romano\n' +
        '❑ /historia independencia de Honduras\n' +
        '❑ /historia Revolución Francesa'
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
          'Prueba escribiendo el nombre de otra manera.'
        )
      }

      let texto = datos.extract

      if (texto.length > 3500) {
        texto = texto.slice(0, 3500) + '...'
      }

      return enviar(
        '📚 *HISTORIA*\n\n' +
        `🏛️ *Tema:* ${datos.title || tema}\n\n` +
        `${texto}\n\n` +
        'ℹ️ Información consultada en Wikipedia.'
      )

    } catch (error) {
      console.error('[HISTORIA] Error:', error.message)

      return enviar(
        '❌ *No pude consultar la información histórica.*\n\n' +
        'Comprueba tu conexión a Internet e inténtalo nuevamente.'
      )
    }
  }
}
