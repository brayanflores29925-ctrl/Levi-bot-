import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'minar',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') user.coins = 0

    const recompensa = Math.floor(Math.random() * 401) + 100

    user.coins += recompensa
    saveDB(db)

    await enviar(
      `⛏️ *MINERÍA COMPLETADA*\n\n` +
      `💎 Encontraste recursos valiosos.\n` +
      `💰 Ganaste: *${recompensa} monedas*\n` +
      `💵 Saldo: *${user.coins} monedas*`
    )
  }
}
