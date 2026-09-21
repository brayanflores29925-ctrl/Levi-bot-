export default {
  name: 'niveles',

  async execute(sock, m, args, enviar) {
    await enviar(
      `⭐ *SISTEMA DE NIVELES LEVIBOT*\n\n` +
      `✨ Gana XP usando el bot y participando en el grupo.\n` +
      `🏆 Al conseguir suficiente XP podrás subir de nivel.\n\n` +
      `📌 Comandos:\n` +
      `• /minivel — Ver tu nivel\n` +
      `• /vernivel @usuario — Ver el nivel de otro usuario\n` +
      `• /ranknivel — Ranking de niveles\n\n` +
      `💡 El nivel y la XP se guardan automáticamente.`
    )
  }
}
