import { getDB, getUser } from '../database.js'

export default {
  name: 'ranknivel',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const usuarios = Object.entries(db.users || {})

    if (!usuarios.length) {
      return enviar('📊 No hay usuarios registrados todavía.')
    }

    const ranking = usuarios
      .map(([jid, user]) => ({
        jid,
        nombre: user.nombre || jid.split('@')[0],
        nivel: Number(user.nivel) || 0,
        xp: Number(user.xp) || 0
      }))
      .sort((a, b) => b.nivel - a.nivel || b.xp - a.xp)
      .slice(0, 10)

    let texto = '🏆 *RANKING DE NIVELES*\n\n'

    ranking.forEach((u, i) => {
      texto += `${i + 1}. ${u.nombre}\n`
      texto += `   ⭐ Nivel: ${u.nivel} | XP: ${u.xp}\n\n`
    })

    await enviar(texto)
  }
}
