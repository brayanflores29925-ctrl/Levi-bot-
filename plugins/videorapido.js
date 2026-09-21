import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { writeFile, readFile, unlink } from 'fs/promises'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export default {
  name: 'videorapido',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const video = m.message?.videoMessage

    if (!video) {
      return sock.sendMessage(chatId, {
        text: '🎬 Responde a un video con /videorapido.'
      })
    }

    const id = Date.now()
    const entrada = `/tmp/vr-${id}.mp4`
    const salida = `/tmp/vr-out-${id}.mp4`

    try {
      await sock.sendMessage(chatId, {
        text: '⏳ Acelerando video...'
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
        '-filter_complex', '[0:v]setpts=0.5*PTS[v]',
        '-map', '[v]',
        '-an',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        salida
      ])

      const buffer = await readFile(salida)

      await sock.sendMessage(chatId, {
        video: buffer,
        mimetype: 'video/mp4',
        caption: '⚡ Video acelerado'
      })

    } catch (error) {
      console.error('Error en /videorapido:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude procesar el video.\n\n${error.message}`
      })
    } finally {
      await unlink(entrada).catch(() => {})
      await unlink(salida).catch(() => {})
    }
  }
}
