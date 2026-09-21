import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'dep',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') user.coins = 0
    if (typeof user.bank !== 'number') user.bank = 0

    const cantidad = Number(args[0])

    if (!cantidad || cantidad <= 0 || !Number.isInteger(cantidad)) {
      return enviar('🏦 Uso correcto: /dep <cantidad>\n\nEjemplo: /dep 100')
    }

    if (cantidad > user.coins) {
      return enviar(`❌ No tienes suficientes monedas.\n💰 Tienes: ${user.coins}`)
    }

    user.coins -= cantidad
    user.bank += cantidad

    saveDB(db)

    await enviar(
      `🏦 *DEPÓSITO REALIZADO*\n\n` +
      `💵 Depositado: *${cantidad} monedas*\n` +
      `💰 Cartera: *${user.coins}*\n` +
      `🏦 Banco: *${user.bank}*`
    )
  }
}
