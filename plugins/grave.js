import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { writeFile, readFile, unlink } from 'fs/promises'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export default {
  name: 'grave',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const audio = m.message?.audioMessage

    if (!audio) {
      return sock.sendMessage(chatId, {
        text: '🎧 Responde a un audio con /grave.'
      })
    }

    const id = Date.now()
    const entrada = `/tmp/gr-${id}.ogg`
    const salida = `/tmp/gr-out-${id}.mp3`

    try {
      await sock.sendMessage(chatId, {
        text: '🔊 ⏳ Aplicando efecto grave...'
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
        '-af', 'asetrate=44100*0.75,aresample=44100,atempo=1.333333',
        '-vn',
        '-c:a', 'libmp3lame',
        '-b:a', '128k',
        salida
      ])

      const buffer = await readFile(salida)

      await sock.sendMessage(chatId, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: 'audio-grave.mp3'
      })

    } catch (error) {
      console.error('Error en /grave:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude aplicar el efecto grave.\n\n${error.message}`
      })
    } finally {
      await unlink(entrada).catch(() => {})
      await unlink(salida).catch(() => {})
    }
  }
}
