import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'contador.json')
const DIAS = 30

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

export default {
  name: 'verfantasmas',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const data = cargar()
    const grupo = data[chatId] || {}
    const limite = Date.now() - DIAS * 24 * 60 * 60 * 1000

    const fantasmas = Object.entries(grupo)
      .filter(([jid, info]) => {
        if (!info || typeof info !== 'object') return false
        return info.ultimaActividad && info.ultimaActividad <= limite
      })

    if (!fantasmas.length) {
      return sock.sendMessage(chatId, {
        text: '👻 *FANTASMAS*\n\n✅ No hay usuarios con 30 días o más de inactividad registrados.'
      })
    }

    let texto = `👻 *USUARIOS FANTASMAS*\n\n`
    texto += `⏳ Inactivos durante ${DIAS} días o más:\n\n`

    for (const [jid, info] of fantasmas) {
      const fecha = new Date(info.ultimaActividad).toLocaleDateString('es-HN')
      texto += `👤 @${jid.split('@')[0]}\n`
      texto += `💬 Mensajes: ${info.mensajes || 0}\n`
      texto += `📅 Última actividad: ${fecha}\n\n`
    }

    await sock.sendMessage(chatId, {
      text: texto,
      mentions: fantasmas.map(([jid]) => jid)
    })
  }
}
