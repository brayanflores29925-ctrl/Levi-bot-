export default {
  name: 'infogp',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    try {
      const metadata = await sock.groupMetadata(chatId)

      const nombre = metadata.subject || 'Sin nombre'
      const miembros = metadata.participants?.length || 0
      const descripcion = metadata.desc || 'Sin descripción'
      const creador = metadata.owner
        ? `@${metadata.owner.split('@')[0]}`
        : 'No disponible'

      const texto =
        `╭━━〔 ℹ️ INFORMACIÓN DEL GRUPO 〕━━╮\n\n` +
        `📛 Nombre: *${nombre}*\n` +
        `👥 Miembros: *${miembros}*\n` +
        `👑 Creador: ${creador}\n\n` +
        `📝 Descripción:\n${descripcion}\n\n` +
        `🆔 ID del grupo:\n${chatId}\n\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯`

      await sock.sendMessage(chatId, {
        text: texto,
        mentions: metadata.owner ? [metadata.owner] : []
      })
    } catch (error) {
      await sock.sendMessage(chatId, {
        text: '❌ No pude obtener la información del grupo.'
      })
    }
  }
}
