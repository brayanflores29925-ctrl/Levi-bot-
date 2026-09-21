import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'tienda',

  async execute(sock, m, parts, enviar) {
    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
      const ventas = db.ventas

      if (!ventas?.configuracion?.activa) {
        return enviar('❌ La tienda no está activa. Usa /setup primero.')
      }

      const nombre = ventas.tienda?.nombre || 'Mi Tienda'
      const moneda = ventas.tienda?.moneda || 'L'
      const productos = Object.values(ventas.productos || {})

      if (productos.length === 0) {
        return enviar(
          `🏪 *${nombre}*\n\n` +
          '📦 No hay productos disponibles todavía.\n\n' +
          'El administrador puede agregar productos con:\n' +
          '/addproducto'
        )
      }

      const disponibles = productos.filter(p => Number(p.stock) > 0)

      if (disponibles.length === 0) {
        return enviar(
          `🏪 *${nombre}*\n\n` +
          '❌ Actualmente no hay productos disponibles.'
        )
      }

      let texto = `🏪 *${nombre}*\n`
      texto += `💰 Moneda: *${moneda}*\n\n`
      texto += '╭━━〔 🛒 PRODUCTOS 〕━━╮\n'

      disponibles.forEach((producto, index) => {
        texto +=
          `\n${index + 1}. *${producto.nombre}*\n` +
          `💵 Precio: *${moneda} ${producto.precio}*\n` +
          `📦 Stock: *${producto.stock}*\n`

        if (producto.descripcion) {
          texto += `📝 ${producto.descripcion}\n`
        }
      })

      texto += '\n╰━━━━━━━━━━━━━━━━╯'

      await enviar(texto)
    } catch (error) {
      console.error('Error en /tienda:', error)
      await enviar('❌ No se pudo mostrar la tienda.')
    }
  }
}
