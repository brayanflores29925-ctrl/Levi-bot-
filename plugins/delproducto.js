import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')
const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'delproducto',

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

      const id = parts[0]?.trim()

      if (!id) {
        return enviar(
          '🗑️ *ELIMINAR PRODUCTO*\n\n' +
          'Escribe el ID del producto.\n\n' +
          'Ejemplo:\n' +
          '/delproducto PROD-123456789'
        )
      }

      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas?.configuracion?.activa) {
        return enviar('❌ Primero activa la tienda con /setup.')
      }

      if (!db.ventas.productos?.[id]) {
        return enviar(`❌ No existe ningún producto con el ID *${id}*.`)
      }

      const producto = db.ventas.productos[id]

      delete db.ventas.productos[id]

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      await enviar(
        '✅ *PRODUCTO ELIMINADO*\n\n' +
        `🆔 ID: *${id}*\n` +
        `📦 Producto: *${producto.nombre}*\n` +
        '🗑️ Eliminado correctamente.'
      )
    } catch (error) {
      console.error('Error en /delproducto:', error)
      await enviar('❌ No se pudo eliminar el producto.')
    }
  }
}
