import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'autoferta',

  async execute(sock, m, args, enviar) {
    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas) db.ventas = {}

      const opcion = String(args?.[0] || '').toLowerCase()

      if (!['on', 'off'].includes(opcion)) {
        return enviar(
          '🤖 *AUTOFERTA*\n\n' +
          'Usa una de estas opciones:\n\n' +
          '✅ /autoferta on — Activar\n' +
          '❌ /autoferta off — Desactivar'
        )
      }

      db.ventas.autoferta = opcion === 'on'
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      return enviar(
        opcion === 'on'
          ? '✅ *Ofertas automáticas activadas.*'
          : '❌ *Ofertas automáticas desactivadas.*'
      )
    } catch (error) {
      console.error('Error en /autoferta:', error)
      return enviar('❌ No se pudo configurar la oferta automática.')
    }
  }
}
