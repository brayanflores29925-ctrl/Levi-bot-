import fs from 'fs'
import path from 'path'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const DB_PATH = path.join(process.cwd(), 'database.json')
const IMG_DIR = path.join(process.cwd(), 'data', 'tienda')
const IMG_PATH = path.join(IMG_DIR, 'imagen.jpg')

export default {
  name: 'setimgtienda',

  async execute(sock, m, parts, enviar) {
    const imagen =
      m.message?.imageMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    if (!imagen) {
      return enviar(
        '🖼️ *SETIMGTIENDA*\n\n' +
        'Responde a una imagen con este comando:\n\n' +
        '/setimgtienda'
      )
    }

    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas) {
        return enviar('❌ Primero activa el sistema con /setup.')
      }

      fs.mkdirSync(IMG_DIR, { recursive: true })

      const stream = await downloadContentFromMessage(imagen, 'image')
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)
      fs.writeFileSync(IMG_PATH, buffer)

      db.ventas.tienda.imagen = IMG_PATH
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      await enviar('✅ *IMAGEN DE TIENDA GUARDADA* 🖼️')
    } catch (error) {
      console.error('Error en /setimgtienda:', error)
      await enviar('❌ No se pudo guardar la imagen de la tienda.')
    }
  }
}
