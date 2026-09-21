export default {
  name: 'navidadc',

  async execute(sock, m, args, enviar) {
    const ahora = new Date()
    const navidad = new Date(ahora.getFullYear(), 11, 24)

    if (ahora > navidad) {
      navidad.setFullYear(ahora.getFullYear() + 1)
    }

    const dias = Math.ceil(
      (navidad - ahora) / (1000 * 60 * 60 * 24)
    )

    return enviar(
      `🎄✨ *CUENTA REGRESIVA DE NAVIDAD* ✨🎄\n\n` +
      `🎅 Faltan *${dias} días* para Navidad.\n\n` +
      `📅 24 de diciembre\n` +
      `🎁 ¡La Navidad se acerca! ❄️`
    )
  }
}
