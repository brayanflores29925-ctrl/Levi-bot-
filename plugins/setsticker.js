export default {
  name: 'setsticker',

  async execute(sock, m, parts, enviar) {
    const texto = parts.join(' ').trim()

    if (!texto) {
      return enviar(
        '⚙️ *SETSTICKER*\n\n' +
        'Escribe el nombre que quieres ponerle al sticker.\n\n' +
        'Ejemplo:\n' +
        '/setsticker LeviBot'
      )
    }

    return enviar(
      `✅ Nombre del sticker configurado:\n\n` +
      `🏷️ *${texto}*`
    )
  }
}
