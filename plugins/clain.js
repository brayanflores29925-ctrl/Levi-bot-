import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'clain',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.sender || m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    if (!Array.isArray(user.personajes)) user.personajes = []

    const recompensa = ['Shakira', 'Karol G', 'Goku', 'Naruto', 'Luffy']
    const personaje = recompensa[Math.floor(Math.random() * recompensa.length)]

    user.personajes.push({
      nombre: personaje,
      fecha: Date.now()
    })

    db.users[jid] = user
    saveDB(db)

    await enviar(
      `🎁 *RECOMPENSA GACHA*\n\n` +
      `🎉 Has reclamado tu recompensa.\n\n` +
      `⭐ *${personaje}*\n\n` +
      `📦 Total de personajes: ${user.personajes.length}`
    )
  }
}
