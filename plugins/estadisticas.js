import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')
const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'estadisticas',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.participant || chatId

    if (chatId !== GRUPO_OFICIAL) {
      return enviar('❌ Este comando solo funciona en el grupo oficial.')
    }

    try {
      const metadata = await sock.groupMetadata(chatId)

      const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)

      if (!admins.includes(sender)) {
        return enviar('❌ Este comando es solo para administradores.')
      }

      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas?.configuracion?.activa) {
        return enviar('❌ Primero activa la tienda con /setup.')
      }

      const productos = Object.values(db.ventas.productos || {})

      const ventas = Array.isArray(db.ventas.ventas)
        ? db.ventas.ventas.filter(v => v.tipo !== 'recarga')
        : []

      const moneda = db.ventas.tienda?.moneda || 'L'
      const nombre = db.ventas.tienda?.nombre || 'Mi Tienda'
      const tipo = db.ventas.tienda?.tipo || 'general'

      const totalStock = productos.reduce(
        (total, producto) =>
          total + Number(producto.stock || 0),
        0
      )

      const unidadesVendidas = ventas.reduce(
        (total, venta) =>
          total + Number(venta.cantidad || 0),
        0
      )

      const dineroVendido = ventas.reduce(
        (total, venta) =>
          total + Number(venta.total || 0),
        0
      )

      const pocoStock = productos.filter(
        producto => Number(producto.stock || 0) <= 5
      ).length

      const compradores = new Set(
        ventas
          .map(venta => venta.usuario)
          .filter(Boolean)
      ).size

      await enviar(
        '📊 *ESTADÍSTICAS DE LA TIENDA*\n\n' +
        `🏪 Tienda: *${nombre}*\n` +
        `🏷️ Tipo: *${tipo}*\n` +
        `💰 Moneda: *${moneda}*\n\n` +
        '📦 *INVENTARIO*\n' +
        `🛍️ Productos: *${productos.length}*\n` +
        `📊 Stock disponible: *${totalStock}*\n` +
        `⚠️ Productos con poco stock: *${pocoStock}*\n\n` +
        '🛒 *VENTAS*\n' +
        `🧾 Operaciones: *${ventas.length}*\n` +
        `📦 Unidades vendidas: *${unidadesVendidas}*\n` +
        `💵 Dinero vendido: *${moneda} ${dineroVendido}*\n` +
        `👥 Compradores: *${compradores}*\n\n` +
        '✅ Estadísticas actualizadas.'
      )
    } catch (error) {
      console.error('Error en /estadisticas:', error)
      await enviar('❌ No se pudieron obtener las estadísticas.')
    }
  }
}
