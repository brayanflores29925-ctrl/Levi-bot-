export default {
  name: 'findeaño',

  async execute(sock, m, args, enviar) {
    const ahora = new Date()
    const finDeAño = new Date(ahora.getFullYear(), 11, 31)

    if (ahora > finDeAño) {
      finDeAño.setFullYear(ahora.getFullYear() + 1)
    }

    const dias = Math.ceil(
      (finDeAño - ahora) / (1000 * 60 * 60 * 24)
    )

    return enviar(
      `🎆✨ *CUENTA REGRESIVA DE FIN DE AÑO* ✨🎆\n\n` +
      `⏳ Faltan *${dias} días* para el 31 de diciembre.\n\n` +
      `📅 31 de diciembre\n` +
      `🎉 ¡Se acerca el Año Nuevo! 🥳`
    )
  }
}
