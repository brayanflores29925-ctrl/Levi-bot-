import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'welcome.json')

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

export default {
  name: 'Textwelcome',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const data = cargar()
    const grupo = data[chatId] || {}
    const texto = grupo.textowelcome || grupo.welcome

    if (!texto) {
      return await sock.sendMessage(chatId, {
        text: '⚠️ Este grupo no tiene un mensaje de bienvenida configurado.'
      })
    }

    await sock.sendMessage(chatId, {
      text:
        `👋 *MENSAJE DE BIENVENIDA*\n\n` +
        `${texto}`
    })
  }
}
