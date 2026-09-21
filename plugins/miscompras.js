import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'miscompras',

  async execute(sock, m, parts, enviar) {
    const sender = m.key?.participant || m.participant || m.key?.remoteJid

    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas?.configuracion?.activa) {
        return enviar('❌ La tienda no está activa. Usa /setup primero.')
      }

      const compras = Array.isArray(db.ventas.compras)
        ? db.ventas.compras.filter(
            compra =>
              compra.usuario === sender &&
              compra.tipo !== 'recarga'
          )
        : []

      const moneda = db.ventas.tienda?.moneda || 'L'

      if (compras.length === 0) {
        return enviar(
          '🧾 *MIS COMPRAS*\n\n' +
          '📭 No tienes compras registradas todavía.'
        )
      }

      let texto = '🧾 *MIS COMPRAS*\n\n'

      compras.slice(-20).reverse().forEach((compra, index) => {
        const fecha = compra.fecha
          ? new Date(compra.fecha).toLocaleString('es-HN')
          : 'Sin fecha'

        texto +=
          `🛒 *Compra ${index + 1}*\n` +
          `🧾 ID: *${compra.id}*\n` +
          `📦 Producto: *${compra.producto || 'Sin nombre'}*\n` +
          `🔢 Cantidad: *${compra.cantidad || 1}*\n` +
          `💰 Total: *${moneda} ${compra.total || 0}*\n` +
          `📅 Fecha: *${fecha}*\n\n`
      })

      texto += '━━━━━━━━━━━━━━━━\n'
      texto += `📊 Compras mostradas: *${Math.min(compras.length, 20)}*`

      await enviar(texto)
    } catch (error) {
      console.error('Error en /miscompras:', error)
      await enviar('❌ No se pudieron mostrar tus compras.')
    }
  }
}
