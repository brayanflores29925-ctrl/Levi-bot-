import { getDB, getUser } from '../database.js'

export default {
  name: 'vernivel',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const mencionado = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return enviar('⭐ Menciona a un usuario para ver su nivel.\n\nEjemplo: /vernivel @usuario')
    }

    const user = getUser(db, mencionado)
    const nivel = Number(user.nivel) || 0
    const xp = Number(user.xp) || 0
    const nombre = user.nombre || mencionado.split('@')[0]

    await enviar(
      `⭐ *NIVEL DEL USUARIO*\n\n` +
      `👤 Nombre: ${nombre}\n` +
      `🏆 Nivel: ${nivel}\n` +
      `✨ XP: ${xp}`
    )
  }
}
