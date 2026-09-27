import ytSearch from 'yt-search'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import * as Baileys from '@whiskeysockets/baileys'

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
        '📌 *Ejemplo:* .play Feliz Navidad'
      )
    }

    try {
      await enviar(`🔎 Buscando: *${busqueda}*...`)

      const resultado = await ytSearch(busqueda)
      const video = resultado.videos?.[0]

      if (!video) {
        return enviar('❌ No se encontraron resultados.')
      }

      console.log('[PLAY DEBUG] ytSearch OK:', video.url)

      pendientes.set(chatId, {
        url: video.url,
        title: video.title
      })

      const titulo = video.title
      const canal = video.author?.name || 'Desconocido'
      const duracion = video.timestamp || 'N/A'
      const vistas = video.views
        ? Number(video.views).toLocaleString()
        : 'N/A'

      const textoDetalle =
        '╭━━━━━━━━━━━━━━━━━━━━╮\n' +
        '┃     🎵 YOUTUBE PLAY     ┃\n' +
        '╰━━━━━━━━━━━━━━━━━━━━╯\n\n' +
        `📌 *Título:* ${titulo}\n` +
        `👤 *Canal:* ${canal}\n` +
        `⏱️ *Duración:* ${duracion}\n` +
        `👁️ *Vistas:* ${vistas}\n\n` +
        '👇 *Selecciona qué deseas descargar:*'

      try {
        const miniatura = video.thumbnail

        const mensajePortada =
          `${textoDetalle.replace(
            '👇 *Selecciona qué deseas descargar:*',
            '👇 *Elige el formato de descarga:*'
          )}\n\n` +
          '🎬 *.1* → Descargar Vídeo MP4\n' +
          '🎧 *.2* → Descargar Audio MP3'

        if (miniatura) {
          await sock.sendMessage(
            chatId,
            {
              image: { url: miniatura },
              caption: mensajePortada
            },
            { quoted: m }
          )
        } else {
          await sock.sendMessage(
            chatId,
            {
              text: mensajePortada
            },
            { quoted: m }
          )
        }

        console.log('[PLAY] Portada y menú de texto enviados correctamente.')
        return

      } catch (errorMenu) {
        console.error(
          '[PLAY] Error enviando menú interactivo:',
          errorMenu
        )

        return enviar(
          `${textoDetalle}\n\n` +
          '🎬 *.1* → Descargar Vídeo MP4\n' +
          '🎧 *.2* → Descargar Audio MP3'
        )
      }

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

    if (
      opcionFinal === '.1' ||
      opcionFinal === '1' ||
      opcionFinal.includes('1.')
    ) {
      esVideo = true
    } else if (
      opcionFinal === '.2' ||
      opcionFinal === '2' ||
      opcionFinal.includes('2.')
    ) {
      esAudio = true
    } else {
      return sock.sendMessage(
        chatId,
        {
          text:
            '⚠️ *Opción incorrecta*\n\n' +
            '🎬 Vídeo\n' +
            '🎧 Audio'
        },
        { quoted: m }
      )
    }

    pendientes.delete(chatId)

    const id =
      `${Date.now()}-${Math.random().toString(36).slice(2)}`

    const videoTemp = path.join(
      TEMP_DIR,
      `play-${id}-video.mp4`
    )

    const audioTemp = path.join(
      TEMP_DIR,
      `play-${id}-audio.m4a`
    )

    const output = path.join(
      TEMP_DIR,
      `play-${id}.${esVideo ? 'mp4' : 'mp3'}`
    )

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
        console.log('[PLAY] Descargando vídeo 134...')

        await execFileAsync(
          'yt-dlp',
          [
            '--force-overwrites',
            '-f', '134',
            '-o', videoTemp,
            pendiente.url
          ],
          {
            timeout: 300000,
            maxBuffer: 15 * 1024 * 1024
          }
        )

        console.log('[PLAY] Descargando audio 140...')

        await execFileAsync(
          'yt-dlp',
          [
            '--force-overwrites',
            '-f', '140',
            '-o', audioTemp,
            pendiente.url
          ],
          {
            timeout: 180000,
            maxBuffer: 15 * 1024 * 1024
          }
        )

        if (
          !fs.existsSync(videoTemp) ||
          !fs.existsSync(audioTemp)
        ) {
          throw new Error(
            'No se pudieron descargar vídeo y audio.'
          )
        }

        console.log('[PLAY] Uniendo vídeo + audio con FFmpeg...')

        await execFileAsync(
          'ffmpeg',
          [
            '-y',
            '-i', videoTemp,
            '-i', audioTemp,
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-shortest',
            output
          ],
          {
            timeout: 300000,
            maxBuffer: 15 * 1024 * 1024
          }
        )

        if (!fs.existsSync(output)) {
          throw new Error(
            'FFmpeg no creó el vídeo final.'
          )
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
        console.log('[PLAY] Descargando audio...')

        await execFileAsync(
          'yt-dlp',
          [
            '--force-overwrites',
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
          throw new Error(
            'No se pudo crear el archivo de audio.'
          )
        }

        const bufferAudio = fs.readFileSync(output)

        await sock.sendMessage(
          chatId,
          {
            audio: bufferAudio,
            mimetype: 'audio/mpeg',
            fileName:
              `${limpiarNombre(pendiente.title)}.mp3`,
            ptt: false
          },
          { quoted: m }
        )
      }

      console.log(
        `[LEVI] PLAY enviado correctamente (${esVideo ? 'Video' : 'Audio'})`
      )

    } catch (error) {
      console.error(
        '[LEVI] ERROR selección PLAY:',
        error
      )

      await sock.sendMessage(
        chatId,
        {
          text:
            '❌ *Error al descargar el archivo*\n\n' +
            'YouTube no permitió completar la descarga.'
        },
        { quoted: m }
      )

    } finally {
      for (const archivo of [
        videoTemp,
        audioTemp,
        output
      ]) {
        try {
          if (fs.existsSync(archivo)) {
            fs.unlinkSync(archivo)
          }
        } catch {}
      }
    }
  },

  register(sock) {
    sock.playSelection = (m, opcion) => {
      return this.seleccionar(
        sock,
        m,
        String(opcion).trim()
      )
    }
  }
}
