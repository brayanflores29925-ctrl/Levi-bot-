export default {
  name: 'duende',

  async execute(sock, m, args, enviar) {
    const mensajes = [
      '🧝🎄 ¡Un duende navideño apareció en LeviBots! ✨🎁',
      '🧝😂 El duende dice: ¡Deja de pedir regalos y ayuda a Santa! 🎅🎁',
      '🧝🎄 ¡Alerta! Un duende travieso está escondiendo los regalos. 🎁😂',
      '🧝✨ El duende navideño pasó por aquí y dejó mucha magia. 🎄❄️',
      '🧝🎅 ¡Santa necesita ayuda! Los duendes están preparando los regalos. 🎁🎄'
    ]

    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)]

    return enviar(mensaje)
  }
}
