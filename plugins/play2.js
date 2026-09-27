import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execFileAsync = promisify(execFile)

export default {
  name: 'play2',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const url = parts.join(' ').trim()

    if (!url) {
      return enviar(
        '🎧 *PLAY2 - AUDIO*\n\n' +
        'Envía una URL directa de un archivo de audio.\n\n' +
        'Ejemplo:\n' +
        '/play2 https://ejemplo.com/cancion.mp3'
      )
    }

    if (!/^https?:\/\/\S+$/i.test(url)) {
      return enviar('❌ Debes proporcionar una URL válida.')
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const dir = path.join(process.cwd(), 'temp')
    const salida = path.join(dir, `play2-${id}.mp3`)

    try {
      fs.mkdirSync(dir, { recursive: true })

      await enviar('⏳ *Descargando audio...* 🎧')

      await execFileAsync(
        'yt-dlp',
        [
          '--no-playlist',
          '--no-warnings',
          '-x',
          '--audio-format', 'mp3',
          '--audio-quality', '5',
          '-o', salida,
          url
        ],
        {
          timeout: 300000,
          maxBuffer: 25 * 1024 * 1024
        }
      )

      if (!fs.existsSync(salida)) {
        throw new Error('No se creó el archivo de audio.')
      }

      const audio = fs.readFileSync(salida)

      await sock.sendMessage(
        chatId,
        {
          audio,
          mimetype: 'audio/mpeg',
          fileName: 'audio.mp3'
        },
        { quoted: m }
      )
    } catch (error) {
      console.error('[PLAY2] Error:', error.stderr || error.message)
      await enviar('❌ No se pudo descargar el audio.')
    } finally {
      try {
        if (fs.existsSync(salida)) fs.unlinkSync(salida)
      } catch {}
    }
  }
}
