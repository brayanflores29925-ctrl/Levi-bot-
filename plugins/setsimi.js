import { OWNER_NUMBER } from '../config.js'
import { getDB, saveDB } from '../database.js'

export default {
  name: 'setsimi',

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

    const opcion = (args[0] || '').toLowerCase()
    const db = getDB()

    if (!db.config) db.config = {}
    if (!db.config.simi) db.config.simi = { activo: true }

    if (!opcion) {
      return enviar(
        '🤖 *CONFIGURACIÓN DE SIMISIMI*\n\n' +
        `📊 Estado: *${db.config.simi.activo ? 'ACTIVADO' : 'DESACTIVADO'}*\n\n` +
        '📌 *Uso:*\n' +
        '/setsimi on — Activar SimSimi\n' +
        '/setsimi off — Desactivar SimSimi\n' +
        '/setsimi estado — Ver estado'
      )
    }

    if (opcion === 'on') {
      db.config.simi.activo = true
      saveDB(db)

      return enviar('🤖✅ *SIMISIMI ACTIVADO*')
    }

    if (opcion === 'off') {
      db.config.simi.activo = false
      saveDB(db)

      return enviar('🤖❌ *SIMISIMI DESACTIVADO*')
    }

    if (opcion === 'estado') {
      return enviar(
        '🤖 *ESTADO DE SIMISIMI*\n\n' +
        `📊 Estado: *${db.config.simi.activo ? 'ACTIVADO ✅' : 'DESACTIVADO ❌'}*`
      )
    }

    return enviar(
      '❌ *OPCIÓN INVÁLIDA*\n\n' +
      'Usa:\n' +
      '/setsimi on\n' +
      '/setsimi off\n' +
      '/setsimi estado'
    )
  }
}
