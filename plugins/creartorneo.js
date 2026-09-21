export default {
  name: 'creartorneo',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = m.text || m.message?.conversation || ''
    const datos = texto.trim().split(/\s+/).slice(1).join(' ').trim()

    if (!datos) {
      return await sock.sendMessage(chatId, {
        text: `🏆 CREAR TORNEO

📌 Uso:
 /creartorneo <nombre>

📝 Ejemplo:
 /creartorneo Free Fire

Escribe el nombre del torneo después del comando.`
      })
    }

    await sock.sendMessage(chatId, {
      text: `🏆 TORNEO CREADO

🎮 Nombre: *${datos}*

👥 Los participantes pueden organizarse para competir.

✅ Torneo registrado correctamente.`
    })
  }
}
