export default {
  name: 'bass3',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    await sock.sendMessage(chatId, {
      text: '🔊 Efecto BASS 3 listo. Responde a un audio o nota de voz con /bass3.'
    })
  }
}
