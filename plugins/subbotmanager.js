import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'subbots.json')

export const MAX_SUBBOTS = 10

function cargar() {
  try {
    if (!fs.existsSync(DATA_FILE)) return []

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function guardar(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export function obtenerSubbots() {
  return cargar()
}

export function obtenerSubbotsActivos() {
  return cargar().filter(subbot => subbot.activo === true)
}

export function hayEspacio() {
  return obtenerSubbotsActivos().length < MAX_SUBBOTS
}

export function agregarSubbot(numero) {
  const subbots = cargar()

  if (obtenerSubbotsActivos().length >= MAX_SUBBOTS) {
    return {
      ok: false,
      motivo: 'limite'
    }
  }

  if (subbots.some(subbot => subbot.numero === numero && subbot.activo === true)) {
    return {
      ok: false,
      motivo: 'existente'
    }
  }

  const existente = subbots.find(subbot => subbot.numero === numero)

  if (existente) {
    existente.activo = true
    guardar(subbots)

    return {
      ok: true,
      subbot: existente
    }
  }

  const subbot = {
    numero,
    agregado: new Date().toISOString(),
    activo: true
  }

  subbots.push(subbot)
  guardar(subbots)

  return {
    ok: true,
    subbot
  }
}

export function eliminarSubbot(numero) {
  const subbots = cargar()
  const nuevos = subbots.filter(subbot => subbot.numero !== numero)

  if (nuevos.length === subbots.length) {
    return false
  }

  guardar(nuevos)
  return true
}

export function espaciosDisponibles() {
  return MAX_SUBBOTS - obtenerSubbotsActivos().length
}

export default {
  name: 'subbotmanager',
  execute() {}
}
