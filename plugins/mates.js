export default {
  name: 'mates',
  aliases: ['matematicas', 'matemáticas', 'math'],
  description: '🧮 Resuelve ejercicios y operaciones matemáticas.',
  category: 'EDUCACIÓN',

  async execute(sock, m, parts, enviar) {
    const ejercicio = parts.join(' ').trim()

    if (!ejercicio) {
      return enviar(
        '🧮 *MATEMÁTICAS*\n\n' +
        'Escribe el ejercicio que quieres resolver.\n\n' +
        '📌 Ejemplos:\n' +
        '❑ /mates 25 × 18\n' +
        '❑ /mates (45 + 15) / 3\n' +
        '❑ /mates 2^10\n' +
        '❑ /mates sqrt(144)\n' +
        '❑ /mates 15% de 800'
      )
    }

    try {
      await enviar('🧮 *Resolviendo ejercicio...*')

      const consulta = encodeURIComponent(ejercicio)
      const url = `https://api.mathjs.org/v4/?expr=${consulta}`

      const respuesta = await fetch(url)

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`)
      }

      const resultado = (await respuesta.text()).trim()

      if (!resultado) {
        throw new Error('Respuesta vacía')
      }

      return enviar(
        '🧮 *MATEMÁTICAS*\n\n' +
        `📌 Ejercicio:\n${ejercicio}\n\n` +
        `✅ *Resultado:*\n${resultado}`
      )

    } catch (error) {
      console.error('[MATES] Error:', error.message)

      return enviar(
        '❌ *No pude resolver ese ejercicio.*\n\n' +
        'Revisa que esté escrito correctamente e inténtalo nuevamente.'
      )
    }
  }
}
