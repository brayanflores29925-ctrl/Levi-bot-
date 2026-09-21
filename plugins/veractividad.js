import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'contador.json')

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

export default {
  name: 'veractividad',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const data = cargar()
    const grupo = data[chatId] || {}

    const usuarios = Object.entries(grupo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    if (!usuarios.length) {
      return await sock.sendMessage(chatId, {
        text: '📊 Todavía no hay actividad registrada.'
      })
    }

    let texto = '📊 *ACTIVIDAD DEL GRUPO*\\n\\n'

    usuarios.forEach(([usuario, cantidad], i) => {
      texto += `${i + 1}. @${usuario.split('@')[0]} — *${cantidad} mensajes*\\n`
    })

    await sock.sendMessage(chatId, {
      text: texto,
      mentions: usuarios.map(([usuario]) => usuario)
    })
  }
}
