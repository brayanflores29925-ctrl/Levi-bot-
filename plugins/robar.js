import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'robar',

  async execute(sock, m, args, enviar) {
    const db = getDB()

    const ladron = m.key?.participant || m.key?.remoteJid
    const victima = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!victima) {
      return enviar('🕵️ Menciona al usuario que quieres desafiar.\n\nEjemplo: /robar @usuario')
    }

    if (ladron === victima) {
      return enviar('❌ No puedes usar este comando contigo mismo.')
    }

    const usuario = getUser(db, ladron)
    const objetivo = getUser(db, victima)

    if (typeof usuario.coins !== 'number') usuario.coins = 0
    if (typeof objetivo.coins !== 'number') objetivo.coins = 0

    if (objetivo.coins <= 0) {
      return enviar('❌ Ese usuario no tiene monedas para este juego.')
    }

    const exito = Math.random() < 0.5

    if (exito) {
      const cantidad = Math.max(
        1,
        Math.floor(objetivo.coins * (Math.random() * 0.21 + 0.10))
      )

      objetivo.coins -= cantidad
      usuario.coins += cantidad

      saveDB(db)

      return enviar(
        `🕵️ *ROBO FICTICIO EXITOSO*\n\n` +
        `👤 Jugador: @${ladron.split('@')[0]}\n` +
        `🎯 Objetivo: @${victima.split('@')[0]}\n` +
        `💰 Ganancia: *${cantidad} monedas*\n` +
        `💵 Tu saldo: *${usuario.coins}*`,
        { mentions: [ladron, victima] }
      )
    }

    const multa = Math.min(
      usuario.coins,
      Math.floor(Math.random() * 201) + 50
    )

    usuario.coins -= multa

    saveDB(db)

    await enviar(
      `🚨 *ROBO FICTICIO FALLIDO*\n\n` +
      `👤 @${ladron.split('@')[0]} fue descubierto.\n` +
      `💸 Multa: *${multa} monedas*\n` +
      `💰 Saldo: *${usuario.coins}*`,
      { mentions: [ladron] }
    )
  }
}
