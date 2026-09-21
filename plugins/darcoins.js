import { OWNER_NUMBER } from '../config.js'
import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'darcoins',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''

    const numero = sender
      .split('@')[0]
      .replace(/\D/g, '')

    if (!numero.endsWith(OWNER_NUMBER)) {
      return enviar('❌ *ACCESO DENEGADO*\n\nEste comando es exclusivo del OWNER de LeviBot.')
    }

    const mencionado =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return enviar(
        '💰 *DAR MONEDAS*\n\n' +
        'Debes mencionar al usuario y escribir la cantidad.\n\n' +
        'Ejemplo:\n' +
        '/darcoins @usuario 100'
      )
    }

    const cantidad = Number(args[0])

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return enviar(
        '❌ *CANTIDAD INVÁLIDA*\n\n' +
        'La cantidad debe ser un número entero mayor que 0.\n\n' +
        'Ejemplo:\n' +
        '/darcoins @usuario 100'
      )
    }

    const db = getDB()
    const usuario = getUser(db, mencionado)

    if (typeof usuario.coins !== 'number') {
      usuario.coins = 0
    }

    usuario.coins += cantidad
    saveDB(db)

    await enviar(
      '✅ *MONEDAS ENTREGADAS*\n\n' +
      `👤 Usuario: @${mencionado.split('@')[0]}\n` +
      `💰 Cantidad: *${cantidad} monedas*\n` +
      `💵 Nuevo saldo: *${usuario.coins} monedas*`,
      { mentions: [mencionado] }
    )
  }
}
