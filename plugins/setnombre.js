import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'setnombre',

  async execute(sock, m, parts, enviar) {
    const nombre = parts.join(' ').trim()

    if (!nombre) {
      return enviar(
        '📝 *SETNOMBRE*\n\n' +
        'Escribe el nuevo nombre de la tienda.\n\n' +
        'Ejemplo:\n' +
        '/setnombre Tienda Levi'
      )
    }

    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas) {
        return enviar('❌ Primero activa el sistema con /setup.')
      }

      db.ventas.tienda.nombre = nombre
      db.ventas.configuracion.activa = true

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      await enviar(
        `✅ *NOMBRE DE TIENDA ACTUALIZADO*\n\n` +
        `🏪 Nuevo nombre: *${nombre}*`
      )
    } catch (error) {
      console.error('Error en /setnombre:', error)
      await enviar('❌ No se pudo cambiar el nombre de la tienda.')
    }
  }
}
