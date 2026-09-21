import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'casino',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (typeof user.coins !== 'number') user.coins = 0

    const apuesta = Number(args[0])

    if (!apuesta || apuesta <= 0 || !Number.isInteger(apuesta)) {
      return enviar('🎰 Uso: /casino <cantidad>\n\nEjemplo: /casino 100')
    }

    if (apuesta > user.coins) {
      return enviar(`❌ No tienes suficientes monedas.\n💰 Saldo: ${user.coins}`)
    }

    const resultado = Math.floor(Math.random() * 3)

    if (resultado === 0) {
      user.coins -= apuesta
      saveDB(db)

      return enviar(
        `🎰 *CASINO*\n\n` +
        `😅 No hubo suerte esta vez.\n` +
        `💸 Perdiste: *${apuesta} monedas*\n` +
        `💰 Saldo: *${user.coins}*`
      )
    }

    if (resultado === 1) {
      saveDB(db)

      return enviar(
        `🎰 *CASINO*\n\n` +
        `😮 Empate.\n` +
        `💰 Conservaste tu apuesta de *${apuesta} monedas*.\n` +
        `💵 Saldo: *${user.coins}*`
      )
    }

    user.coins += apuesta
    saveDB(db)

    await enviar(
      `🎰 *CASINO*\n\n` +
      `🎉 ¡Ganaste!\n` +
      `💰 Premio: *${apuesta} monedas*\n` +
      `💵 Saldo: *${user.coins}*`
    )
  }
}
