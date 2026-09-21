export default {
  name: 'adolecente',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    await sock.sendMessage(chatId, {
      text: '🎙️ Efecto de voz adolescente listo. Responde a un audio o nota de voz con /adolecente.'
    })
  }
}
