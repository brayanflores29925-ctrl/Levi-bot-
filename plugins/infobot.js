import { CANAL_OFICIAL, GRUPO_OFICIAL } from '../config.js'

export default {
  name: 'infobot',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    const texto = `*INFORMACION DE LEVIBOT*

Soy LeviBot, tu asistente de WhatsApp.

Canal oficial: ${CANAL_OFICIAL}
Grupo oficial: ${GRUPO_OFICIAL}`

    await sock.sendMessage(chatId, { text: texto }, { quoted: m })
  }
}
