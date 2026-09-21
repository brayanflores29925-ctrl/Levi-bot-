export default {
  name: 'x9',

  async execute(sock, m, args, enviar) {
    const chatId = m.chat || m.key?.remoteJid

    if (!args[0]) {
      return enviar(
        '👁️ *X9 VISTA ÚNICA*\n\n' +
        'Usa:\n' +
        '• /x9 on — Activar\n' +
        '• /x9 off — Desactivar'
      )
    }

    const estado = args[0].toLowerCase()

    if (estado === 'on') {
      sock.x9 = true
      return enviar('✅ *X9 activado.*')
    }

    if (estado === 'off') {
      sock.x9 = false
      return enviar('🔴 *X9 desactivado.*')
    }

    return enviar('❌ Usa `/x9 on` o `/x9 off`.')
  }
}
