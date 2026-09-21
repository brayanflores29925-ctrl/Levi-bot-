import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'giveall',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const sender = m.sender || m.key?.participant || m.key?.remoteJid
    const mencionado = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return enviar('❌ Menciona al usuario que recibirá tus personajes.\n\nEjemplo: /giveall @usuario')
    }

    if (sender === mencionado) {
      return enviar('❌ No puedes regalarte tus propios personajes.')
    }

    const user = getUser(db, sender)
    const receptor = getUser(db, mencionado)

    if (!Array.isArray(user.personajes) || user.personajes.length === 0) {
      return enviar('🎴 No tienes personajes para regalar.')
    }

    if (!Array.isArray(receptor.personajes)) receptor.personajes = []

    const cantidad = user.personajes.length

    receptor.personajes.push(...user.personajes)
    user.personajes = []

    db.users[sender] = user
    db.users[mencionado] = receptor
    saveDB(db)

    await enviar(
      `🎁 *PERSONAJES REGALADOS*\n\n` +
      `📦 Cantidad enviada: ${cantidad}\n` +
      `👤 El usuario recibió todos tus personajes.`
    )
  }
}
