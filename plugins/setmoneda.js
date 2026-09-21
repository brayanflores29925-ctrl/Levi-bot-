import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'setmoneda',

  async execute(sock, m, parts, enviar) {
    const moneda = parts.join(' ').trim()

    if (!moneda) {
      return enviar(
        '💰 *SETMONEDA*\n\n' +
        'Escribe la moneda de la tienda.\n\n' +
        'Ejemplos:\n' +
        '/setmoneda L\n' +
        '/setmoneda USD\n' +
        '/setmoneda EUR'
      )
    }

    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas) {
        return enviar('❌ Primero activa el sistema con /setup.')
      }

      db.ventas.tienda.moneda = moneda.toUpperCase()
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      await enviar(
        `✅ *MONEDA ACTUALIZADA*\n\n` +
        `💰 Nueva moneda: *${moneda.toUpperCase()}*`
      )
    } catch (error) {
      console.error('Error en /setmoneda:', error)
      await enviar('❌ No se pudo cambiar la moneda.')
    }
  }
}
