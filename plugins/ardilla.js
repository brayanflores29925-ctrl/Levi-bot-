import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { writeFile, readFile, unlink } from 'fs/promises'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export default {
  name: 'ardilla',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const audio = m.message?.audioMessage

    if (!audio) {
      return sock.sendMessage(chatId, {
        text: '🐿️ Responde a un audio con /ardilla.'
      })
    }

    const id = Date.now()
    const entrada = `/tmp/ardilla-${id}.ogg`
    const salida = `/tmp/ardilla-${id}.mp3`

    try {
      await sock.sendMessage(chatId, {
        text: '🐿️ ⏳ Aplicando efecto ardilla...'
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
        '-af', 'asetrate=44100*1.5,aresample=44100,atempo=0.666667',
        '-vn',
        '-c:a', 'libmp3lame',
        '-b:a', '128k',
        salida
      ])

      const buffer = await readFile(salida)

      await sock.sendMessage(chatId, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: 'voz-ardilla.mp3'
      })

    } catch (error) {
      console.error('Error en /ardilla:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude aplicar el efecto ardilla.\n\n${error.message}`
      })
    } finally {
      await unlink(entrada).catch(() => {})
      await unlink(salida).catch(() => {})
    }
  }
}
