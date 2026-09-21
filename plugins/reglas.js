export default {
  name: 'reglas',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const texto = `╭━━〔 📜 REGLAS DEL GRUPO 〕━━╮

1️⃣ Respeta a todos los miembros.
2️⃣ No hagas spam.
3️⃣ No compartas contenido inapropiado.
4️⃣ No envíes enlaces no autorizados.
5️⃣ Respeta a los administradores.
6️⃣ Evita las discusiones y conflictos.
7️⃣ Usa los comandos correctamente.

⚠️ El incumplimiento de las reglas puede llevar a medidas administrativas.

╰━━━━━━━━━━━━━━━━━━━━╯`

    await sock.sendMessage(chatId, { text: texto })
  }
}
