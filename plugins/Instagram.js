import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execFileAsync = promisify(execFile)

export default {
  name: 'Instagram',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '❌ Envía el enlace público de Instagram.\n\nEjemplo: /Instagram https://www.instagram.com/reel/...'
      })
    }

    if (!/^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\//i.test(url)) {
      return sock.sendMessage(chatId, {
        text: '❌ Enlace de Instagram no válido.\n\nUsa un enlace público de Reel, publicación o video.'
      })
    }

    await sock.sendMessage(chatId, {
      text: '⏳ Procesando Instagram...'
    })

    const tempDir = path.join(process.cwd(), 'temp')
    await fs.promises.mkdir(tempDir, { recursive: true })

    const id = `instagram-${Date.now()}`
    const outputTemplate = path.join(tempDir, `${id}.%(ext)s`)

    try {
      const { stdout } = await execFileAsync(
        'yt-dlp',
        [
          '--no-playlist',
          '--print', 'title',
          '--print', 'filename',
          '-f', 'bv*+ba/b',
          '--merge-output-format', 'mp4',
          '-o', outputTemplate,
          url
        ],
        {
          timeout: 180000,
          maxBuffer: 10 * 1024 * 1024
        }
      )

      const archivos = await fs.promises.readdir(tempDir)
      const candidatos = archivos
        .filter(nombre => nombre.startsWith(id + '.'))
        .map(nombre => path.join(tempDir, nombre))
        .filter(archivo => fs.existsSync(archivo))

      if (!candidatos.length) {
        throw new Error('No se encontró el archivo descargado.')
      }

      const archivo = candidatos[0]
      const stat = await fs.promises.stat(archivo)

      if (!stat.size) {
        throw new Error('El archivo descargado está vacío.')
      }

      const lineas = stdout
        .split('\n')
        .map(linea => linea.trim())
        .filter(Boolean)

      const titulo =
        lineas.find(linea =>
          !linea.includes('/') &&
          !linea.includes('\\') &&
          !linea.endsWith('.mp4')
        ) || 'Instagram'

      await sock.sendMessage(chatId, {
        video: { url: archivo },
        mimetype: 'video/mp4',
        fileName: 'instagram.mp4',
        caption: `📸 ${titulo}`
      })

      await fs.promises.unlink(archivo).catch(() => {})

    } catch (error) {
      console.error('Error en /Instagram:', error)

      await sock.sendMessage(chatId, {
        text: '❌ No pude descargar el contenido de Instagram.\n\nVerifica que el enlace sea público e inténtalo nuevamente.'
      })
    }
  }
}
