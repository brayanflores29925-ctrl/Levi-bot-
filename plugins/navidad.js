export default {
  name: 'navidad',

  async execute(sock, m, args, enviar) {
    const mensajes = [
      '🎄✨ ¡Feliz Navidad! Que la magia de estas fiestas llene tu hogar de alegría y buenos momentos. 🎁❤️',
      '🎅🎄 ¡La Navidad ya llegó a LeviBots! Que nunca falten sonrisas, paz y muchos regalos. 🎁✨',
      '❄️🎄 ¡Espíritu navideño activado! Que esta Navidad esté llena de momentos inolvidables. ❤️🎅',
      '🎁✨ ¡Ho, ho, ho! 🎅 LeviBots les desea una Navidad llena de alegría, unión y felicidad. 🎄❤️',
      '🌟🎄 ¡Que brille la magia de la Navidad en cada corazón! 🎅🎁❄️'
    ]

    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)]

    return enviar(mensaje)
  }
}
