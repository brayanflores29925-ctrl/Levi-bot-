import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'ausente.json')

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

function guardar(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export default {
  name: 'Ausente',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const data = cargar()
    const estado = parts?.join(' ').trim()

    if (!estado) {
      const activo = data[chatId]?.activo || false

      return await sock.sendMessage(chatId, {
        text:
          `💤 *MODO AUSENTE*\n\n` +
          `Estado: *${activo ? 'ACTIVADO 🟢' : 'DESACTIVADO 🔴'}*\n\n` +
          `Usa:\n` +
          `• /Ausente on — Activar\n` +
          `• /Ausente off — Desactivar`
      })
    }

    if (['on', 'activar', 'activo'].includes(estado.toLowerCase())) {
      data[chatId] = {
        ...(data[chatId] || {}),
        activo: true
      }

      guardar(data)

      return await sock.sendMessage(chatId, {
        text: '💤✅ *Modo ausente activado.*'
      })
    }

    if (['off', 'desactivar', 'inactivo'].includes(estado.toLowerCase())) {
      data[chatId] = {
        ...(data[chatId] || {}),
        activo: false
      }

      guardar(data)

      return await sock.sendMessage(chatId, {
        text: '💤❌ *Modo ausente desactivado.*'
      })
    }

    return await sock.sendMessage(chatId, {
      text:
        '❌ Opción no válida.\n\n' +
        'Usa:\n' +
        '• /Ausente on\n' +
        '• /Ausente off'
    })
  }
}
