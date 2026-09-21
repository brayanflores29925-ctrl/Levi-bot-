import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'setoferta',

  async execute(sock, m, args, enviar) {
    try {
      if (!args?.length) {
        return enviar(
          '🏷️ *SETOFERTA*\n\n' +
          'Escribe la oferta que quieres configurar.\n\n' +
          'Ejemplo:\n' +
          '/setoferta 20% de descuento'
        )
      }

      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas) db.ventas = {}

      db.ventas.oferta = args.join(' ').trim()

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      return enviar(
        `✅ *Oferta configurada correctamente.*\n\n` +
        `🏷️ ${db.ventas.oferta}`
      )
    } catch (error) {
      console.error('Error en /setoferta:', error)
      return enviar('❌ No se pudo configurar la oferta.')
    }
  }
}
