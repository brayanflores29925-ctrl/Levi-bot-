import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'welcome.json')

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

function guardar(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export default {
  name: 'Delbye',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const data = cargar()

    if (!data[chatId]) data[chatId] = {}

    delete data[chatId].bye
    delete data[chatId].textobye
    delete data[chatId].tipobye

    guardar(data)

    await sock.sendMessage(chatId, {
      text: '✅ El mensaje de despedida fue eliminado correctamente.'
    })
  }
}
