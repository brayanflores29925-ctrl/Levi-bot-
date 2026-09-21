import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'regalar',

  async execute(sock, m, args, enviar) {
    const db = getDB()
    const sender = m.key?.participant || m.key?.remoteJid

    const mencionado = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return enviar('🎁 Debes mencionar a la persona.\n\nEjemplo: /regalar @usuario 100')
    }

    const cantidad = Number(args[0])

    if (!cantidad || cantidad <= 0 || !Number.isInteger(cantidad)) {
      return enviar('❌ Indica una cantidad válida.\n\nEjemplo: /regalar @usuario 100')
    }

    if (sender === mencionado) {
      return enviar('❌ No puedes regalarte monedas a ti mismo.')
    }

    const usuario = getUser(db, sender)
    const receptor = getUser(db, mencionado)

    if (typeof usuario.coins !== 'number') usuario.coins = 0
    if (typeof receptor.coins !== 'number') receptor.coins = 0

    if (usuario.coins < cantidad) {
      return enviar(`❌ No tienes suficientes monedas.\n💰 Tu saldo: ${usuario.coins}`)
    }

    usuario.coins -= cantidad
    receptor.coins += cantidad

    saveDB(db)

    await enviar(
      `🎁 *REGALO REALIZADO*\n\n` +
      `👤 De: @${sender.split('@')[0]}\n` +
      `🎁 Cantidad: *${cantidad} monedas*\n` +
      `👤 Para: @${mencionado.split('@')[0]}\n\n` +
      `💰 Tu nuevo saldo: *${usuario.coins}*`,
      { mentions: [sender, mencionado] }
    )
  }
}
