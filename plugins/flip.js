export default {
  name: 'flip',

  async execute(sock, m, args, enviar) {
    const resultado = Math.random() < 0.5 ? 'CARA 🪙' : 'CRUZ 🪙'

    await enviar(
      `🪙 *MONEDA VIRTUAL*\n\n` +
      `🎯 Resultado: *${resultado}*`
    )
  }
}
