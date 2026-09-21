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
  name: 'leyendafacke',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    const metadata = await sock.groupMetadata(chatId)
    const admin = metadata.participants.find(p => p.id === sender)?.admin

    if (!admin) {
      return enviar('❌ Solo un administrador puede configurar la leyenda.')
    }

    const db = cargarDB()

    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}

    if (!args.length) {
      const actual = db.grupos[chatId].leyendaFake || 'No configurada'
      return enviar(
        `📝 *LEYENDA ANTIFAKE*\n\n` +
        `Actual:\n${actual}\n\n` +
        `Uso:\n/leyendafacke Tu mensaje aquí`
      )
    }

    const leyenda = args.join(' ').trim()

    db.grupos[chatId].leyendaFake = leyenda
    guardarDB(db)

    return enviar(
      `✅ *Leyenda AntiFake configurada.*\n\n` +
      `📝 ${leyenda}`
    )
  }
}
