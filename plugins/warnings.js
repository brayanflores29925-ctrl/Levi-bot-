import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'warnings.json')

function cargar() {
  try {
    if (!fs.existsSync(DATA_PATH)) return {}
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8') || '{}')
  } catch {
    return {}
  }
}

export default {
  name: 'warnings',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    try {
      const metadata = await sock.groupMetadata(chatId)
      const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)

      if (!admins.includes(sender)) {
        return enviar('❌ Este comando es solo para administradores.')
      }

      const warnings = cargar()
      const grupo = warnings[chatId] || {}

      const mencionado =
        m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

      if (mencionado) {
        const cantidad = grupo[mencionado] || 0

        return enviar(
          `⚠️ Advertencias de @${mencionado.split('@')[0]}: *${cantidad}*`,
          { mentions: [mencionado] }
        )
      }

      const total = Object.values(grupo).reduce(
        (suma, cantidad) => suma + Number(cantidad || 0),
        0
      )

      return enviar(`⚠️ *ADVERTENCIAS DEL GRUPO*\n\nTotal de advertencias: *${total}*`)
    } catch (error) {
      console.error('Error en /warnings:', error)
      return enviar('❌ No se pudieron consultar las advertencias.')
    }
  }
}
