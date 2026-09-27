import { CANAL_OFICIAL, GRUPO_OFICIAL } from '../config.js'
import { obtenerSubbots } from './subbotmanager.js'

export default {
  name: 'infobot',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    const ahora = new Date()

    const botId = sock.user?.id || ''
    const numeroBot = botId.split(':')[0].split('@')[0].replace(/\\D/g, '')

    const esSubBot = obtenerSubbots().some(subbot =>
      subbot.activo === true &&
      String(subbot.numero).replace(/\\D/g, '') === numeroBot
    )

    const esGrupoOficial = chatId === GRUPO_OFICIAL

    const tipoSubBot =
      esSubBot && !esGrupoOficial
        ? '\\n🤖 Tipo: Sub-Bot'
        : ''

    const horaHonduras = new Intl.DateTimeFormat('es-HN', {
      timeZone: 'America/Tegucigalpa',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(ahora)

    const texto = `*INFORMACION DEL BOT*

Soy LeviBot, tu asistente de WhatsApp.

📦 Versión: 1.0.0
👨‍💻 Creador: Josué
📅 Fecha: 23/09/2026
🕐 Hora: ${horaHonduras} (Honduras)${tipoSubBot}

📢 Canal oficial: ${CANAL_OFICIAL}
👥 Grupo oficial: ${GRUPO_OFICIAL}`

    await sock.sendMessage(chatId, { text: texto }, { quoted: m })
  }
}
