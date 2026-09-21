import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { OWNER_NUMBER } from '../config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  name: 'fotomenu',

  async execute(sock, m, args, enviar) {
    const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''

    const numero = sender
      .split('@')[0]
      .replace(/\D/g, '')

    if (!numero.endsWith(OWNER_NUMBER)) {
      return enviar(
        '❌ *ACCESO DENEGADO*\n\n' +
        'Este comando es exclusivo del OWNER de LeviBot.'
      )
    }

    const imagen =
      m.message?.imageMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    if (!imagen) {
      return enviar(
        '🖼️ *CAMBIAR FOTO DEL MENÚ*\n\n' +
        'Debes enviar o responder a una imagen usando:\n\n' +
        '/fotomenu\n\n' +
        '📌 La nueva imagen reemplazará la foto actual del menú.'
      )
    }

    try {
      const buffer = await sock.downloadMediaMessage(
        imagen,
        'buffer',
        {},
        {
          logger: console
        }
      )

      const mediaDir = path.join(__dirname, '../media')
      const fotoMenu = path.join(mediaDir, 'levibot-menu.jpg')

      if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true })
      }

      fs.writeFileSync(fotoMenu, buffer)

      return enviar(
        '✅ *FOTO DEL MENÚ ACTUALIZADA*\n\n' +
        '🖼️ La nueva imagen se guardó correctamente.\n' +
        '👑 Solo el OWNER puede cambiarla.'
      )
    } catch (error) {
      console.error('Error en /fotomenu:', error)

      return enviar(
        '❌ *ERROR*\n\n' +
        'No pude guardar la nueva foto del menú.'
      )
    }
  }
}
