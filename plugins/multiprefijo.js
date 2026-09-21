const GRUPO_OFICIAL = '120363405079498012@g.us'

export default {
  name: 'multiprefijo',

  async execute(sock, m, args, enviar) {
    const chatId = m.key?.remoteJid

    if (chatId !== GRUPO_OFICIAL) {
      return enviar('❌ Este comando solo está disponible en el Grupo Oficial.')
    }

    if (!args[0]) {
      return enviar(
        '🔤 *MULTIPREFIJO*\n\n' +
        'Uso:\n' +
        '• /Multiprefijo on — Activar\n' +
        '• /Multiprefijo off — Desactivar'
      )
    }

    const estado = args[0].toLowerCase()

    if (estado === 'on') {
      sock.multiprefijo = true
      return enviar('✅ *Multiprefijo activado.*\nPrefijos: . ! # /')
    }

    if (estado === 'off') {
      sock.multiprefijo = false
      return enviar('🔴 *Multiprefijo desactivado.*')
    }

    return enviar('❌ Usa `/Multiprefijo on` o `/Multiprefijo off`.')
  }
}
