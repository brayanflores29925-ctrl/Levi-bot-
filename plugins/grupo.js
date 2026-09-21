export default {
  name: 'Grupo',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    try {
      const metadata = await sock.groupMetadata(chatId)

      const nombre = metadata.subject || 'Sin nombre'
      const descripcion = metadata.desc || 'Sin descripción'
      const cantidad = metadata.participants?.length || 0
      const creador = metadata.owner
        ? `@${metadata.owner.split('@')[0]}`
        : 'No disponible'

      await sock.sendMessage(chatId, {
        text:
          `╭━━〔 👥 INFORMACIÓN DEL GRUPO 〕━━╮\n\n` +
          `📌 *Nombre:* ${nombre}\n` +
          `👥 *Miembros:* ${cantidad}\n` +
          `👑 *Creador:* ${creador}\n` +
          `📝 *Descripción:* ${descripcion}\n\n` +
          `╰━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: metadata.owner ? [metadata.owner] : []
      })
    } catch {
      await sock.sendMessage(chatId, {
        text: '❌ No pude obtener la información del grupo.'
      })
    }
  }
}
