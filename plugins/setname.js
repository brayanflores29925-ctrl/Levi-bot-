import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'perfiles.json')

function cargar() {
  try {
    if (!fs.existsSync(DATA_PATH)) return {}
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8') || '{}')
  } catch {
    return {}
  }
}

function guardar(data) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

export default {
  name: 'setname',

  async execute(sock, m, parts, enviar) {
    const sender = m.key?.participant || m.participant || m.key?.remoteJid
    const nombre = parts.join(' ').trim()

    if (!nombre) {
      return enviar(
        '✏️ *SETNAME*\n\n' +
        'Escribe el nombre que quieres usar en tu perfil.\n\n' +
        'Ejemplo:\n' +
        '/setname Levi'
      )
    }

    const perfiles = cargar()

    if (!perfiles[sender]) perfiles[sender] = {}

    perfiles[sender].nombre = nombre
    guardar(perfiles)

    return enviar(`✅ Tu nombre de perfil fue cambiado a:\n\n👤 *${nombre}*`)
  }
}
