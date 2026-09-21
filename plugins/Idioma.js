import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'idiomas.json')

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
  name: 'Idioma',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const data = cargar()
    const idioma = parts?.join(' ').trim().toLowerCase()

    if (!idioma) {
      const actual = data[chatId] || 'español'

      return await sock.sendMessage(chatId, {
        text:
          `🌐 *IDIOMA DE LEVIBOT*\n\n` +
          `Idioma actual: *${actual}*\n\n` +
          `Para cambiarlo usa:\n` +
          `• /Idioma español 🇪🇸\n` +
          `• /Idioma ingles 🇺🇸`
      })
    }

    if (idioma === 'español' || idioma === 'espanol' || idioma === 'es') {
      data[chatId] = 'español'
      guardar(data)

      return await sock.sendMessage(chatId, {
        text: '🇪🇸 ✅ Idioma cambiado a *Español*.'
      })
    }

    if (idioma === 'ingles' || idioma === 'inglés' || idioma === 'en') {
      data[chatId] = 'ingles'
      guardar(data)

      return await sock.sendMessage(chatId, {
        text: '🇺🇸 ✅ Language changed to *English*.'
      })
    }

    await sock.sendMessage(chatId, {
      text:
        '❌ Idioma no disponible.\n\n' +
        'Idiomas disponibles:\n' +
        '🇪🇸 español\n' +
        '🇺🇸 ingles'
    })
  }
}
