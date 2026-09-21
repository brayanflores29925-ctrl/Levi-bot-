import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'givechar',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const sender = m.sender || m.key?.participant || m.key?.remoteJid
    const mencionado = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return enviar('❌ Menciona al usuario que recibirá el personaje.\n\nEjemplo: /givechar 1 @usuario')
    }

    const user = getUser(db, sender)
    const receptor = getUser(db, mencionado)

    if (!Array.isArray(user.personajes) || user.personajes.length === 0) {
      return enviar('🎴 No tienes personajes para regalar.')
    }

    const numero = Number(args[0])

    if (!Number.isInteger(numero) || numero < 1 || numero > user.personajes.length) {
      return enviar('❌ Indica el número del personaje.\n\nUsa /harem para ver tu colección.')
    }

    if (!Array.isArray(receptor.personajes)) receptor.personajes = []

    const personaje = user.personajes.splice(numero - 1, 1)[0]

    receptor.personajes.push({
      nombre: personaje.nombre,
      fecha: Date.now()
    })

    db.users[sender] = user
    db.users[mencionado] = receptor
    saveDB(db)

    await enviar(
      `🎁 *PERSONAJE REGALADO*\n\n` +
      `⭐ ${personaje.nombre}\n` +
      `👤 Regalo enviado correctamente.`
    )
  }
}
