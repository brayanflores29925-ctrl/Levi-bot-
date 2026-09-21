import axios from 'axios'

export default {
  name: 'clima',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const ciudad = parts?.join(' ').trim()

    if (!ciudad) {
      return sock.sendMessage(chatId, {
        text: '🌤️ Escribe una ciudad.\n\nEjemplo:\n/clima San Pedro Sula'
      })
    }

    try {
      const geo = await axios.get(
        'https://geocoding-api.open-meteo.com/v1/search',
        {
          params: {
            name: ciudad,
            count: 1,
            language: 'es',
            format: 'json'
          },
          timeout: 15000
        }
      )

      const lugar = geo.data?.results?.[0]

      if (!lugar) {
        return sock.sendMessage(chatId, {
          text: '❌ No encontré esa ciudad.'
        })
      }

      const clima = await axios.get(
        'https://api.open-meteo.com/v1/forecast',
        {
          params: {
            latitude: lugar.latitude,
            longitude: lugar.longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
            timezone: 'auto'
          },
          timeout: 15000
        }
      )

      const actual = clima.data?.current

      if (!actual) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener el clima.'
        })
      }

      const estados = {
        0: '☀️ Despejado',
        1: '🌤️ Mayormente despejado',
        2: '⛅ Parcialmente nublado',
        3: '☁️ Nublado',
        45: '🌫️ Niebla',
        48: '🌫️ Niebla',
        51: '🌦️ Llovizna',
        53: '🌦️ Llovizna',
        55: '🌧️ Llovizna intensa',
        61: '🌧️ Lluvia',
        63: '🌧️ Lluvia moderada',
        65: '🌧️ Lluvia intensa',
        80: '🌦️ Chubascos',
        81: '🌧️ Chubascos moderados',
        82: '⛈️ Chubascos fuertes',
        95: '⛈️ Tormenta'
      }

      const estado = estados[actual.weather_code] || '🌡️ Condición desconocida'

      await sock.sendMessage(chatId, {
        text:
          `🌤️ *CLIMA*\n\n` +
          `📍 *${lugar.name}, ${lugar.country}*\n\n` +
          `${estado}\n` +
          `🌡️ Temperatura: *${actual.temperature_2m} °C*\n` +
          `🤚 Sensación: *${actual.apparent_temperature} °C*\n` +
          `💧 Humedad: *${actual.relative_humidity_2m}%*\n` +
          `💨 Viento: *${actual.wind_speed_10m} km/h*`
      })

    } catch (error) {
      console.error('Error en /clima:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /clima:\n${error.message}`
      })
    }
  }
}
