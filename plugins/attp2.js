import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execFileAsync = promisify(execFile)

export default {
  name: 'attp2',

  async execute(sock, m, parts, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = parts.join(' ').trim()

    if (!texto) {
      return enviar(
        '✍️ *ATTP2*\n\n' +
        'Escribe el texto para crear el sticker.\n\n' +
        'Ejemplo:\n' +
        '/attp2 Hola LeviBot'
      )
    }

    const dir = path.join(process.cwd(), 'temp', 'attp')
    const nombre = `attp2-${Date.now()}`
    const entrada = path.join(dir, `${nombre}.png`)
    const salida = path.join(dir, `${nombre}.webp`)

    try {
      fs.mkdirSync(dir, { recursive: true })

      await execFileAsync('magick', [
        '-size', '512x512',
        'xc:white',
        '-gravity', 'center',
        '-font', 'DejaVu-Sans-Bold',
        '-fill', 'black',
        '-pointsize', '48',
        '-interline-spacing', '8',
        '-annotate', '0', texto,
        entrada
      ])

      await execFileAsync('magick', [
        entrada,
        '-define', 'webp:lossless=false',
        '-quality', '90',
        salida
      ])

      const buffer = fs.readFileSync(salida)

      await sock.sendMessage(
        chatId,
        { sticker: buffer },
        { quoted: m }
      )
    } catch (error) {
      console.error('Error en /attp2:', error)
      await enviar('❌ No se pudo crear el sticker ATTP2.')
    } finally {
      try { if (fs.existsSync(entrada)) fs.unlinkSync(entrada) } catch {}
      try { if (fs.existsSync(salida)) fs.unlinkSync(salida) } catch {}
    }
  }
}
