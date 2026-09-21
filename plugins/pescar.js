import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'pescar',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') user.coins = 0

    const encontrado = Math.random() < 0.8

    if (!encontrado) {
      return enviar('🎣 Lanzaste la caña...\n\n😅 No pescaste nada esta vez.')
    }

    const recompensa = Math.floor(Math.random() * 301) + 100

    user.coins += recompensa
    saveDB(db)

    await enviar(
      `🎣 *PESCA COMPLETADA*\n\n` +
      `🐟 Encontraste una recompensa.\n` +
      `💰 Ganaste: *${recompensa} monedas*\n` +
      `💵 Saldo: *${user.coins} monedas*`
    )
  }
}
