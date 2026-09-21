import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  name: 'villancico',

  async execute(sock, m, args, enviar) {
    const api = 'https://api.freetouse.com/v3/music/tracks/search?query=christmas&limit=10'

    try {
      await enviar('🎄🎶 *Buscando un villancico navideño...*')

      const respuesta = await fetch(api)

      if (!respuesta.ok) {
        throw new Error(`API respondió ${respuesta.status}`)
      }

      const datos = await respuesta.json()
      const pistas = datos?.data || datos?.tracks || []

      if (!pistas.length) {
        return enviar('❌ No encontré villancicos disponibles en este momento.')
      }

      const disponibles = pistas.filter(pista =>
        pista?.is_premium === false &&
        (pista?.file?.mp3 || pista?.mp3_url || pista?.audio_url)
      )

      if (!disponibles.length) {
        return enviar('❌ No encontré un villancico gratuito disponible.')
      }

      const pista = disponibles[Math.floor(Math.random() * disponibles.length)]

      const audioUrl =
        pista.file?.mp3 ||
        pista.mp3_url ||
        pista.audio_url

      const titulo = pista.title || 'Villancico navideño'

      const carpeta = path.join(__dirname, '..', 'tmp')
      fs.mkdirSync(carpeta, { recursive: true })

      const archivo = path.join(
        carpeta,
        `villancico-${Date.now()}.mp3`
      )

      const audio = await fetch(audioUrl)

      if (!audio.ok) {
        throw new Error(`No se pudo descargar el audio (${audio.status})`)
      }

      const buffer = Buffer.from(await audio.arrayBuffer())
      fs.writeFileSync(archivo, buffer)

      await sock.sendMessage(
        m.key.remoteJid,
        {
          audio: {
            stream: fs.createReadStream(archivo)
          },
          mimetype: 'audio/mpeg',
          fileName: `${titulo.replace(/[\\/:*?"<>|]/g, '')}.mp3`,
          ptt: false
        },
        { quoted: m }
      )

      await enviar(`🎄🎶 *${titulo}*\n\n✨ ¡Disfruta tu villancico navideño!`)

      setTimeout(() => {
        try {
          if (fs.existsSync(archivo)) {
            fs.unlinkSync(archivo)
          }
        } catch {}
      }, 30000)

    } catch (error) {
      console.error('[VILLANCICO]', error)
      return enviar('❌ No pude obtener el villancico. Inténtalo de nuevo.')
    }
  }
}
