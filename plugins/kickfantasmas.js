import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'contador.json')
const DIAS = 30

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

export default {
  name: 'kickfantasmas',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const metadata = await sock.groupMetadata(chatId)
    const participante = metadata.participants.find(p => p.id === sender)

    if (!participante?.admin) {
      return sock.sendMessage(chatId, {
        text: '❌ Solo los administradores pueden usar este comando.'
      })
    }

    const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net'
    const data = cargar()
    const grupo = data[chatId] || {}
    const limite = Date.now() - DIAS * 24 * 60 * 60 * 1000

    const admins = new Set(
      metadata.participants
        .filter(p => p.admin)
        .map(p => p.id)
    )

    const fantasmas = Object.entries(grupo)
      .filter(([jid, info]) => {
        if (!info || typeof info !== 'object') return false
        if (!info.ultimaActividad || info.ultimaActividad > limite) return false
        if (admins.has(jid)) return false
        if (jid === botJid) return false
        return metadata.participants.some(p => p.id === jid)
      })
      .map(([jid]) => jid)

    if (!fantasmas.length) {
      return sock.sendMessage(chatId, {
        text: '👻 No hay usuarios fantasmas de 30 días o más para expulsar.'
      })
    }

    try {
      await sock.groupParticipantsUpdate(chatId, fantasmas, 'remove')

      await sock.sendMessage(chatId, {
        text:
          `👻 *LIMPIEZA DE FANTASMAS*\n\n` +
          `✅ Usuarios expulsados: *${fantasmas.length}*\n` +
          `⏳ Criterio: *30 días o más sin actividad*`
      })
    } catch (error) {
      await sock.sendMessage(chatId, {
        text: `❌ No se pudo completar la expulsión.\n\n${error.message}`
      })
    }
  }
}
