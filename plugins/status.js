import { getDB } from '../database.js'

export default {
  name: 'status',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId.endsWith('@g.us')) {
      return await sock.sendMessage(chatId, { text: 'Este comando solo funciona en grupos.' }, { quoted: m })
    }

    const db = getDB()
    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}
    const config = db.grupos[chatId]

    const estado = (valor) => valor ? 'Activado' : 'Desactivado'

    const texto = "*CONFIGURACION DEL GRUPO*\n\n" +
      "Advertencias: " + estado(config.adv) + "\n" +
      "Anti-imagen: " + estado(config.antiimg) + "\n" +
      "Anti-video: " + estado(config.antivideo) + "\n" +
      "Anti-sticker: " + estado(config.antisticker) + "\n" +
      "Anti-link (WhatsApp): " + estado(config.antilinkgp) + "\n" +
      "Anti-link (todos): " + estado(config.antilinkhard) + "\n" +
      "Anti-fake: " + estado(config.antifake) + "\n" +
      "Anti-palabrotas: " + estado(config.antipalabrotas) + "\n" +
      "Anti-spam: " + estado(config.antispam) + "\n" +
      "Anti-flood: " + estado(config.antiflood) + "\n" +
      "Modo admin: " + estado(config.modoadmin) + "\n" +
      "Modo NSFW: " + estado(config.modonsfw) + "\n" +
      "Bienvenidas: " + estado(config.welcome)

    await sock.sendMessage(chatId, { text: texto }, { quoted: m })
  }
}
