import ytSearch from 'yt-search'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execFileAsync = promisify(execFile)
const pendientes = new Map()
const TEMP_DIR = path.join(process.cwd(), 'temp')

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true })
}

function limpiarNombre(nombre) {
  return nombre
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
}

export default {
  name: 'play',
  aliases: ['yt', 'song', 'descargar', 'video'],

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const busqueda = parts.join(' ').trim()

    if (!busqueda) {
      return enviar(
        '⚠️ *PLAY - DESCARGADOR*\n\n' +
        'Escribe el nombre de una canción o vídeo.\n\n' +
        '📌 *Ejemplo:* .play Sweat Weather'
      )
    }

    try {
      await enviar(`🔎 Buscando: *${busqueda}*...`)

      const resultado = await ytSearch(busqueda)
      const video = resultado.videos?.[0]

      if (!video) {
        return enviar('❌ No se encontraron resultados.')
      }

      pendientes.set(chatId, {
        url: video.url,
        title: video.title
      })

      const titulo = video.title
      const canal = video.author?.name || 'Desconocido'
      const duracion = video.timestamp || 'N/A'
      const vistas = video.views ? Number(video.views).toLocaleString() : 'N/A'

      const textoDetalle =
        '╭━━━━━━━━━━━━━━━━━━━━╮\n' +
        '┃     🎵 YOUTUBE PLAY     ┃\n' +
        '╰━━━━━━━━━━━━━━━━━━━━╯\n\n' +
        `📌 *Título:* ${titulo}\n` +
        `👤 *Canal:* ${canal}\n` +
        `⏱️ *Duración:* ${duracion}\n` +
        `👁️ *Vistas:* ${vistas}\n\n` +
        '👇 *Responde con una opción:*\n\n' +
        '🎬 *.1* → Descargar Vídeo MP4\n' +
        '🎧 *.2* → Descargar Audio MP3'

      return await enviar(textoDetalle)

    } catch (error) {
      console.error('[LEVI] ERROR /play:', error)
      return enviar('❌ No se pudo realizar la búsqueda.')
    }
  },

  async seleccionar(sock, m, opcion) {
    const chatId = m.key?.remoteJid
    const opcionFinal = String(opcion).trim()
    const pendiente = pendientes.get(chatId)

    if (!pendiente) {
      return sock.sendMessage(
        chatId,
        {
          text:
            '❌ *NO HAY UNA BÚSQUEDA PENDIENTE*\n\n' +
            'Primero utiliza *.play <nombre de la canción>*.'
        },
        { quoted: m }
      )
    }

    let esVideo = false
    let esAudio = false

    if (opcionFinal === '.1' || opcionFinal === '1') {
      esVideo = true
    } else if (opcionFinal === '.2' || opcionFinal === '2') {
      esAudio = true
    } else {
      return sock.sendMessage(
        chatId,
        {
          text:
            '⚠️ *Opción incorrecta*\n\n' +
            '🎬 *.1* = Descargar Vídeo\n' +
            '🎧 *.2* = Descargar Audio'
        },
        { quoted: m }
      )
    }

    pendientes.delete(chatId)

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const extension = esVideo ? 'mp4' : 'mp3'
    const output = path.join(TEMP_DIR, `play-${id}.${extension}`)

    try {
      await sock.sendMessage(
        chatId,
        {
          text: esVideo
            ? '⏳ *Descargando vídeo...*\n\nEspera un momento 🎬'
            : '⏳ *Descargando audio...*\n\nEspera un momento 🎧'
        },
        { quoted: m }
      )

      if (esVideo) {
        await execFileAsync(
          'yt-dlp',
          [
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '--merge-output-format', 'mp4',
            '-o', output,
            pendiente.url
          ],
          {
            timeout: 300000,
            maxBuffer: 15 * 1024 * 1024
          }
        )

        if (!fs.existsSync(output)) {
          throw new Error('No se pudo crear el archivo de vídeo.')
        }

        const bufferVideo = fs.readFileSync(output)

        await sock.sendMessage(
          chatId,
          {
            video: bufferVideo,
            mimetype: 'video/mp4',
            caption: `📹 *${pendiente.title}*`
          },
          { quoted: m }
        )

      } else {
        await execFileAsync(
          'yt-dlp',
          [
            '-x',
            '--audio-format', 'mp3',
            '--audio-quality', '5',
            '-o', output,
            pendiente.url
          ],
          {
            timeout: 180000,
            maxBuffer: 15 * 1024 * 1024
          }
        )

        if (!fs.existsSync(output)) {
          throw new Error('No se pudo crear el archivo de audio.')
        }

        const bufferAudio = fs.readFileSync(output)

        await sock.sendMessage(
          chatId,
          {
            audio: bufferAudio,
            mimetype: 'audio/mpeg',
            fileName: `${limpiarNombre(pendiente.title)}.mp3`,
            ptt: false
          },
          { quoted: m }
        )
      }

      console.log(`[LEVI] PLAY enviado correctamente (${esVideo ? 'Video' : 'Audio'})`)

    } catch (error) {
      console.error('[LEVI] ERROR selección PLAY:', error)

      await sock.sendMessage(
        chatId,
        {
          text:
            '❌ *Error al descargar el archivo*\n\n' +
            'Puede que YouTube haya bloqueado temporalmente la descarga ' +
            'o que el formato no esté disponible.'
        },
        { quoted: m }
      )

    } finally {
      try {
        if (fs.existsSync(output)) {
          fs.unlinkSync(output)
        }
      } catch {}
    }
  },

  register(sock) {
    sock.playSelection = (m, opcion) => {
      return this.seleccionar(sock, m, String(opcion).trim())
    }
  }
}
