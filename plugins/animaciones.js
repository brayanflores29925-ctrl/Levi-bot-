import fs from 'fs'
import path from 'path'

const ANIMACIONES_DIR = path.join(process.cwd(), 'plugins', 'animaciones')

export async function enviarAnimacion(sock, chatId, comando, options = {}) {
  const archivo = path.join(ANIMACIONES_DIR, `${comando}.webp`)

  if (!fs.existsSync(archivo)) {
    return false
  }

  await sock.sendMessage(
    chatId,
    {
      sticker: fs.readFileSync(archivo),
      ...options
    }
  )

  return true
}
