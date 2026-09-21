import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'daily',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') user.coins = 0
    if (!user.daily) user.daily = 0

    const ahora = Date.now()
    const espera = 24 * 60 * 60 * 1000

    if (ahora - user.daily < espera) {
      const restante = espera - (ahora - user.daily)
      const horas = Math.floor(restante / 3600000)
      const minutos = Math.floor((restante % 3600000) / 60000)

      return enviar(
        `⏳ Ya reclamaste tu recompensa diaria.\n\n` +
        `🕐 Vuelve en: *${horas}h ${minutos}m*`
      )
    }

    const recompensa = 500

    user.coins += recompensa
    user.daily = ahora

    saveDB(db)

    await enviar(
      `🎁 *RECOMPENSA DIARIA*\n\n` +
      `💰 Recibiste: *${recompensa} monedas*\n` +
      `💵 Tu saldo: *${user.coins} monedas*`
    )
  }
}
