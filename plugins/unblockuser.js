import { getDB, saveDB } from '../database.js'

export default {
  name: 'unblockuser',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ *Este comando solo funciona en grupos.*')
    }

    const metadata = await sock.groupMetadata(chatId)
    const participante = metadata.participants.find(p => p.id === sender)

    const esAdmin =
      participante?.admin === 'admin' ||
      participante?.admin === 'superadmin'

    if (!esAdmin) {
      return enviar(
        '❌ *ACCESO DENEGADO*\n\n' +
        'Solo los administradores pueden usar /unblockuser.'
      )
    }

    const mencionado =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!mencionado) {
      return enviar(
        '🔓 *DESBLOQUEAR USUARIO*\n\n' +
        'Debes mencionar al usuario que deseas desbloquear.\n\n' +
        'Ejemplo:\n' +
        '/unblockuser @usuario'
      )
    }

    const db = getDB()

    if (!db.blockedUsers) {
      db.blockedUsers = {}
    }

    if (!db.blockedUsers[mencionado]) {
      return enviar(
        'ℹ️ *USUARIO NO BLOQUEADO*\n\n' +
        `👤 Usuario: @${mencionado.split('@')[0]}\n\n` +
        'Este usuario no aparece en la lista de bloqueados.',
        { mentions: [mencionado] }
      )
    }

    delete db.blockedUsers[mencionado]
    saveDB(db)

    return enviar(
      '✅ *USUARIO DESBLOQUEADO*\n\n' +
      `👤 Usuario: @${mencionado.split('@')[0]}\n\n` +
      'El usuario ha sido desbloqueado de LeviBot.',
      { mentions: [mencionado] }
    )
  }
}
