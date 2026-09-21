import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'contador.json')

export default {
  name: 'reiniciarcontador',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    let data = {}

    try {
      if (fs.existsSync(FILE)) {
        data = JSON.parse(fs.readFileSync(FILE, 'utf8'))
      }
    } catch {
      data = {}
    }

    data[chatId] = {}

    fs.mkdirSync(path.dirname(FILE), { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2))

    await sock.sendMessage(chatId, {
      text: '🔄 *CONTADOR REINICIADO*\n\n✅ Se reinició el contador de mensajes de este grupo.'
    })
  }
}
