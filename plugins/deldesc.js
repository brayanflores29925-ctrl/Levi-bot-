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
  name: 'deldesc',

  async execute(sock, m, parts, enviar) {
    const sender = m.key?.participant || m.participant || m.key?.remoteJid
    const perfiles = cargar()

    if (!perfiles[sender]?.bio) {
      return enviar('ℹ️ No tienes una biografía guardada para eliminar.')
    }

    delete perfiles[sender].bio
    guardar(perfiles)

    return enviar('✅ Tu biografía fue eliminada correctamente.')
  }
}
