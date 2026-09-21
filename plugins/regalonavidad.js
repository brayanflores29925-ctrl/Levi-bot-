export default {
  name: 'regalonavidad',

  async execute(sock, m, args, enviar) {
    const regalos = [
      '🎁 Una caja misteriosa llena de sorpresas.',
      '🎮 Un videojuego navideño virtual.',
      '💰 500 monedas navideñas.',
      '🍫 Una caja de chocolates.',
      '🎧 Unos audífonos mágicos.',
      '🧸 Un osito navideño.',
      '⭐ Una estrella de Navidad.',
      '🎄 Un adorno navideño exclusivo.',
      '🦌 Un reno virtual.',
      '🎅 Un regalo especial de Santa.'
    ]

    const regalo = regalos[Math.floor(Math.random() * regalos.length)]

    return enviar(
      `🎄🎁 *REGALO DE NAVIDAD* 🎁🎄\n\n` +
      `🎅 Santa Claus preparó un regalo para ti:\n\n` +
      `${regalo}\n\n` +
      `✨ ¡Disfrútalo y que tengas una hermosa Navidad! 🎄`
    )
  }
}
