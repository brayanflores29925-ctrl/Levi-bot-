import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { writeFile, readFile, unlink } from 'fs/promises'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export default {
  name: 'explotar',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const audio = m.message?.audioMessage

    if (!audio) {
      return sock.sendMessage(chatId, {
        text: '💥 Responde a un audio con /explotar.'
      })
    }

    const id = Date.now()
    const entrada = `/tmp/ex-${id}.ogg`
    const salida = `/tmp/ex-out-${id}.mp3`

    try {
      await sock.sendMessage(chatId, {
        text: '💥 ⏳ Aplicando efecto...'
      })

      const stream = await downloadContentFromMessage(audio, 'audio')
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      await writeFile(entrada, Buffer.concat(chunks))

      await execFileAsync('ffmpeg', [
        '-y',
        '-i', entrada,
        '-af', 'acompressor=threshold=-18dB:ratio=4:attack=5:release=80:makeup=6,volume=2',
        '-vn',
        '-c:a', 'libmp3lame',
        '-b:a', '128k',
        salida
      ])

      const buffer = await readFile(salida)

      await sock.sendMessage(chatId, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: 'audio-explotar.mp3'
      })

    } catch (error) {
      console.error('Error en /explotar:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude procesar el audio.\n\n${error.message}`
      })
    } finally {
      await unlink(entrada).catch(() => {})
      await unlink(salida).catch(() => {})
    }
  }
}
