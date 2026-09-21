import axios from 'axios'

export default {
  name: 'mareas',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const lugar = parts?.join(' ').trim()

    if (!lugar) {
      return sock.sendMessage(chatId, {
        text: '🌊 Escribe una ubicación costera.\n\nEjemplo:\n/mareas Puerto Cortés'
      })
    }

    try {
      const geo = await axios.get(
        'https://geocoding-api.open-meteo.com/v1/search',
        {
          params: {
            name: lugar,
            count: 1,
            language: 'es',
            format: 'json'
          },
          timeout: 15000
        }
      )

      const ubicacion = geo.data?.results?.[0]

      if (!ubicacion) {
        return sock.sendMessage(chatId, {
          text: '❌ No encontré esa ubicación.'
        })
      }

      const respuesta = await axios.get(
        'https://tideturtle.com/api/v1/tides',
        {
          params: {
            lat: ubicacion.latitude,
            lon: ubicacion.longitude
          },
          timeout: 20000
        }
      )

      const datos = respuesta.data

      if (!datos) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener los datos de mareas.'
        })
      }

      const sitio = datos.place || datos.location || {}
      const mareas = datos.tides || datos.extrema || []

      let texto = `🌊 *MAREAS*\n\n📍 *${sitio.name || ubicacion.name}*\n\n`

      if (Array.isArray(mareas) && mareas.length) {
        texto += mareas.slice(0, 6).map((t) => {
          const tipo = t.type || t.kind || 'Marea'
          const hora = t.time || t.datetime || '--'
          const altura = t.height ?? t.level ?? '--'
          return `🌊 ${tipo}: *${hora}* — ${altura} m`
        }).join('\n')
      } else {
        texto += 'ℹ️ No encontré próximas mareas en la respuesta.'
      }

      await sock.sendMessage(chatId, {
        text: texto
      })

    } catch (error) {
      console.error('Error en /mareas:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /mareas:\n${error.message}`
      })
    }
  }
}
