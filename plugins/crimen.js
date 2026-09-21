import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'crimen',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') user.coins = 0

    const exitoso = Math.random() < 0.5

    if (exitoso) {
      const ganancia = Math.floor(Math.random() * 501) + 200
      user.coins += ganancia
      saveDB(db)

      return enviar(
        `🎭 *MISIÓN FICTICIA COMPLETADA*\n\n` +
        `💰 Ganaste: *${ganancia} monedas*\n` +
        `💵 Saldo: *${user.coins} monedas*`
      )
    }

    const perdida = Math.min(
      user.coins,
      Math.floor(Math.random() * 301) + 100
    )

    user.coins -= perdida
    saveDB(db)

    await enviar(
      `😅 *MISIÓN FICTICIA FALLIDA*\n\n` +
      `💸 Perdiste: *${perdida} monedas*\n` +
      `💵 Saldo: *${user.coins} monedas*`
    )
  }
}
