import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'trade',

  async execute(sock, m, args, enviar) {
    const db = getDB()

    const sender =
      m.sender ||
      m.key?.participant ||
      m.key?.remoteJid

    const mencionado =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return enviar('❌ Menciona al usuario con quien quieres intercambiar.')
    }

    if (sender === mencionado) {
      return enviar('❌ No puedes intercambiar contigo mismo.')
    }

    const numero = Number(args[0])
    const otroNumero = Number(args[1])

    const user = getUser(db, sender)
    const receptor = getUser(db, mencionado)

    if (!Array.isArray(user.personajes) || user.personajes.length === 0) {
      return enviar('🎴 No tienes personajes para intercambiar.')
    }

    if (!Array.isArray(receptor.personajes) || receptor.personajes.length === 0) {
      return enviar('🎴 El otro usuario no tiene personajes para intercambiar.')
    }

    if (
      !Number.isInteger(numero) ||
      numero < 1 ||
      numero > user.personajes.length ||
      !Number.isInteger(otroNumero) ||
      otroNumero < 1 ||
      otroNumero > receptor.personajes.length
    ) {
      return enviar(
        '❌ Indica los números de ambos personajes.\n\n' +
        'Ejemplo: /trade 1 2 @usuario\n\n' +
        'Usa /harem para ver tus personajes.'
      )
    }

    const personaje1 = user.personajes[numero - 1]
    const personaje2 = receptor.personajes[otroNumero - 1]

    user.personajes[numero - 1] = personaje2
    receptor.personajes[otroNumero - 1] = personaje1

    db.users[sender] = user
    db.users[mencionado] = receptor

    saveDB(db)

    await enviar(
      `🔄 *INTERCAMBIO COMPLETADO*\n\n` +
      `⭐ Tú recibiste: ${personaje2.nombre}\n` +
      `⭐ El otro usuario recibió: ${personaje1.nombre}`
    )
  }
}
