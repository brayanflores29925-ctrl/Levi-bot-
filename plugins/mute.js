import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'muted.json')

function cargar() {
  try {
    if (!fs.existsSync(DATA_PATH)) return {}
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8') || '{}')
  } catch {
    return {}
  }
}

export function estaSilenciado(chatId, userId) {
  const data = cargar()
  return Array.isArray(data[chatId]) && data[chatId].includes(userId)
}

function guardar(data) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

function obtenerObjetivo(m) {
  const ctx = m.message?.extendedTextMessage?.contextInfo
  const mencionado = ctx?.mentionedJid?.[0]

  if (mencionado) return mencionado

  return ctx?.participant || null
}

export default {
  name: 'mute',

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

      if (!objetivo) {
        return enviar(
          '🔇 *MUTE*\n\n' +
          'Debes mencionar a la persona que quieres silenciar.\n\n' +
          'Ejemplo:\n' +
          '/mute @usuario'
        )
      }

      const botId = sock.user?.id?.split(':')[0] + '@s.whatsapp.net'

      if (objetivo === botId) {
        return enviar('❌ No puedo silenciarme a mí mismo.')
      }

      const data = cargar()

      if (!data[chatId]) data[chatId] = []

      if (data[chatId].includes(objetivo)) {
        return enviar('⚠️ Esa persona ya está silenciada.')
      }

      data[chatId].push(objetivo)
      guardar(data)

      return enviar(
        '🔇 *USUARIO SILENCIADO*\n\n' +
        `👤 @${objetivo.split('@')[0]}\n\n` +
        '🚫 Sus mensajes serán eliminados mientras permanezca silenciado.\n\n' +
        '🔊 Para quitar el silencio usa:\n' +
        '/unmute @usuario',
        { mentions: [objetivo] }
      )
    } catch (error) {
      return enviar(`❌ No se pudo activar el mute: ${error.message}`)
    }
  }
}
