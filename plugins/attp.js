import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execFileAsync = promisify(execFile)

export default {
  name: 'attp',

  async execute(sock, m, parts, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = parts.join(' ').trim()

    if (!texto) {
      return enviar(
        '✍️ *ATTP*\n\n' +
        'Escribe el texto que quieres convertir en sticker.\n\n' +
        'Ejemplo:\n' +
        '/attp Hola LeviBot'
      )
    }

    const dir = path.join(process.cwd(), 'temp', 'attp')
    const nombre = `attp-${Date.now()}`
    const entrada = path.join(dir, `${nombre}.png`)
    const salida = path.join(dir, `${nombre}.webp`)

    try {
      fs.mkdirSync(dir, { recursive: true })

      await execFileAsync('magick', [
        '-size', '512x512',
        'xc:black',
        '-gravity', 'center',
        '-font', 'DejaVu-Sans-Bold',
        '-fill', 'white',
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
      console.error('Error en /attp:', error)
      await enviar('❌ No se pudo crear el sticker ATTP.')
    } finally {
      try { if (fs.existsSync(entrada)) fs.unlinkSync(entrada) } catch {}
      try { if (fs.existsSync(salida)) fs.unlinkSync(salida) } catch {}
    }
  }
}
