import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execFileAsync = promisify(execFile)

export default {
  name: 'sticker',
  aliases: ['s'],

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid

    const imagen =
      m.message?.imageMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    const video =
      m.message?.videoMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage

    if (!imagen && !video) {
      return enviar(
        '🖼️ *STICKER*\n\n' +
        'Envía o responde a una imagen o video con:\n' +
        '/sticker'
      )
    }

    const tempDir = path.join(process.cwd(), 'temp')
    const id = Date.now()
    const entrada = path.join(tempDir, `sticker-${id}-input`)
    const salida = path.join(tempDir, `sticker-${id}.webp`)

    try {
      await fs.promises.mkdir(tempDir, { recursive: true })

      const tipo = imagen ? 'image' : 'video'
      const contenido = imagen || video
      const stream = await downloadContentFromMessage(contenido, tipo)
      const chunks = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)

      if (!buffer.length) {
        throw new Error('El archivo recibido está vacío.')
      }

      await fs.promises.writeFile(entrada, buffer)

      if (imagen) {
        await execFileAsync(
          'ffmpeg',
          [
            '-y',
            '-i',
            entrada,
            '-vf',
            'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0',
            '-c:v',
            'libwebp',
            '-quality',
            '80',
            '-compression_level',
            '6',
            '-preset',
            'picture',
            salida
          ],
          {
            timeout: 60000,
            maxBuffer: 5 * 1024 * 1024
          }
        )
      } else {
        await execFileAsync(
          'ffmpeg',
          [
            '-y',
            '-i',
            entrada,
            '-t',
            '8',
            '-vf',
            'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0',
            '-c:v',
            'libwebp',
            '-loop',
            '0',
            '-an',
            '-quality',
            '70',
            '-compression_level',
            '6',
            '-preset',
            'default',
            salida
          ],
          {
            timeout: 90000,
            maxBuffer: 5 * 1024 * 1024
          }
        )
      }

      const stats = await fs.promises.stat(salida)

      if (stats.size === 0) {
        throw new Error('FFmpeg produjo un WebP vacío.')
      }

      await sock.sendMessage(
        chatId,
        {
          sticker: {
            url: salida
          }
        },
        { quoted: m }
      )

    } catch (error) {
      console.error('Error en /sticker:', error?.stderr || error?.message || error)
      await enviar('❌ No se pudo crear el sticker.')
    } finally {
      await fs.promises.unlink(entrada).catch(() => {})
      await fs.promises.unlink(salida).catch(() => {})
    }
  }
}
