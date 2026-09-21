export default {
  name: 'x9vistaunica',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage

    if (!quoted) {
      return await sock.sendMessage(chatId, {
        text:
          '❌ Debes responder a una foto o video de vista única.\n\n' +
          '👉 Responde al mensaje de vista única y escribe:\n' +
          '/x9vistaunica'
      })
    }

    const tipo =
      quoted.imageMessage ? 'foto' :
      quoted.videoMessage ? 'video' :
      null

    if (!tipo) {
      return await sock.sendMessage(chatId, {
        text: '❌ El mensaje respondido no contiene una foto o video de vista única.'
      })
    }

    await sock.sendMessage(chatId, {
      text:
        '⚠️ No puedo convertir ni revelar contenido configurado como vista única.\n\n' +
        'Si necesitas conservar una foto o video, pide al remitente que lo envíe nuevamente como mensaje normal.'
    })
  }
}
