import { OWNER_NUMBER } from '../config.js'
import { getDB, saveDB } from '../database.js'

export default {
  name: 'resetperfiles',

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
        'ℹ️ *PERFILES*\n\n' +
        'No hay perfiles registrados para reiniciar.'
      )
    }

    let cantidad = 0

    for (const jid of Object.keys(db.users)) {
      db.users[jid] = {
        registrado: false,
        nombre: 'Sin registrar',
        edad: 'N/A',
        apellido: '',
        desc: 'Sin descripción',
        genero: 'No especificado',
        cumple: 'No configurado',
        pareja: null
      }

      cantidad++
    }

    saveDB(db)

    return enviar(
      '♻️ *PERFILES REINICIADOS*\n\n' +
      `👤 Perfiles afectados: *${cantidad}*\n\n` +
      'Todos los perfiles fueron restablecidos a sus valores iniciales.'
    )
  }
}
