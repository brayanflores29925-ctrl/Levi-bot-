import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'recargar',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.participant || chatId

    const cantidad = Number(parts[0])

    if (!cantidad || cantidad <= 0 || !Number.isFinite(cantidad)) {
      return enviar(
        '💳 *RECARGAR SALDO*\n\n' +
        'Escribe una cantidad válida.\n\n' +
        'Ejemplo:\n' +
        '/recargar 100'
      )
    }

    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

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

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      const moneda = db.ventas.tienda?.moneda || 'L'
      const saldo = db.ventas.saldos[sender]

      await enviar(
        `✅ *SALDO RECARGADO*\n\n` +
        `💳 Recarga: *${moneda} ${cantidad}*\n` +
        `💰 Saldo actual: *${moneda} ${saldo}*`
      )
    } catch (error) {
      console.error('Error en /recargar:', error)
      await enviar('❌ No se pudo recargar el saldo.')
    }
  }
}
