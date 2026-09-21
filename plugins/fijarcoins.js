import { OWNER_NUMBER } from '../config.js'
import { getDB, getUser, saveDB } from '../database.js'

export default {
  name: 'fijarcoins',

  async execute(sock, m, args, enviar) {
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
        '💰 *FIJAR MONEDAS*\n\n' +
        'Debes mencionar al usuario y escribir la cantidad.\n\n' +
        'Ejemplo:\n' +
        '/fijarcoins @usuario 500'
      )
    }

    const cantidad = Number(args[0])

    if (!Number.isInteger(cantidad) || cantidad < 0) {
      return enviar(
        '❌ *CANTIDAD INVÁLIDA*\n\n' +
        'La cantidad debe ser un número entero igual o mayor que 0.\n\n' +
        'Ejemplo:\n' +
        '/fijarcoins @usuario 500'
      )
    }

    const db = getDB()
    const usuario = getUser(db, mencionado)

    usuario.coins = cantidad
    saveDB(db)

    await enviar(
      '✅ *MONEDAS FIJADAS*\n\n' +
      `👤 Usuario: @${mencionado.split('@')[0]}\n` +
      `💰 Nuevo saldo: *${usuario.coins} monedas*`,
      { mentions: [mencionado] }
    )
  }
}
