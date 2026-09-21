import { getDB, getUser } from '../database.js'

export default {
  name: 'rankcoins',

  async execute(sock, m, args, enviar) {
    const db = getDB()

    const usuarios = Object.entries(db.users || {}).map(([jid, data]) => {
      const user = getUser(db, jid)
      return {
        jid,
        nombre: user.nombre || 'Sin registrar',
        coins: typeof user.coins === 'number' ? user.coins : 0
      }
    })

    usuarios.sort((a, b) => b.coins - a.coins)

    const top = usuarios.slice(0, 10)

    if (!top.length) {
      return enviar('🏆 Todavía no hay usuarios en el ranking.')
    }

    let texto = '🏆 *RANKING DE MONEDAS* 🏆\n\n'

    top.forEach((user, index) => {
      texto += `${index + 1}. @${user.jid.split('@')[0]} — 💰 *${user.coins}*\n`
    })

    await enviar(texto, {
      mentions: top.map(user => user.jid)
    })
  }
}
