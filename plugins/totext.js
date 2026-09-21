import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { writeFile, unlink } from 'fs/promises'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export default {
  name: 'totext',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const mensaje = m.message?.imageMessage

    if (!mensaje) {
      return sock.sendMessage(chatId, {
        text: '📝 Responde a una imagen con /totext para convertirla a texto.'
      })
    }

    try {
      await sock.sendMessage(chatId, {
        text: '🔎 Leyendo el texto de la imagen...'
      })

      const stream = await downloadContentFromMessage(mensaje, 'image')
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)
      const entrada = `/tmp/totext-${Date.now()}.jpg`
      const salida = `/tmp/totext-${Date.now()}`

      await writeFile(entrada, buffer)

      await execFileAsync('tesseract', [
        entrada,
        salida,
        '-l',
        'eng'
      ])

      const { readFile } = await import('fs/promises')
      const texto = (await readFile(`${salida}.txt`, 'utf8')).trim()

      await unlink(entrada).catch(() => {})
      await unlink(`${salida}.txt`).catch(() => {})

      if (!texto) {
        return sock.sendMessage(chatId, {
          text: '❌ No encontré texto legible en la imagen.'
        })
      }

      await sock.sendMessage(chatId, {
        text: `📝 *TEXTO DETECTADO:*\n\n${texto}`
      })

    } catch (error) {
      console.error('Error en /totext:', error)

      await sock.sendMessage(chatId, {
        text: `❌ No pude leer la imagen.\n\n${error.message}`
      })
    }
  }
}
