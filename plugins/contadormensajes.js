import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'contador.json')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

function guardar(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export default {
  name: 'contadormensajes',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const data = cargar()

    if (!data[chatId]) data[chatId] = {}

    if (!data[chatId][sender]) {
      data[chatId][sender] = {
        mensajes: 0,
        ultimaActividad: Date.now()
      }
    }

    const usuario = data[chatId][sender]

    if (typeof usuario === 'number') {
      data[chatId][sender] = {
        mensajes: usuario,
        ultimaActividad: Date.now()
      }
    } else {
      usuario.mensajes = (usuario.mensajes || 0) + 1
      usuario.ultimaActividad = Date.now()
    }

    guardar(data)

    const grupo = data[chatId] || {}

    const total = Object.values(grupo).reduce((suma, usuario) => {
      return suma + (typeof usuario === 'number' ? usuario : (usuario.mensajes || 0))
    }, 0)

    await sock.sendMessage(chatId, {
      text:
        `📊 *CONTADOR DE MENSAJES*\n\n` +
        `💬 Mensajes registrados: *${total}*\n\n` +
        `👻 Usa /verfantasmas para ver usuarios con 30 días o más de inactividad.`
    })
  }
}
