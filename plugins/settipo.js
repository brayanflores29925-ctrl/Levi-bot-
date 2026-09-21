import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'settipo',

  async execute(sock, m, parts, enviar) {
    const tipo = parts.join(' ').trim()

    if (!tipo) {
      return enviar(
        '🏷️ *SETTIPO*\n\n' +
        'Escribe el tipo de tienda.\n\n' +
        'Ejemplos:\n' +
        '/settipo General\n' +
        '/settipo Ropa\n' +
        '/settipo Comida\n' +
        '/settipo Digital'
      )
    }

    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas) {
        return enviar('❌ Primero activa el sistema con /setup.')
      }

      db.ventas.tienda.tipo = tipo
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      await enviar(
        `✅ *TIPO DE TIENDA ACTUALIZADO*\n\n` +
        `🏷️ Tipo: *${tipo}*`
      )
    } catch (error) {
      console.error('Error en /settipo:', error)
      await enviar('❌ No se pudo cambiar el tipo de tienda.')
    }
  }
}
