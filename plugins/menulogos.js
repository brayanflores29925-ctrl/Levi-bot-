export default {
  name: 'menulogos',

  async execute(sock, m, args, enviar) {
    await enviar(
      '🎨 *MENÚ DE LOGOS*\n\n' +
      '✨ Aquí encontrarás las herramientas para crear logos.\n\n' +
      '🖼️ Generador de logos — Próximamente\n' +
      '✏️ Logos personalizados — Próximamente\n\n' +
      '💡 Más herramientas serán agregadas próximamente.'
    )
  }
}
