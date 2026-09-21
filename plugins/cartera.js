import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'cartera',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid

    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') {
      user.coins = 0
      saveDB(db)
    }

    await enviar(
      `💰 *CARTERA DE LEVIBOT*\n\n` +
      `👤 Usuario: @${jid.split('@')[0]}\n` +
      `💵 Saldo: *${user.coins} monedas*`,
      { mentions: [jid] }
    )
  }
}
