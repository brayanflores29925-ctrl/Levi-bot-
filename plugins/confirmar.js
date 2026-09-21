import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

function cargar() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

function guardar(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export default {
  name: 'confirmar',

  async execute(sock, m, parts, enviar) {
    const sender = m.key?.participant || m.participant || m.key?.remoteJid
    const cantidad = Number(parts[0])

    if (!cantidad || cantidad <= 0 || !Number.isFinite(cantidad)) {
      return enviar(
        '✅ *CONFIRMAR*\n\n' +
        'Escribe la cantidad que quieres confirmar.\n\n' +
        'Ejemplo:\n' +
        '/confirmar 100'
      )
    }

    try {
      const db = cargar()

      if (!db.ventas?.configuracion?.activa) {
        return enviar('❌ Primero activa la tienda con /setup.')
      }

      if (!db.ventas.saldos) {
        db.ventas.saldos = {}
      }

      if (!db.ventas.saldos[sender]) {
        db.ventas.saldos[sender] = 0
      }

      db.ventas.saldos[sender] += cantidad

      if (!Array.isArray(db.ventas.compras)) {
        db.ventas.compras = []
      }

      db.ventas.compras.push({
        id: `REC-${Date.now()}`,
        usuario: sender,
        tipo: 'recarga',
        cantidad,
        fecha: new Date().toISOString()
      })

      guardar(db)

      const moneda = db.ventas.tienda?.moneda || 'L'

      await enviar(
        `✅ *OPERACIÓN CONFIRMADA*\n\n` +
        `💳 Cantidad: *${moneda} ${cantidad}*\n` +
        `💰 Saldo actual: *${moneda} ${db.ventas.saldos[sender]}*`
      )
    } catch (error) {
      console.error('Error en /confirmar:', error)
      await enviar('❌ No se pudo confirmar la operación.')
    }
  }
}
