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

function guardarDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

export default {
  name: 'welcome',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    const metadata = await sock.groupMetadata(chatId)
    const admin = metadata.participants.find(p => p.id === sender)?.admin

    if (!admin) {
      return enviar('❌ Solo un administrador puede usar este comando.')
    }

    const db = cargarDB()

    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}

    const opcion = args?.[0]?.toLowerCase()

    if (opcion === 'on' || opcion === '1') {
      db.grupos[chatId].welcome = true
      guardarDB(db)
      return enviar('✅ *Bienvenida activada.*\n\nAhora el grupo tiene activado el sistema de bienvenida.')
    }

    if (opcion === 'off' || opcion === '0') {
      db.grupos[chatId].welcome = false
      guardarDB(db)
      return enviar('🔴 *Bienvenida desactivada.*')
    }

    const estado = db.grupos[chatId].welcome ? 'ACTIVADA ✅' : 'DESACTIVADA 🔴'

    return enviar(
      `👋 *SISTEMA DE BIENVENIDA*\n\n` +
      `Estado: *${estado}*\n\n` +
      `Uso:\n` +
      `• /welcome on — Activar\n` +
      `• /welcome off — Desactivar`
    )
  }
}
