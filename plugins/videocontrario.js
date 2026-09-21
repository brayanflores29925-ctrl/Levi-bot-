import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { writeFile, readFile, unlink } from 'fs/promises'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export default {
  name: 'videocontrario',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const video = m.message?.videoMessage

    if (!video) {
      return sock.sendMessage(chatId, {
        text: '🎬 Responde a un video con /videocontrario.'
      })
    }

    const id = Date.now()
    const entrada = `/tmp/vc-${id}.mp4`
    const salida = `/tmp/vc-out-${id}.mp4`

    try {
      await sock.sendMessage(chatId, {
        text: '⏳ Revirtiendo el video...'
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
        '-vf', 'reverse',
        '-an',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        salida
      ])

      const buffer = await readFile(salida)

      await sock.sendMessage(chatId, {
        video: buffer,
        mimetype: 'video/mp4',
        caption: '🔄 Video al revés'
      })

    } catch (error) {
      console.error('Error en /videocontrario:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude revertir el video.\n\n${error.message}`
      })
    } finally {
      await unlink(entrada).catch(() => {})
      await unlink(salida).catch(() => {})
    }
  }
}
