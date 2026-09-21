import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'sell',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.sender || m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (!Array.isArray(user.personajes) || user.personajes.length === 0) {
      return enviar('🎴 No tienes personajes para vender.')
    }

    const numero = Number(args[0])

    if (!Number.isInteger(numero) || numero < 1 || numero > user.personajes.length) {
      return enviar('❌ Indica el número del personaje.\n\nEjemplo: /sell 1\n\nUsa /harem para ver tu colección.')
    }

    const personaje = user.personajes.splice(numero - 1, 1)[0]
    const recompensa = 250

    user.coins = Number(user.coins) || 0
    user.coins += recompensa

    db.users[jid] = user
    saveDB(db)

    await enviar(
      `💰 *PERSONAJE VENDIDO*\n\n` +
      `⭐ ${personaje.nombre}\n` +
      `🪙 Recibiste: ${recompensa} monedas\n` +
      `💵 Saldo: ${user.coins} monedas`
    )
  }
}
