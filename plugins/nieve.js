export default {
  name: 'nieve',

  async execute(sock, m, args, enviar) {
    const mensaje =
      `❄️❄️❄️❄️❄️❄️❄️❄️\n` +
      `❄️  *NIEVE NAVIDEÑA*  ❄️\n` +
      `❄️❄️❄️❄️❄️❄️❄️❄️\n\n` +
      `☃️❄️ La nieve está cayendo...\n` +
      `🎄✨ ¡Ambiente navideño activado! 🎅\n\n` +
      `❄️  ❄️  ❄️  ❄️  ❄️`

    return enviar(mensaje)
  }
}
