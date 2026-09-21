import { GEMINI_API_KEY } from '../config.js'

export default {
  name: 'tarea',
  aliases: ['deber', 'ayudaescolar'],
  description: '📝 Explica tareas y ejercicios paso a paso.',
  category: 'EDUCACIÓN',

  async execute(sock, m, parts, enviar) {
    const pregunta = parts.join(' ').trim()

    if (!pregunta) {
      return enviar(
        '📝 *AYUDA CON TAREAS*\n\n' +
        'Escribe la tarea o ejercicio que quieres entender.\n\n' +
        '📌 Ejemplos:\n' +
        '❑ /tarea explica la fotosíntesis\n' +
        '❑ /tarea ¿qué fue la Revolución Francesa?\n' +
        '❑ /tarea ayúdame con una ecuación de segundo grado\n' +
        '❑ /tarea explica qué es un sustantivo'
      )
    }

    if (!GEMINI_API_KEY) {
      return enviar(
        '❌ *La API de Gemini no está configurada.*\n\n' +
        'El administrador debe configurar la clave de Gemini.'
      )
    }

    try {
      await enviar('📝 *Analizando tu tarea...*')

      const url =
        'https://generativelanguage.googleapis.com/v1beta/models/' +
        'gemini-2.5-flash:generateContent?key=' +
        encodeURIComponent(GEMINI_API_KEY)

      const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    'Actúa como un tutor escolar. Ayuda al estudiante a ' +
                    'comprender su tarea de forma clara y sencilla. ' +
                    'Explica los procedimientos paso a paso cuando sea ' +
                    'necesario. No inventes datos. Si es un ejercicio, ' +
                    'muestra cómo llegar al resultado y explica por qué. ' +
                    'Responde en español.\n\n' +
                    `Tarea del estudiante:\n${pregunta}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1200
          }
        })
      })

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text()
        console.error('[TAREA] Gemini:', errorTexto)
        throw new Error(`HTTP ${respuesta.status}`)
      }

      const datos = await respuesta.json()

      const texto =
        datos?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

      if (!texto) {
        throw new Error('Gemini no devolvió contenido')
      }

      return enviar(
        '📝 *AYUDA CON TAREAS*\n\n' +
        texto
      )

    } catch (error) {
      console.error('[TAREA] Error:', error.message)

      return enviar(
        '❌ *No pude procesar la tarea.*\n\n' +
        'Comprueba que la API de Gemini esté activa y vuelve a intentarlo.'
      )
    }
  }
}
