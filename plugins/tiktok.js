import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execFileAsync = promisify(execFile)

export default {
  name: 'tiktok',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '❌ Envía el enlace público de TikTok.\n\nEjemplo: /tiktok https://www.tiktok.com/...'
      }, { quoted: m })
    }

    const tikTokRegex = /^(https?:\/\/)?((www|vm|vt)\.)?tiktok\.com\/.+/i

    if (!tikTokRegex.test(url)) {
      return sock.sendMessage(chatId, {
        text: '❌ El enlace proporcionado no parece ser un enlace válido de TikTok.'
      }, { quoted: m })
    }

    await sock.sendMessage(chatId, {
      text: '⏳ Procesando TikTok...'
    }, { quoted: m })

    const tempDir = path.join(process.cwd(), 'temp')
    const baseName = `tiktok-${Date.now()}`
    const outputTemplate = path.join(tempDir, `${baseName}.%(ext)s`)

    await fs.promises.mkdir(tempDir, { recursive: true })

    try {
      const { stdout } = await execFileAsync(
        'yt-dlp',
        [
          '--no-playlist',
          '--print',
          'title',
          '--print',
          'filename',
          '-f',
          'best[ext=mp4]/best',
          '-o',
          outputTemplate,
          url
        ],
        {
          timeout: 180000,
          maxBuffer: 10 * 1024 * 1024
        }
      )

      const lines = stdout
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)

      const titulo = lines[0] || 'TikTok'
      let archivo = lines[lines.length - 1]

      if (!archivo || !fs.existsSync(archivo)) {
        const posibles = await fs.promises.readdir(tempDir)

        const candidatos = posibles
          .filter(nombre => nombre.startsWith(baseName + '.'))
          .filter(nombre => /\.(mp4|webm|mkv)$/i.test(nombre))
          .map(nombre => path.join(tempDir, nombre))

        archivo = candidatos[0]
      }

      if (!archivo || !fs.existsSync(archivo)) {
        throw new Error('yt-dlp no produjo el archivo de video esperado.')
      }

      const stats = await fs.promises.stat(archivo)

      if (stats.size === 0) {
        throw new Error('El archivo descargado está vacío.')
      }

      await sock.sendMessage(chatId, {
        video: { url: archivo },
        mimetype: 'video/mp4',
        caption: `📱 ${titulo}`
      }, { quoted: m })

      await fs.promises.unlink(archivo).catch(() => {})

    } catch (error) {
      console.error('[TIKTOK PLUGIN ERROR]:', error?.stderr || error?.message || error)

      let mensajeError = 'No se pudo descargar el video de TikTok.'

      if (error?.killed || error?.code === 'ETIMEDOUT') {
        mensajeError = 'La descarga tardó demasiado y fue cancelada.'
      } else if (String(error?.stderr || '').includes('Private')) {
        mensajeError = 'El TikTok es privado y no se puede descargar.'
      } else if (String(error?.stderr || '').includes('Unsupported URL')) {
        mensajeError = 'El enlace de TikTok no es compatible.'
      } else if (error?.message) {
        mensajeError = error.message
      }

      await sock.sendMessage(chatId, {
        text: `❌ Error en /tiktok: ${mensajeError}`
      }, { quoted: m })
    }
  }
}
