import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'mensajes.json')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export function guardarMensaje(m) {
  try {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.sender

    if (!chatId?.endsWith('@g.us') || !sender) return

    let data = {}

    if (fs.existsSync(FILE)) {
      data = JSON.parse(fs.readFileSync(FILE, 'utf8'))
    }

    if (!data[chatId]) data[chatId] = []

    data[chatId].push({
      id: m.key.id,
      sender,
      timestamp: Date.now()
    })

    if (data[chatId].length > 200) {
      data[chatId] = data[chatId].slice(-200)
    }

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
  } catch {}
}

export default {
  name: 'registro',
  async execute() {}
}
