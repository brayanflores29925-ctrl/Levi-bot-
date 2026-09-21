const API = 'https://bible-api.deno.dev/api/read/rv1960'

function limpiarTexto(texto) {
  return String(texto || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function pareceReferencia(texto) {
  return /\d+\s*[:.]\s*\d+/.test(texto) ||
         /^(salmo|salmos|génesis|genesis|éxodo|exodo|mateo|marcos|lucas|juan|romanos|corintios|gálatas|galatas|efesios|filipenses|colosenses|hebreos|santiago|apocalipsis)\s+\d+$/i.test(texto)
}

async function consultar(url) {
  const respuesta = await fetch(url, {
    headers: {
      'User-Agent': 'LeviBot/1.0'
    }
  })

  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}`)
  }

  return await respuesta.json()
}

function extraerVersiculos(data) {
  if (!data) return []

  if (Array.isArray(data.verses)) {
    return data.verses
  }

  if (Array.isArray(data.data?.verses)) {
    return data.data.verses
  }

  if (Array.isArray(data.results)) {
    return data.results
  }

  if (Array.isArray(data.data?.results)) {
    return data.data.results
  }

  return []
}

export default {
  name: 'biblia',
  aliases: ['bible'],
  description: '📚 Busca versículos, capítulos y temas bíblicos.',
  category: 'BÍBLICO',

  async execute(sock, m, parts, enviar) {
    const busqueda = parts.join(' ').trim()

    if (!busqueda) {
      return enviar(
        '╭━━〔 📚 BIBLIA 〕━━╮\n\n' +
        '🔎 Escribe lo que quieres buscar.\n\n' +
        '📖 *Versículo:*\n' +
        '• /biblia Juan 3:16\n' +
        '• /biblia Romanos 8:28\n\n' +
        '📜 *Capítulo:*\n' +
        '• /biblia Salmo 23\n' +
        '• /biblia Juan 3\n\n' +
        '🔎 *Tema:*\n' +
        '• /biblia amor\n' +
        '• /biblia fe\n' +
        '• /biblia Dios\n' +
        '• /biblia perdón\n' +
        '• /biblia esperanza\n\n' +
        '╰━━━━━━━━━━━━━━╯'
      )
    }

    try {
      await enviar(`🔎 *Buscando en la Biblia:* ${busqueda}...`)

      // Referencia bíblica: libro + capítulo + versículo
      if (pareceReferencia(busqueda)) {
        const partesRef = busqueda.match(/^(.+?)\s+(\d+)\s*[:.]\s*(\d+)(?:\s*-\s*(\d+))?$/)

        if (partesRef) {
          const libro = encodeURIComponent(partesRef[1].trim())
          const capitulo = partesRef[2]
          const versiculo = partesRef[3]
          const final = partesRef[4]

          let url = `${API}/${libro}/${capitulo}/${versiculo}`

          if (final) {
            url += `-${final}`
          }

          const data = await consultar(url)
          const versos = extraerVersiculos(data)

          if (!versos.length && data.text) {
            return enviar(
              `╭━━〔 📖 BIBLIA 〕━━╮\n\n` +
              `📍 *${busqueda}*\n\n` +
              `${limpiarTexto(data.text)}\n\n` +
              `📚 *Reina-Valera 1960*\n` +
              `╰━━━━━━━━━━━━━━╯`
            )
          }

          if (!versos.length) {
            return enviar('❌ No se encontró ese versículo.')
          }

          const texto = versos.slice(0, 20).map(v =>
            `*${v.verse || ''}* ${limpiarTexto(v.text)}`
          ).join('\n')

          return enviar(
            `╭━━〔 📖 BIBLIA 〕━━╮\n\n` +
            `📍 *${busqueda}*\n\n` +
            `${texto}\n\n` +
            `📚 *Reina-Valera 1960*\n` +
            `╰━━━━━━━━━━━━━━╯`
          )
        }
      }

      // Búsqueda por tema o palabra
      const url =
        `${API}/search?q=${encodeURIComponent(busqueda)}&take=5`

      const data = await consultar(url)
      const resultados = extraerVersiculos(data)

      if (!resultados.length) {
        return enviar(
          `❌ No encontré resultados para *${busqueda}*.\n\n` +
          `💡 Prueba con otro término, por ejemplo:\n` +
          `• amor\n• fe\n• Dios\n• esperanza\n• perdón`
        )
      }

      const texto = resultados.slice(0, 5).map((v, i) => {
        const referencia =
          v.reference ||
          `${v.book_name || v.book || ''} ${v.chapter || ''}:${v.verse || ''}`

        return `📖 *${referencia}*\n${limpiarTexto(v.text)}`
      }).join('\n\n')

      return enviar(
        `╭━━〔 🔎 BÚSQUEDA BÍBLICA 〕━━╮\n\n` +
        `🔍 *${busqueda}*\n\n` +
        `${texto}\n\n` +
        `📚 *Reina-Valera 1960*\n` +
        `╰━━━━━━━━━━━━━━╯`
      )

    } catch (error) {
      console.error('[LEVI] ERROR /biblia:', error)

      return enviar(
        '❌ *No se pudo consultar la Biblia.*\n\n' +
        'Comprueba tu conexión a Internet e inténtalo nuevamente.'
      )
    }
  }
}
