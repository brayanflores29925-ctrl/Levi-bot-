import { getDB } from './database.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'

export async function manejarVistaUnica(sock, m) {
  const chatId = m.chat || m.key?.remoteJid
  if (!chatId?.endsWith('@g.us')) return

  const db = getDB()
  const activado = db.grupos?.[chatId]?.revelar
  if (!activado) return

  const viewOnceMsg =
    m.message?.viewOnceMessage?.message ||
    m.message?.viewOnceMessageV2?.message ||
    m.message?.viewOnceMessageV2Extension?.message

  if (!viewOnceMsg) return

  const sender = m.sender || m.key?.participant || chatId

  try {
    const buffer = await downloadMediaMessage(
      { message: viewOnceMsg, key: m.key },
      'buffer',
      {}
    )

    if (viewOnceMsg.imageMessage) {
      await sock.sendMessage(chatId, {
        image: buffer,
        caption: 'Vista unica revelada de @' + sender.split('@')[0],
        mentions: [sender]
      })
    } else if (viewOnceMsg.videoMessage) {
      await sock.sendMessage(chatId, {
        video: buffer,
        caption: 'Vista unica revelada de @' + sender.split('@')[0],
        mentions: [sender]
      })
    }
  } catch (error) {
    console.log('Error revelando vista unica:', error.message)
  }
}
