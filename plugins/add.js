export default {
  name: 'add',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    const numero = parts.join('').replace(/\D/g, '')

    if (!numero) {
      return enviar(
        '➕ *ADD*\n\n' +
        'Escribe el número que quieres agregar.\n\n' +
        'Ejemplo:\n' +
        '/add 50499999999'
      )
    }

    try {
      await sock.groupParticipantsUpdate(
        chatId,
        [`${numero}@s.whatsapp.net`],
        'add'
      )

      await enviar(`✅ Solicitud para agregar a +${numero} enviada.`)
    } catch (error) {
      console.error('Error en /add:', error)
      await enviar('❌ No se pudo agregar ese número.')
    }
  }
}
