export default {
  name: 'ping',

  async execute(sock, m, args, enviar) {
    const inicio = Date.now()

    await enviar('🏓 *PONG*')

    const tiempo = Date.now() - inicio

    await enviar(`⚡ Tiempo de respuesta: *${tiempo} ms*`)
  }
}
