import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { writeFile, readFile, unlink } from 'fs/promises'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export default {
  name: 'bass2',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const audio = m.message?.audioMessage

    if (!audio) {
      return sock.sendMessage(chatId, {
        text: '🎧 Responde a un audio con /bass2.'
      })
    }

    const id = Date.now()
    const entrada = `/tmp/bass2-${id}.ogg`
    const salida = `/tmp/bass2-${id}.mp3`

    try {
      await sock.sendMessage(chatId, {
        text: '🔊 ⏳ Aplicando graves fuertes...'
      })

      const stream = await downloadContentFromMessage(audio, 'audio')
      const chunks = []

      for await (const chunk of stream) chunks.push(chunk)

      await writeFile(entrada, Buffer.concat(chunks))

      await execFileAsync('ffmpeg', [
        '-y',
        '-i', entrada,
        '-af', 'bass=g=15:f=100',
        '-vn',
        '-c:a', 'libmp3lame',
        '-b:a', '128k',
        salida
      ])

      const buffer = await readFile(salida)

      await sock.sendMessage(chatId, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: 'bass2.mp3'
      })

    } catch (error) {
      console.error('Error en /bass2:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude procesar el audio.\n\n${error.message}`
      })
    } finally {
      await unlink(entrada).catch(() => {})
      await unlink(salida).catch(() => {})
    }
  }
}
