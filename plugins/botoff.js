import { OWNER_NUMBER } from '../config.js'

export default {
  name: 'botoff',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const numero = sender
      .split('@')[0]
      .replace(/\D/g, '')

    const esOwner = numero.endsWith(OWNER_NUMBER)

    let esAdmin = false

    if (chatId?.endsWith('@g.us')) {
      try {
        const metadata = await sock.groupMetadata(chatId)
        const participante = metadata.participants.find(p => p.id === sender)

        esAdmin =
          participante?.admin === 'admin' ||
          participante?.admin === 'superadmin'
      } catch {}
    }

    if (!esOwner && !esAdmin) {
      return await sock.sendMessage(chatId, {
        text: '❌ *ACCESO DENEGADO*\n\nSolo el OWNER o los administradores del grupo pueden usar /botoff.'
      })
    }

    sock.leviBotOff = true

    await sock.sendMessage(chatId, {
      text: '🔴 *LEVIBOT DESACTIVADO*\n\nEl bot dejará de procesar comandos temporalmente.\n\n🛡️ Solo el OWNER o un administrador puede volver a activarlo con /boton.'
    })
  }
}
