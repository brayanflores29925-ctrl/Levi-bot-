export default {
  name: 'infoperfil',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.participant || chatId

    const numero = sender.split('@')[0]

    await enviar(
      `👤 *INFORMACIÓN DEL PERFIL*\n\n` +
      `📱 Número: +${numero}\n` +
      `🆔 ID: ${sender}\n\n` +
      `🤖 LeviBot`
    )
  }
}
