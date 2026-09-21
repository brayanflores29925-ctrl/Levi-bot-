import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')
const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'topcompradores',

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

      const compras = Array.isArray(db.ventas.compras)
        ? db.ventas.compras.filter(c => c.tipo !== 'recarga')
        : []

      const moneda = db.ventas.tienda?.moneda || 'L'

      if (compras.length === 0) {
        return enviar('🏆 *TOP COMPRADORES*\n\n📭 Todavía no hay compras registradas.')
      }

      const ranking = {}

      for (const compra of compras) {
        const usuario = compra.usuario

        if (!usuario) continue

        if (!ranking[usuario]) {
          ranking[usuario] = {
            usuario,
            compras: 0,
            unidades: 0,
            gastado: 0
          }
        }

        ranking[usuario].compras += 1
        ranking[usuario].unidades += Number(compra.cantidad || 0)
        ranking[usuario].gastado += Number(compra.total || 0)
      }

      const lista = Object.values(ranking)
        .sort((a, b) => b.gastado - a.gastado)
        .slice(0, 10)

      let texto = '🏆 *TOP COMPRADORES*\n\n'

      lista.forEach((item, index) => {
        const medalla =
          index === 0 ? '🥇' :
          index === 1 ? '🥈' :
          index === 2 ? '🥉' : `${index + 1}.`

        texto +=
          `${medalla} @${item.usuario.split('@')[0]}\n` +
          `🛒 Compras: *${item.compras}*\n` +
          `📦 Unidades: *${item.unidades}*\n` +
          `💰 Gastado: *${moneda} ${item.gastado}*\n\n`
      })

      texto += '━━━━━━━━━━━━━━━━\n'
      texto += `👥 Compradores: *${lista.length}*`

      await enviar(
        texto,
        { mentions: lista.map(item => item.usuario) }
      )
    } catch (error) {
      console.error('Error en /topcompradores:', error)
      await enviar('❌ No se pudo generar el ranking.')
    }
  }
}
