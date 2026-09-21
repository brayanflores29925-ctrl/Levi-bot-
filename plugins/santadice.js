export default {
  name: 'santadice',

  async execute(sock, m, args, enviar) {
    const respuestas = [
      '🎅🎄 Santa dice: ¡Ho, ho, ho! La Navidad está llena de magia. ✨',
      '🎅🎁 Santa dice: ¡Prepárate, porque vienen muchas sorpresas! 🎄',
      '🎅❄️ Santa dice: ¡Que nunca falten alegría y buenos momentos! ✨',
      '🎅🦌 Santa dice: ¡Mis renos ya están listos para la gran noche! 🛷🎄',
      '🎅⭐ Santa dice: ¡La magia navideña comienza con una sonrisa! 🎁✨'
    ]

    const respuesta =
      respuestas[Math.floor(Math.random() * respuestas.length)]

    return enviar(respuesta)
  }
}
