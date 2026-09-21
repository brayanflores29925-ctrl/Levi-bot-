import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { writeFile, unlink } from 'fs/promises'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export default {
  name: 'videolento',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const video = m.message?.videoMessage

    if (!video) {
      return sock.sendMessage(chatId, {
        text: '🎬 Responde a un video con /videolento.'
      })
    }

    const id = Date.now()
    const entrada = `/tmp/video-${id}.mp4`
    const salida = `/tmp/video-lento-${id}.mp4`

    try {
      await sock.sendMessage(chatId, {
        text: '⏳ Procesando video...'
      })

      const stream = await downloadContentFromMessage(video, 'video')
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      await writeFile(entrada, Buffer.concat(chunks))

      await execFileAsync('ffmpeg', [
        '-y',
        '-i', entrada,
        '-filter_complex', '[0:v]setpts=2*PTS[v]',
        '-map', '[v]',
        '-an',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        salida
      ])

      await sock.sendMessage(chatId, {
        video: await import('fs/promises').then(fs => fs.readFile(salida)),
        mimetype: 'video/mp4',
        caption: '🐢 Video en cámara lenta'
      })

    } catch (error) {
      console.error('Error en /videolento:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude procesar el video.\n\n${error.message}`
      })
    } finally {
      await unlink(entrada).catch(() => {})
      await unlink(salida).catch(() => {})
    }
  }
}
