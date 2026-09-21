import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

function cargar() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

function guardar(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export default {
  name: 'setup',

  async execute(sock, m, parts, enviar) {
    try {
      const db = cargar()

      if (!db.ventas) {
        db.ventas = {
          tienda: {
            nombre: 'Mi Tienda',
            moneda: 'L',
            tipo: 'general',
            imagen: ''
          },
          productos: {},
          saldos: {},
          compras: [],
          ventas: [],
          configuracion: {
            activa: false
          }
        }
      }

      db.ventas.configuracion.activa = true
      guardar(db)

      await enviar(
        '✅ *SISTEMA DE VENTAS ACTIVADO*\n\n' +
        '🏪 Tienda: *Mi Tienda*\n' +
        '💰 Moneda: *L*\n' +
        '🏷️ Tipo: *general*\n\n' +
        'Ahora puedes configurar tu tienda con:\n' +
        '📝 /setnombre\n' +
        '💰 /setmoneda\n' +
        '🏷️ /settipo\n' +
        '🖼️ /setimgtienda'
      )
    } catch (error) {
      console.error('Error en /setup:', error)
      await enviar('❌ No se pudo configurar el sistema de ventas.')
    }
  }
}
