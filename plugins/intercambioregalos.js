export default {
  name: 'intercambioregalos',

  async execute(sock, m, args, enviar) {
    const regalos = [
      '🎮 Una consola virtual',
      '🎧 Audífonos mágicos',
      '🎁 Una caja sorpresa',
      '🍫 Chocolates navideños',
      '🧸 Un peluche navideño',
      '⭐ Una estrella mágica',
      '🦌 Un reno virtual',
      '🎄 Un adorno navideño exclusivo',
      '🎅 Un regalo especial de Santa',
      '✨ Una sorpresa misteriosa'
    ]

    const regalo =
      regalos[Math.floor(Math.random() * regalos.length)]

    return enviar(
      `🎄🎁 *INTERCAMBIO DE REGALOS* 🎁🎄\n\n` +
      `🎅 Santa hizo el intercambio por ti.\n\n` +
      `🎁 Tu regalo es:\n` +
      `✨ *${regalo}*\n\n` +
      `🎄 ¡Feliz intercambio navideño! 🎅`
    )
  }
}
