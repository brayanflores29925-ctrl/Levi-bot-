export default {
  name: 'configp',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = "*COMANDOS DE PROTECCION DE GRUPO*\n\n" +
      "/status - Ver configuracion actual del grupo\n" +
      "/adv on/off - Activar advertencias\n" +
      "/antiimg 1/0 - Bloquear imagenes\n" +
      "/antivideo 1/0 - Bloquear videos\n" +
      "/antisticker 1/0 - Bloquear stickers\n" +
      "/antilinkgp 1/0 - Bloquear enlaces de WhatsApp\n" +
      "/antilinkhard 1/0 - Bloquear cualquier enlace\n" +
      "/antifake 1/0 - Bloquear numeros falsos\n" +
      "/antipalabrotas 1/0 - Bloquear insultos\n" +
      "/antispam 1/0 - Bloquear spam\n" +
      "/antiflood 1/0 - Bloquear mensajes repetitivos"

    await sock.sendMessage(chatId, { text: texto }, { quoted: m })
  }
}
