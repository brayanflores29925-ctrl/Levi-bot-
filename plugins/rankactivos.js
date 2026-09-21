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
  name: 'rankactivos',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const data = cargar()
    const grupo = data[chatId] || {}

    const ranking = Object.entries(grupo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    if (!ranking.length) {
      return await sock.sendMessage(chatId, {
        text: '🏆 Todavía no hay usuarios registrados en el ranking.'
      })
    }

    let texto = '🏆 *RANKING DE USUARIOS ACTIVOS* 🏆\n\n'

    const posiciones = ['🥇', '🥈', '🥉']

    ranking.forEach(([usuario, cantidad], i) => {
      const puesto = posiciones[i] || `${i + 1}️⃣`
      texto += `${puesto} @${usuario.split('@')[0]} — *${cantidad} mensajes*\n`
    })

    await sock.sendMessage(chatId, {
      text: texto,
      mentions: ranking.map(([usuario]) => usuario)
    })
  }
}
