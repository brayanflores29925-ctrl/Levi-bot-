import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CODES_PATH = path.join(__dirname, 'authcodes.json')

const DURACION = 15 * 60 * 1000

function load() {
  if (!fs.existsSync(CODES_PATH)) {
    const inicial = { codes: {} }
    fs.writeFileSync(CODES_PATH, JSON.stringify(inicial, null, 2))
    return inicial
  }

  try {
    return JSON.parse(fs.readFileSync(CODES_PATH, 'utf-8'))
  } catch {
    return { codes: {} }
  }
}

function save(data) {
  fs.writeFileSync(CODES_PATH, JSON.stringify(data, null, 2))
}

function limpiarExpirados(db) {
  const ahora = Date.now()

  for (const usuario of Object.keys(db.codes)) {
    if (db.codes[usuario].expiresAt <= ahora) {
      delete db.codes[usuario]
    }
  }
}

export function generarCodigo(usuario) {
  const db = load()

  limpiarExpirados(db)

  const codigo = String(Math.floor(100000 + Math.random() * 900000))

  db.codes[usuario] = {
    code: codigo,
    expiresAt: Date.now() + DURACION
  }

  save(db)

  return codigo
}

export function validarCodigo(usuario, codigo) {
  const db = load()

  limpiarExpirados(db)

  const registro = db.codes[usuario]

  if (!registro) {
    save(db)
    return false
  }

  if (registro.code !== codigo) {
    return false
  }

  delete db.codes[usuario]
  save(db)

  return true
}

export function tiempoRestante(usuario) {
  const db = load()
  const registro = db.codes[usuario]

  if (!registro) return 0

  const restante = registro.expiresAt - Date.now()

  if (restante <= 0) {
    delete db.codes[usuario]
    save(db)
    return 0
  }

  return Math.ceil(restante / 1000)
}
