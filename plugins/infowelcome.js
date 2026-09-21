import fs from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), 'database.json')

function cargarDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  } catch {
    return {}
  }
}

export default {
  name: 'infowelcome',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    const db = cargarDB()
    const grupo = db.grupos?.[chatId] || {}

    const welcome = grupo.welcome || {}
    const bye = grupo.bye || {}

    return enviar(
      `👋 *CONFIGURACIÓN DE BIENVENIDA*\n\n` +
      `🟢 Bienvenida: *${welcome.activo ? 'Activada' : 'Desactivada'}*\n` +
      `📝 Texto: ${welcome.texto || 'No configurado'}\n` +
      `🎨 Tipo: ${welcome.tipo || 'texto'}\n\n` +
      `👋 *DESPEDIDA*\n\n` +
      `🟢 Despedida: *${bye.activo ? 'Activada' : 'Desactivada'}*\n` +
      `📝 Texto: ${bye.texto || 'No configurado'}\n` +
      `🎨 Tipo: ${bye.tipo || 'texto'}`
    )
  }
}
