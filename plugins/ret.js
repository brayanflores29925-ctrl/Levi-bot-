import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'ret',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') user.coins = 0
    if (typeof user.bank !== 'number') user.bank = 0

    const cantidad = Number(args[0])

    if (!cantidad || cantidad <= 0 || !Number.isInteger(cantidad)) {
      return enviar('🏦 Uso correcto: /ret <cantidad>\n\nEjemplo: /ret 100')
    }

    if (cantidad > user.bank) {
      return enviar(`❌ No tienes suficientes monedas en el banco.\n🏦 Tienes: ${user.bank}`)
    }

    user.bank -= cantidad
    user.coins += cantidad

    saveDB(db)

    await enviar(
      `💵 *RETIRO REALIZADO*\n\n` +
      `💰 Retirado: *${cantidad} monedas*\n` +
      `💵 Cartera: *${user.coins}*\n` +
      `🏦 Banco: *${user.bank}*`
    )
  }
}
