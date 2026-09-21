import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')
const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'totalventas',

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

      const ventas = Array.isArray(db.ventas.ventas)
        ? db.ventas.ventas.filter(v => v.tipo !== 'recarga')
        : []

      const moneda = db.ventas.tienda?.moneda || 'L'

      const totalDinero = ventas.reduce(
        (total, venta) => total + Number(venta.total || 0),
        0
      )

      const totalUnidades = ventas.reduce(
        (total, venta) => total + Number(venta.cantidad || 0),
        0
      )

      await enviar(
        '📊 *TOTAL DE VENTAS*\n\n' +
        `🏪 Tienda: *${db.ventas.tienda?.nombre || 'Mi Tienda'}*\n\n` +
        `💰 Dinero vendido: *${moneda} ${totalDinero}*\n` +
        `📦 Unidades vendidas: *${totalUnidades}*\n` +
        `🧾 Operaciones: *${ventas.length}*\n\n` +
        '✅ Datos actualizados.'
      )
    } catch (error) {
      console.error('Error en /totalventas:', error)
      await enviar('❌ No se pudieron obtener las ventas.')
    }
  }
}
