import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'idiomas.json')
const cache = new Map()

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    const data = JSON.parse(fs.readFileSync(FILE, 'utf8'))
    return data && typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

function guardar(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export function obtenerIdioma(chatId) {
  const data = cargar()
  return data[chatId] || 'es'
}

function proteger(texto) {
  const protegidos = []

  const resultado = texto.replace(
    /https?:\/\/\S+|@[0-9]+|[.!#\/][A-Za-zÁÉÍÓÚáéíóúÑñ0-9_-]+/gu,
    valor => {
      const id = `ZZZLEVI${protegidos.length}ZZZ`
      protegidos.push(valor)
      return id
    }
  )

  return { resultado, protegidos }
}

function restaurar(texto, protegidos) {
  for (let i = 0; i < protegidos.length; i++) {
    texto = texto.replaceAll(`ZZZLEVI${i}ZZZ`, protegidos[i])
  }

  return texto
}

async function traducirParte(texto, idioma) {
  if (!texto || !texto.trim()) return texto
  if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/u.test(texto)) return texto

  const { resultado, protegidos } = proteger(texto)

  try {
    const url =
      'https://translate.googleapis.com/translate_a/single' +
      '?client=gtx' +
      '&sl=auto' +
      `&tl=${idioma}` +
      '&dt=t' +
      `&q=${encodeURIComponent(resultado)}`

    const respuesta = await fetch(url)

    if (!respuesta.ok) return texto

    const datos = await respuesta.json()

    const traducido =
      datos?.[0]
        ?.map(parte => parte?.[0] || '')
        .join('') || texto

    return restaurar(traducido, protegidos)
  } catch {
    return texto
  }
}

function dividirTexto(texto, maximo = 700) {
  const partes = []

  while (texto.length > maximo) {
    let posicion = texto.lastIndexOf(' ', maximo)

    if (posicion < 100) posicion = maximo

    partes.push(texto.slice(0, posicion))
    texto = texto.slice(posicion).trimStart()
  }

  if (texto) partes.push(texto)

  return partes
}

export async function traducirTextoParaChat(chatId, texto) {
  const idioma = obtenerIdioma(chatId)

  if (idioma === 'es' || !texto) {
    return texto
  }

  const clave = `${idioma}:${texto}`

  if (cache.has(clave)) {
    return cache.get(clave)
  }

  const lineas = texto.split('\n')
  const resultado = []

  for (const linea of lineas) {
    if (!linea.trim()) {
      resultado.push('')
      continue
    }

    const partes = dividirTexto(linea)
    const traducidas = []

    for (const parte of partes) {
      traducidas.push(await traducirParte(parte, idioma))
    }

    resultado.push(traducidas.join(' '))
  }

  const final = resultado.join('\n')

  cache.set(clave, final)

  if (cache.size > 200) {
    cache.delete(cache.keys().next().value)
  }

  return final
}

export function traducir(chatId, textos) {
  const idioma = obtenerIdioma(chatId)

  if (idioma === 'en') {
    return textos.en || textos.es
  }

  return textos.es
}

export default {
  name: 'Idioma',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const idioma = parts?.join(' ').trim().toLowerCase()
    const data = cargar()

    if (!idioma) {
      const actual = data[chatId] || 'es'

      return await sock.sendMessage(chatId, {
        text:
          `🌐 *IDIOMA DE LEVIBOT*\n\n` +
          `Idioma actual: *${actual === 'es' ? 'Español 🇪🇸' : 'English 🇺🇸'}*\n\n` +
          `Usa:\n` +
          `• /Idioma español\n` +
          `• /Idioma ingles`
      })
    }

    if (
      idioma === 'es' ||
      idioma === 'español' ||
      idioma === 'espanol'
    ) {
      data[chatId] = 'es'
      guardar(data)

      return await sock.sendMessage(chatId, {
        text: '🇪🇸 ✅ LeviBot ahora usará *Español*.'
      })
    }

    if (
      idioma === 'en' ||
      idioma === 'ingles' ||
      idioma === 'inglés' ||
      idioma === 'english'
    ) {
      data[chatId] = 'en'
      guardar(data)

      return await sock.sendMessage(chatId, {
        text: '🇺🇸 ✅ LeviBot will now use *English*.'
      })
    }

    return await sock.sendMessage(chatId, {
      text:
        '❌ Idioma no disponible.\n\n' +
        'Disponible:\n' +
        '🇪🇸 español\n' +
        '🇺🇸 ingles'
    })
  }
}
