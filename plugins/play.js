import ytSearch from 'yt-search'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

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

async function descargar(url, args, opciones = {}) {
  const { timeout = 300000 } = opciones

  try {
    const resultado = await execFileAsync(
      'yt-dlp',
      args,
      {
        timeout,
        maxBuffer: 25 * 1024 * 1024
      }
    )

    console.log('[PLAY] yt-dlp:', resultado.stdout || '')
    return resultado
  } catch (error) {
    console.error('[PLAY] yt-dlp ERROR:')
    console.error(error.stderr || error.message)
    throw error
  }
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

      const mensajePortada =
        '╭━━━━━━━━━━━━━━━━━━━━╮\n' +
        '┃     🎵 YOUTUBE PLAY     ┃\n' +
        '╰━━━━━━━━━━━━━━━━━━━━╯\n\n' +
        `📌 *Título:* ${titulo}\n` +
        `👤 *Canal:* ${canal}\n` +
        `⏱️ *Duración:* ${duracion}\n` +
        `👁️ *Vistas:* ${vistas}\n\n` +
        '👇 *Elige el formato de descarga:*\n\n' +
        '🎬 *.1* → Descargar Vídeo MP4\n' +
        '🎧 *.2* → Descargar Audio MP3'

      try {
        const miniatura = video.thumbnail

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

        console.log('[PLAY] Menú enviado correctamente.')
        return
      } catch (errorMenu) {
        console.error('[PLAY] Error enviando menú:', errorMenu)

        return enviar(mensajePortada)
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
            '🎬 *.1* → Vídeo\n' +
            '🎧 *.2* → Audio'
        },
        { quoted: m }
      )
    }

    pendientes.delete(chatId)

    const id =
      `${Date.now()}-${Math.random().toString(36).slice(2)}`

    const output = path.join(
      TEMP_DIR,
      `play-${id}.${esVideo ? 'mp4' : 'mp3'}`
    )

    try {
      await sock.sendMessage(
        chatId,
        {
          text: esVideo
            ? '⏳ *Descargando vídeo...*\n\nEstoy buscando automáticamente el mejor formato disponible 🎬'
            : '⏳ *Descargando audio...*\n\nEstoy preparando el audio 🎧'
        },
        { quoted: m }
      )

      if (esVideo) {
        console.log('[PLAY] Descarga automática de vídeo...')

        await descargar(
          pendiente.url,
          [
            '--no-playlist',
            '--force-overwrites',
            '--no-warnings',
            '-f',
            'bv*+ba/b',
            '--merge-output-format',
            'mp4',
            '-o',
            output,
            pendiente.url
          ],
          { timeout: 300000 }
        )

        if (!fs.existsSync(output)) {
          throw new Error('yt-dlp no creó el vídeo final.')
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
        console.log('[PLAY] Descarga de audio mediante API DVYER...')

        const apiKey = process.env.DVYER_API_KEY

        if (!apiKey) {
          throw new Error('DVYER_API_KEY no está configurada en .env')
        }

        const respuesta = await axios.get(
          'https://dv-yer-api.online/ytmp3',
          {
            params: {
              url: pendiente.url
            },
            headers: {
              'x-api-key': apiKey
            },
            timeout: 60000
          }
        )

        const datos = respuesta.data

        if (!datos?.ok || !datos?.download_url) {
          throw new Error(
            `API DVYER no devolvió un enlace de descarga: ${JSON.stringify(datos)}`
          )
        }

        console.log('[PLAY] DVYER respondió correctamente.')
        console.log('[PLAY] Descargando MP3 desde DVYER...')

        const audioResponse = await axios.get(
          datos.download_url,
          {
            responseType: 'arraybuffer',
            timeout: 120000,
            maxContentLength: 50 * 1024 * 1024,
            maxBodyLength: 50 * 1024 * 1024
          }
        )

        const bufferAudio = Buffer.from(audioResponse.data)

        if (!bufferAudio.length) {
          throw new Error('DVYER devolvió un archivo de audio vacío.')
        }

        await sock.sendMessage(
          chatId,
          {
            audio: bufferAudio,
            mimetype: 'audio/mpeg',
            fileName:
              `${limpiarNombre(datos.title || pendiente.title)}.mp3`,
            ptt: false
          },
          { quoted: m }
        )
      }

      console.log(
        `[LEVI] PLAY enviado correctamente (${esVideo ? 'Video' : 'Audio'})`
      )

    } catch (error) {
      console.error('[LEVI] ERROR selección PLAY:')
      console.error(error.stderr || error.message || error)

      await sock.sendMessage(
        chatId,
        {
          text:
            '❌ *No se pudo completar la descarga.*\n\n' +
            'El vídeo o audio no está disponible en un formato compatible.'
        },
        { quoted: m }
      )

    } finally {
      try {
        if (fs.existsSync(output)) {
          fs.unlinkSync(output)
        }
      } catch (errorLimpieza) {
        console.error(
          '[PLAY] No se pudo eliminar temporal:',
          errorLimpieza.message
        )
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
