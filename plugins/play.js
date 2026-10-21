import ytSearch from 'yt-search'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const execFileAsync = promisify(execFile)
const TEMP_DIR = path.join(process.cwd(), 'temp')
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })

function limpiarNombre(nombre) {
  return nombre.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80)
}

export default {
  name: 'play',
  aliases: ['yt', 'song', 'musica'],

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const busqueda = parts.join(' ').trim()
    if (!busqueda) return enviar('⚠️ Usa: *.play nombre de la canción*')

    try {
      await sock.sendMessage(chatId, { text: `🔎 Buscando *${busqueda}*...` }, { quoted: m })
      
      const { videos } = await ytSearch(busqueda)
      const video = videos?.[0]
      if (!video) return enviar('❌ Sin resultados.')

      await sock.sendMessage(chatId, { text: `⏳ Descargando *${video.title}*...` }, { quoted: m })

      const id = Date.now()
      const output = path.join(TEMP_DIR, `play-${id}.mp3`)
      let bufferAudio

      // INTENTO 1: API DVYER (más rápido)
      try {
        const apiKey = process.env.DVYER_API_KEY
        if (!apiKey) throw new Error('no key')
        
        const { data } = await axios.get('https://dv-yer-api.online/ytmp3', {
          params: { url: video.url },
          headers: { 'x-api-key': apiKey },
          timeout: 60000
        })

        if (data?.ok && data?.download_url) {
          const res = await axios.get(data.download_url, { responseType: 'arraybuffer', timeout: 120000 })
          bufferAudio = Buffer.from(res.data)
        }
      } catch (e) {
        console.log('[PLAY] DVYER falló, usando yt-dlp...')
      }

      // INTENTO 2: yt-dlp si falla DVYER
      if (!bufferAudio || !bufferAudio.length) {
        const tempOut = path.join(TEMP_DIR, `play-${id}.%(ext)s`)
        await execFileAsync('yt-dlp', [
          '--no-playlist', '-x', '--audio-format', 'mp3', '--audio-quality', '0',
          '-o', tempOut, video.url
        ], { timeout: 300000 })

        // buscar el archivo creado
        const file = fs.readdirSync(TEMP_DIR).find(f => f.startsWith(`play-${id}.`) && f.endsWith('.mp3'))
        if (!file) throw new Error('No se creó mp3')
        bufferAudio = fs.readFileSync(path.join(TEMP_DIR, file))
        try { fs.unlinkSync(path.join(TEMP_DIR, file)) } catch {}
      }

      if (!bufferAudio?.length) throw new Error('Audio vacío')

      // ENVÍO DIRECTO COMO AUDIO
      await sock.sendMessage(chatId, {
        audio: bufferAudio,
        mimetype: 'audio/mpeg',
        fileName: `${limpiarNombre(video.title)}.mp3`,
        ptt: false
      }, { quoted: m })

      // Si quieres que llegue como documento también (más seguro), usa esto en vez del de arriba:
      // await sock.sendMessage(chatId, { document: bufferAudio, mimetype: 'audio/mpeg', fileName: `${limpiarNombre(video.title)}.mp3` }, { quoted: m })

      try { if (fs.existsSync(output)) fs.unlinkSync(output) } catch {}

    } catch (e) {
      console.error('[PLAY]', e.message || e)
      await sock.sendMessage(chatId, { text: '❌ No se pudo descargar el audio.' }, { quoted: m })
    }
  }
          }
