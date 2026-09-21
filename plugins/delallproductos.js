import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')
const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'delallproductos',

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

      const productos = db.ventas.productos || {}
      const cantidad = Object.keys(productos).length

      if (cantidad === 0) {
        return enviar('📦 No hay productos para eliminar.')
      }

      db.ventas.productos = {}

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      await enviar(
        '🗑️ *TODOS LOS PRODUCTOS ELIMINADOS*\n\n' +
        `📦 Productos eliminados: *${cantidad}*\n\n` +
        '✅ La tienda quedó sin productos.'
      )
    } catch (error) {
      console.error('Error en /delallproductos:', error)
      await enviar('❌ No se pudieron eliminar los productos.')
    }
  }
}
