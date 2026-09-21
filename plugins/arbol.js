export default {
  name: 'arbol',

  async execute(sock, m, args, enviar) {
    const arbol =
      `🎄✨ *ÁRBOL DE NAVIDAD* ✨🎄\n\n` +
      `        ⭐\n` +
      `       🎄\n` +
      `      🎄🎄\n` +
      `     🎄🎄🎄\n` +
      `    🎄🎄🎄🎄\n` +
      `   🎄🎄🎄🎄🎄\n` +
      `  🎄🎄🎄🎄🎄🎄\n` +
      `       🟫\n` +
      `     🟫🟫🟫\n\n` +
      `🎁 🎁 🎁 🎁 🎁\n` +
      `✨ ¡Árbol navideño listo! ✨`

    return enviar(arbol)
  }
}
