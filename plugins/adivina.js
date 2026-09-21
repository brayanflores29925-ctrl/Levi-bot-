export default {
  name: 'adivina',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const numero = Math.floor(Math.random() * 10) + 1
    const intento = Number(parts?.[0])

    if (!Number.isInteger(intento) || intento < 1 || intento > 10) {
      return sock.sendMessage(chatId, {
        text:
          '🔢 *ADIVINA EL NÚMERO*\n\n' +
          'Piensa en un número del *1 al 10* e intenta adivinarlo.\n\n' +
          'Ejemplo:\n' +
          '/adivina 7'
      })
    }

    await sock.sendMessage(chatId, {
      text:
        '🔢 *ADIVINA EL NÚMERO*\n\n' +
        `🎯 Número secreto: *${numero}*\n` +
        `👉 Tu intento: *${intento}*\n\n` +
        (intento === numero
          ? '🎉 *¡Correcto! Ganaste.*'
          : '❌ *No acertaste esta vez.*')
    })
  }
}
