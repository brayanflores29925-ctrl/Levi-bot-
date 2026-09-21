import { getDB, getUser, saveDB } from '../database.js'

const personajes = [
  { nombre: 'Shakira', precio: 500 },
  { nombre: 'Karol G', precio: 1000 },
  { nombre: 'Goku', precio: 1500 },
  { nombre: 'Naruto', precio: 1500 },
  { nombre: 'Luffy', precio: 2000 }
]

export default {
  name: 'buyc',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const jid = m.sender || m.key?.participant || m.key?.remoteJid
    const user = getUser(db, jid)

    user.coins = Number(user.coins) || 0
    if (!Array.isArray(user.personajes)) user.personajes = []

    const numero = Number(args[0])

    if (!Number.isInteger(numero) || numero < 1 || numero > personajes.length) {
      let lista = '🛒 *PERSONAJES DISPONIBLES*\n\n'
      personajes.forEach((p, i) => {
        lista += `${i + 1}. ⭐ ${p.nombre} — ${p.precio} 🪙\n`
      })
      lista += '\n📌 Ejemplo: /buyc 1'
      return enviar(lista)
    }

    const personaje = personajes[numero - 1]

    if (user.coins < personaje.precio) {
      return enviar(
        `❌ No tienes suficientes monedas.\n\n` +
        `💰 Necesitas: ${personaje.precio} 🪙\n` +
        `💵 Tienes: ${user.coins} 🪙`
      )
    }

    user.coins -= personaje.precio
    user.personajes.push({
      nombre: personaje.nombre,
      fecha: Date.now()
    })

    db.users[jid] = user
    saveDB(db)

    await enviar(
      `🛒 *COMPRA EXITOSA*\n\n` +
      `⭐ ${personaje.nombre}\n` +
      `💸 Pagaste: ${personaje.precio} 🪙\n` +
      `💰 Saldo: ${user.coins} 🪙`
    )
  }
}
