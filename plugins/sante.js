export default {
  name: 'sante',

  async execute(sock, m, args, enviar) {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.participant || chatId

    // 🔐 SOLO EL CREADOR
    const lidAutorizado = '257922013597821@lid'

    if (String(sender) !== lidAutorizado) {
      return
    }

    if (!chatId?.endsWith('@g.us')) {
      return enviar('⚠️ Este comando solo funciona dentro de un grupo.')
    }

    const mensaje = `╭━━━━━━━『 ⚙️ 𝗟𝗘𝗩𝗜 𝗕𝗢𝗧 𝗦𝗔𝗟𝗜𝗘𝗡𝗗𝗢 🔬 』━━━━━━━╮
┃ 💬 Grupo: *${chatId.replace('@g.us', '')}*
┃ 👨‍🔬 Acción: *Salida científica activada*
┃ 🧠 Motivo: *Orden directa del creador*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
“¡La ciencia avanza, aunque el grupo quede atrás!” 🧪`

    try {
      await sock.sendMessage(chatId, { text: mensaje })

      await new Promise(resolve => setTimeout(resolve, 1500))

      // JID del bot en formato @s.whatsapp.net
      const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net'

      if (!botJid || botJid === '@s.whatsapp.net') {
        console.log('[SANTE] No se pudo obtener el JID del bot')
        return
      }

      console.log('[SANTE] Intentando salir con:', botJid)

      await sock.groupParticipantsUpdate(
        chatId,
        [botJid],
        'remove'
      )

      console.log('[SANTE] LeviBot salió del grupo:', chatId)

    } catch (error) {
      console.log('[SANTE] Error:', error)
    }
  }
}
