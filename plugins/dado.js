export default {
  name: 'dado',

  async execute(sock, m, args, enviar) {
    const resultado = Math.floor(Math.random() * 6) + 1

    await enviar(
      `🎲 *DADO VIRTUAL*\n\n` +
      `🎯 Resultado: *${resultado}*`
    )
  }
}
