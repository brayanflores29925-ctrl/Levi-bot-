export default {
  name: 'diccionario',
  aliases: ['dic', 'significado', 'definir'],
  description: '📖 Busca el significado de palabras.',
  category: 'EDUCACIÓN',

  async execute(sock, m, parts, enviar) {
    const palabra = parts.join(' ').trim()

    if (!palabra) {
      return enviar(
        '📖 *DICCIONARIO*\n\n' +
        'Escribe la palabra que quieres buscar.\n\n' +
        '📌 Ejemplos:\n' +
        '❑ /diccionario amistad\n' +
        '❑ /diccionario aprender\n' +
        '❑ /diccionario responsabilidad'
      )
    }

    try {
      await enviar(`🔎 *Buscando:* ${palabra}...`)

      const url =
        `https://api.dictionaryapi.dev/api/v2/entries/es/` +
        encodeURIComponent(palabra)

      const respuesta = await fetch(url)

      if (!respuesta.ok) {
        return enviar(
          `❌ No encontré la palabra *${palabra}* en el diccionario.`
        )
      }

      const datos = await respuesta.json()
      const entrada = datos[0]

      let mensaje =
        '📖 *DICCIONARIO*\n\n' +
        `🔤 *Palabra:* ${entrada.word}\n`

      if (entrada.phonetic) {
        mensaje += `🔊 *Pronunciación:* ${entrada.phonetic}\n`
      }

      const significados = entrada.meanings || []

      significados.slice(0, 4).forEach((significado, i) => {
        mensaje += `\n📚 *Significado ${i + 1} — ${significado.partOfSpeech || 'Palabra'}*\n`

        const definiciones = significado.definitions || []

        definiciones.slice(0, 3).forEach((def, j) => {
          mensaje += `❑ ${def.definition}\n`

          if (def.example) {
            mensaje += `💬 Ejemplo: ${def.example}\n`
          }
        })
      })

      if (mensaje.length > 3500) {
        mensaje = mensaje.slice(0, 3500) + '...'
      }

      mensaje += '\n\nℹ️ Información consultada en Dictionary API.'

      return enviar(mensaje)

    } catch (error) {
      console.error('[DICCIONARIO] Error:', error.message)

      return enviar(
        '❌ *No pude consultar el diccionario.*\n\n' +
        'Comprueba tu conexión a Internet e inténtalo nuevamente.'
      )
    }
  }
}
