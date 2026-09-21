import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'horarios.json')

let iniciado = false
const ultimaAccion = new Map()

function obtenerHora() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Tegucigalpa',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date())
}

function cargarHorarios() {
  try {
    if (!fs.existsSync(DATA_PATH)) return {}
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8') || '{}')
  } catch {
    return {}
  }
}

export function iniciarHorarioAutomatico(sock) {
  if (iniciado) return
  iniciado = true

  setInterval(async () => {
    const horarios = cargarHorarios()
    const horaActual = obtenerHora()

    for (const [chatId, horario] of Object.entries(horarios)) {
      if (!chatId.endsWith('@g.us')) continue
      if (!horario?.apertura || !horario?.cierre) continue

      try {
        if (
          horaActual === horario.apertura &&
          ultimaAccion.get(chatId) !== `abrir-${horaActual}`
        ) {
          await sock.groupSettingUpdate(chatId, 'not_announcement')
          ultimaAccion.set(chatId, `abrir-${horaActual}`)
          console.log(`[LEVI] ⏰ Grupo abierto automáticamente: ${chatId}`)
        }

        if (
          horaActual === horario.cierre &&
          ultimaAccion.get(chatId) !== `cerrar-${horaActual}`
        ) {
          await sock.groupSettingUpdate(chatId, 'announcement')
          ultimaAccion.set(chatId, `cerrar-${horaActual}`)
          console.log(`[LEVI] ⏰ Grupo cerrado automáticamente: ${chatId}`)
        }
      } catch (error) {
        console.log(`[LEVI] ⚠️ No se pudo cambiar el grupo ${chatId}: ${error.message}`)
      }
    }
  }, 15000)

  console.log('[LEVI] ⏰ Horarios automáticos activados.')
}
