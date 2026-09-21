import { OWNER_NUMBER } from '../config.js'
import { getDB, saveDB } from '../database.js'

export default {
  name: 'resetniveles',

  async execute(sock, m, args, enviar) {
    const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''

    const numero = sender
      .split('@')[0]
      .replace(/\D/g, '')

    if (!numero.endsWith(OWNER_NUMBER)) {
      return enviar(
        '❌ *ACCESO DENEGADO*\n\n' +
        'Este comando es exclusivo del OWNER de LeviBot.'
      )
    }

    const db = getDB()

    if (!db.users || Object.keys(db.users).length === 0) {
      return enviar(
        'ℹ️ *NIVELES*\n\n' +
        'No hay usuarios registrados para reiniciar.'
      )
    }

    let cantidad = 0

    for (const jid of Object.keys(db.users)) {
      const usuario = db.users[jid]

      usuario.level = 0
      usuario.nivel = 0
      usuario.exp = 0
      usuario.xp = 0

      cantidad++
    }

    saveDB(db)

    return enviar(
      '♻️ *NIVELES REINICIADOS*\n\n' +
      `👤 Usuarios afectados: *${cantidad}*\n\n` +
      'Los niveles y la experiencia fueron reiniciados.'
    )
  }
}
