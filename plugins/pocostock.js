import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')
const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'pocostock',

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
        .filter(producto => Number(producto.stock) <= 5)
        .sort((a, b) => Number(a.stock) - Number(b.stock))

      const moneda = db.ventas.tienda?.moneda || 'L'

      if (productos.length === 0) {
        return enviar(
          '📦 *POCO STOCK*\n\n' +
          '✅ Todos los productos tienen más de 5 unidades.'
        )
      }

      let texto = '⚠️ *PRODUCTOS CON POCO STOCK*\n\n'

      productos.forEach((producto, index) => {
        const stock = Number(producto.stock || 0)

        texto +=
          `${index + 1}. *${producto.nombre}*\n` +
          `🆔 ID: *${producto.id}*\n` +
          `📊 Stock: *${stock}*\n` +
          `💰 Precio: *${moneda} ${producto.precio}*\n\n`
      })

      texto += '━━━━━━━━━━━━━━━━\n'
      texto += `📦 Productos con poco stock: *${productos.length}*`

      await enviar(texto)
    } catch (error) {
      console.error('Error en /pocostock:', error)
      await enviar('❌ No se pudo consultar el stock.')
    }
  }
}
