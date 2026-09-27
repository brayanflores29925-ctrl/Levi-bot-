import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'muted.json')
const TEMP_PATH = path.join(process.cwd(), 'data', 'mute2.json')

function cargarArchivo(file) {
  try {
    if (!fs.existsSync(file)) return {}
    return JSON.parse(fs.readFileSync(file, 'utf8') || '{}')
  } catch {
    return {}
  }
}

function guardarArchivo(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

function obtenerObjetivo(m) {
  const ctx = m.message?.extendedTextMessage?.contextInfo
  return ctx?.mentionedJid?.[0] || ctx?.participant || null
}

function convertirTiempo(valor) {
  const texto = String(valor || '').toLowerCase().trim()
  const match = texto.match(/^(\d+)(s|m|h|d)$/)

  if (!match) return null

  const cantidad = Number(match[1])
  const unidad = match[2]

  if (!cantidad || cantidad < 1) return null

  const multiplicadores = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  }

  return cantidad * multiplicadores[unidad]
}

function textoTiempo(valor) {
  const texto = String(valor).toLowerCase()
  const numero = Number(texto.match(/\d+/)?.[0] || 0)
  const unidad = texto.slice(-1)

  if (unidad === 's') return `${numero} segundo(s)`
  if (unidad === 'm') return `${numero} minuto(s)`
  if (unidad === 'h') return `${numero} hora(s)`
  if (unidad === 'd') return `${numero} día(s)`

  return texto
}

export default {
  name: 'mute2',

  async execute(sock, m, parts, enviar) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    const sender = m.sender || m.key?.participant || chatId

    try {
      const metadata = await sock.groupMetadata(chatId)

      const admin = metadata.participants.some(
        p => p.id === sender && p.admin
      )

      if (!admin) {
        return enviar('❌ Solo los administradores pueden usar este comando.')
      }

      const objetivo = obtenerObjetivo(m)
      const tiempoTexto = parts?.[0]
      const duracion = convertirTiempo(tiempoTexto)

      if (!objetivo || !duracion) {
        return enviar(
          '🔇 *MUTE TEMPORAL*\n\n' +
          'Menciona a la persona o responde a su mensaje.\n\n' +
          'Ejemplos:\n' +
          '/mute2 @usuario 15m\n' +
          '/mute2 @usuario 1h\n' +
          '/mute2 @usuario 2h\n' +
          '/mute2 @usuario 1d\n\n' +
          'Unidades: s = segundos, m = minutos, h = horas, d = días.'
        )
      }

      const muted = cargarArchivo(DATA_PATH)
      const temporales = cargarArchivo(TEMP_PATH)

      if (!Array.isArray(muted[chatId])) {
        muted[chatId] = []
      }

      if (muted[chatId].includes(objetivo)) {
        return enviar('⚠️ Esa persona ya está silenciada.')
      }

      muted[chatId].push(objetivo)

      temporales[`${chatId}|${objetivo}`] = {
        chatId,
        userId: objetivo,
        expiresAt: Date.now() + duracion
      }

      guardarArchivo(DATA_PATH, muted)
      guardarArchivo(TEMP_PATH, temporales)

      setTimeout(() => {
        try {
          const mutedActual = cargarArchivo(DATA_PATH)
          const temporalesActual = cargarArchivo(TEMP_PATH)

          if (Array.isArray(mutedActual[chatId])) {
            mutedActual[chatId] =
              mutedActual[chatId].filter(id => id !== objetivo)

            if (mutedActual[chatId].length === 0) {
              delete mutedActual[chatId]
            }
          }

          delete temporalesActual[`${chatId}|${objetivo}`]

          guardarArchivo(DATA_PATH, mutedActual)
          guardarArchivo(TEMP_PATH, temporalesActual)

          sock.sendMessage(chatId, {
            text:
              '🔊 *MUTE TEMPORAL TERMINADO*\n\n' +
              `👤 @${objetivo.split('@')[0]}\n\n` +
              '✅ Ya puede enviar mensajes nuevamente.',
            mentions: [objetivo]
          }).catch(() => {})
        } catch {}
      }, duracion)

      return enviar(
        '🔇 *USUARIO SILENCIADO TEMPORALMENTE*\n\n' +
        `👤 @${objetivo.split('@')[0]}\n` +
        `⏱️ Duración: ${textoTiempo(tiempoTexto)}\n\n` +
        '🚫 Sus mensajes serán eliminados durante ese tiempo.\n' +
        '🔊 Al terminar, podrá escribir nuevamente.',
        { mentions: [objetivo] }
      )
    } catch (error) {
      return enviar(`❌ No se pudo activar el mute temporal: ${error.message}`)
    }
  }
}
