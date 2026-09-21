import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'delchar',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.sender || m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (!Array.isArray(user.personajes) || user.personajes.length === 0) {
      return enviar('🎴 No tienes personajes para eliminar.')
    }

    const numero = Number(args[0])

    if (!Number.isInteger(numero) || numero < 1 || numero > user.personajes.length) {
      return enviar(`❌ Indica el número del personaje.\n\nEjemplo: /delchar 1\n\nUsa /harem para ver tu colección.`)
    }

    const eliminado = user.personajes.splice(numero - 1, 1)[0]

    db.users[jid] = user
    saveDB(db)

    await enviar(
      `🗑️ *PERSONAJE ELIMINADO*\n\n` +
      `⭐ ${eliminado.nombre}\n` +
      `📦 Personajes restantes: ${user.personajes.length}`
    )
  }
}
