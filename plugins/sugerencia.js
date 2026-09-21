export default {
  name: 'sugerencia',

  async execute(sock, m, parts, enviar) {
    const texto = parts.join(' ').trim()

    if (!texto) {
      return enviar(
        '💡 *SUGERENCIA*\n\n' +
        'Escribe tu sugerencia después del comando.\n\n' +
        'Ejemplo:\n' +
        '/sugerencia Agregar más comandos de música'
      )
    }

    await enviar(
      '✅ *SUGERENCIA RECIBIDA*\n\n' +
      '💡 Tu sugerencia fue registrada correctamente.\n\n' +
      `📝 ${texto}\n\n` +
      '🙏 Gracias por ayudar a mejorar LeviBot.'
    )
  }
}
