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

function guardar(data) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

function obtenerObjetivo(m) {
  const ctx = m.message?.extendedTextMessage?.contextInfo
  return ctx?.mentionedJid?.[0] || ctx?.participant || null
}

export default {
  name: 'desmute',

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
          '🔊 *UNMUTE*\n\n' +
          'Debes mencionar a la persona a la que quieres quitarle el mute.\n\n' +
          'Ejemplo:\n' +
          '/unmute @usuario'
        )
      }

      const data = cargar()

      if (!data[chatId]?.includes(objetivo)) {
        return enviar('⚠️ Esa persona no está silenciada.')
      }

      data[chatId] = data[chatId].filter(id => id !== objetivo)

      if (data[chatId].length === 0) {
        delete data[chatId]
      }

      guardar(data)

      return enviar(
        '🔊 *MUTE QUITADO*\n\n' +
        `👤 @${objetivo.split('@')[0]}\n\n` +
        '✅ Ya puede enviar mensajes normalmente.',
        { mentions: [objetivo] }
      )
    } catch (error) {
      return enviar(`❌ No se pudo quitar el mute: ${error.message}`)
    }
  }
}
