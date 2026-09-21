import { getDB, getUser } from '../database.js'

export default {
  name: 'wtop',

  async execute(sock, m, args, enviar) {
    const db = getDB()

    const usuarios = Object.entries(db.users || {})
      .map(([jid, data]) => ({
        jid,
        cantidad: Array.isArray(data.personajes)
          ? data.personajes.length
          : 0
      }))
      .filter(user => user.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10)

    if (usuarios.length === 0) {
      return enviar('🎴 Todavía no hay usuarios con personajes.')
    }

    let texto = '🏆 *TOP GACHA - LEVIBOT*\n\n'

    usuarios.forEach((user, index) => {
      const numero = user.jid.split('@')[0]
      texto += `${index + 1}. @${numero} — ⭐ ${user.cantidad} personajes\n`
    })

    await enviar(texto, {
      mentions: usuarios.map(user => user.jid)
    })
  }
}
