import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'work',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') user.coins = 0
    if (!user.work) user.work = 0

    const ahora = Date.now()
    const espera = 60 * 60 * 1000

    if (ahora - user.work < espera) {
      const restante = espera - (ahora - user.work)
      const minutos = Math.ceil(restante / 60000)

      return enviar(
        `⏳ Ya trabajaste recientemente.\n\n` +
        `🕐 Puedes volver a trabajar en *${minutos} minutos*.`
      )
    }

    const recompensa = Math.floor(Math.random() * 501) + 500

    user.coins += recompensa
    user.work = ahora

    saveDB(db)

    await enviar(
      `💼 *TRABAJO COMPLETADO*\n\n` +
      `💰 Ganaste: *${recompensa} monedas*\n` +
      `💵 Tu saldo: *${user.coins} monedas*`
    )
  }
}
