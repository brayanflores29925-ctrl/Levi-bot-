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
    const chatId = m.chat || m.key?.remoteJid

    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const imagen = m.message?.imageMessage || quoted?.imageMessage
    const video = m.message?.videoMessage || quoted?.videoMessage

    if (!imagen && !video) {
      return await sock.sendMessage(chatId, { 
        text: '🖼️ *STICKER*\n\nEnvía o responde a una imagen/video con:\n/s\n/sticker' 
      }, { quoted: m })
    }

    const tempDir = path.join(process.cwd(), 'temp')
    await fs.promises.mkdir(tempDir, { recursive: true })

    const id = Date.now()
    const esImagen = !!imagen
    const entrada = path.join(tempDir, `in-${id}.${esImagen ? 'jpg' : 'mp4'}`)
    const salida = path.join(tempDir, `out-${id}.webp`)

    try {
      const contenido = imagen || video
      const tipo = esImagen ? 'image' : 'video'
      const stream = await downloadContentFromMessage(contenido, tipo)
      
      const chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      const buffer = Buffer.concat(chunks)

      if (!buffer.length) throw new Error('Buffer vacío')
      
      await fs.promises.writeFile(entrada, buffer)

      // Args optimizados
      const ffmpegArgs = esImagen 
        ? [
            '-y', '-i', entrada,
            '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
            '-c:v', 'libwebp',
            '-quality', '90',
            '-compression_level', '4',
            '-preset', 'picture',
            '-an', '-vsync', '0',
            salida
          ]
        : [
            '-y', '-i', entrada,
            '-t', '7',
            '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,fps=15',
            '-c:v', 'libwebp',
            '-loop', '0',
            '-an',
            '-quality', '70',
            '-compression_level', '4',
            '-preset', 'default',
            salida
          ]

      await execFileAsync('ffmpeg', ffmpegArgs, { timeout: 90000 })

      const stickerBuffer = await fs.promises.readFile(salida)
      
      await sock.sendMessage(chatId, { sticker: stickerBuffer }, { quoted: m })

    } catch (e) {
      console.error('Error sticker:', e)
      await sock.sendMessage(chatId, { text: `❌ Error: ${e.message}\nAsegúrate de tener ffmpeg instalado.` }, { quoted: m })
    } finally {
      await fs.promises.unlink(entrada).catch(() => {})
      await fs.promises.unlink(salida).catch(() => {})
    }
  }
        }
