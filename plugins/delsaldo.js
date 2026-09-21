import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'delsaldo',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    try {
      const metadata = await sock.groupMetadata(chatId)

      const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)

      if (!admins.includes(sender)) {
        return enviar('❌ Este comando es solo para administradores.')
      }

      const mencionado =
        m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

      const usuario = mencionado || sender

      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas?.configuracion?.activa) {
        return enviar('❌ Primero activa la tienda con /setup.')
      }

      if (!db.ventas.saldos) {
        db.ventas.saldos = {}
      }

      const saldoAnterior = Number(db.ventas.saldos[usuario] || 0)

      db.ventas.saldos[usuario] = 0

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      const moneda = db.ventas.tienda?.moneda || 'L'

      await enviar(
        `🗑️ *SALDO ELIMINADO*\n\n` +
        `👤 Usuario: @${usuario.split('@')[0]}\n` +
        `💰 Saldo eliminado: *${moneda} ${saldoAnterior}*`,
        { mentions: [usuario] }
      )
    } catch (error) {
      console.error('Error en /delsaldo:', error)
      await enviar('❌ No se pudo eliminar el saldo.')
    }
  }
}
