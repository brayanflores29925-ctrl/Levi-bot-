import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'infoventas',

  async execute(sock, m, parts, enviar) {
    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas?.configuracion?.activa) {
        return enviar(
          '❌ *SISTEMA DE VENTAS*\n\n' +
          'La tienda no está activa.\n' +
          'Usa /setup para activarla.'
        )
      }

      const tienda = db.ventas.tienda || {}
      const productos = Object.keys(db.ventas.productos || {}).length
      const moneda = tienda.moneda || 'L'

      await enviar(
        '🛒 *INFORMACIÓN DE VENTAS*\n\n' +
        `🏪 Tienda: *${tienda.nombre || 'Mi Tienda'}*\n` +
        `💰 Moneda: *${moneda}*\n` +
        `🏷️ Tipo: *${tienda.tipo || 'general'}*\n` +
        `📦 Productos registrados: *${productos}*\n` +
        '🟢 Estado: *ACTIVA*\n\n' +
        '📋 *COMANDOS PRINCIPALES*\n\n' +
        '⚙️ /setup — Activar tienda\n' +
        '📝 /setnombre — Cambiar nombre\n' +
        '💰 /setmoneda — Cambiar moneda\n' +
        '🏷️ /settipo — Cambiar tipo\n' +
        '🖼️ /setimgtienda — Imagen de tienda\n' +
        '🏪 /tienda — Ver productos\n' +
        '💳 /recargar — Recargar saldo\n' +
        '✅ /confirmar — Confirmar operación\n' +
        '📦 /addproducto — Agregar producto\n' +
        '🗑️ /delproducto — Eliminar producto\n' +
        '✏️ /editarproducto — Editar producto\n' +
        '🛒 /comprar — Comprar producto\n' +
        '🧾 /miscompras — Ver compras\n' +
        '📊 /totalventas — Total de ventas\n' +
        '🏆 /topcompradores — Ranking\n' +
        '⚠️ /pocostock — Poco stock\n' +
        '📈 /estadisticas — Estadísticas'
      )
    } catch (error) {
      console.error('Error en /infoventas:', error)
      await enviar('❌ No se pudo mostrar la información de ventas.')
    }
  }
}
