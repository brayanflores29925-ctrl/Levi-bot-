import { getDB } from '../database.js'

const DOMINIOS_PERMITIDOS = [
  'youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'tiktok.com',
  'instagram.com',
  'facebook.com',
  'fb.watch',
  'x.com',
  'twitter.com'
]

function esEnlacePermitido(url) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '')
    return DOMINIOS_PERMITIDOS.some(
      dominio => host === dominio || host.endsWith('.' + dominio)
    )
  } catch {
    return false
  }
}

function extraerEnlaces(texto) {
  return texto.match(/https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi) || []
}

export default {
  name: 'antilink2',
  async execute(sock, m, args) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return await sock.sendMessage(
        chatId,
        { text: 'Este comando solo funciona en grupos.' },
        { quoted: m }
      )
    }

    const groupMeta = await sock.groupMetadata(chatId)
    const admin = groupMeta.participants.find(p => p.id === sender)?.admin

    if (!admin) {
      return await sock.sendMessage(
        chatId,
        { text: 'Solo un admin puede configurar AntiLink2.' },
        { quoted: m }
      )
    }

    const db = getDB()
    if (!db.grupos) db.grupos = {}
    if (!db.grupos[chatId]) db.grupos[chatId] = {}

    const opcion = args?.[0]?.toLowerCase()

    if (opcion === 'on') {
      db.grupos[chatId].antilink2 = true
      return await sock.sendMessage(
        chatId,
        {
          text:
            '🔗 *ANTILINK2 ACTIVADO*\n\n' +
            '✅ YouTube\n' +
            '✅ TikTok\n' +
            '✅ Instagram\n' +
            '✅ Facebook\n' +
            '✅ X (Twitter)\n\n' +
            '🚫 Los demás enlaces serán eliminados y generarán una advertencia.\n' +
            '🛡️ Los administradores están exentos.'
        },
        { quoted: m }
      )
    }

    if (opcion === 'off') {
      db.grupos[chatId].antilink2 = false
      return await sock.sendMessage(
        chatId,
        { text: '🔗 AntiLink2 desactivado.' },
        { quoted: m }
      )
    }

    return await sock.sendMessage(
      chatId,
      { text: 'Uso: /antilink2 on | /antilink2 off' },
      { quoted: m }
    )
  },

  detectarEnlace(texto) {
    const enlaces = extraerEnlaces(texto)
    if (!enlaces.length) return false
    return enlaces.some(enlace => !esEnlacePermitido(enlace))
  }
}
