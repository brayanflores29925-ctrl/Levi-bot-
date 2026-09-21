import axios from 'axios'

export default {
  name: 'horoscopo',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const signo = parts?.join(' ').trim().toLowerCase()

    const signos = {
      aries: 'aries',
      tauro: 'taurus',
      géminis: 'gemini',
      geminis: 'gemini',
      cáncer: 'cancer',
      cancer: 'cancer',
      leo: 'leo',
      virgo: 'virgo',
      libra: 'libra',
      escorpio: 'scorpio',
      sagitario: 'sagittarius',
      capricornio: 'capricorn',
      acuario: 'aquarius',
      piscis: 'pisces'
    }

    if (!signo || !signos[signo]) {
      return sock.sendMessage(chatId, {
        text:
          '🔮 *HORÓSCOPO*\n\n' +
          'Escribe tu signo.\n\n' +
          'Ejemplo:\n/horoscopo aries\n\n' +
          '♈ Aries\n' +
          '♉ Tauro\n' +
          '♊ Géminis\n' +
          '♋ Cáncer\n' +
          '♌ Leo\n' +
          '♍ Virgo\n' +
          '♎ Libra\n' +
          '♏ Escorpio\n' +
          '♐ Sagitario\n' +
          '♑ Capricornio\n' +
          '♒ Acuario\n' +
          '♓ Piscis'
      })
    }

    try {
      const respuesta = await axios.get(
        `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily`,
        {
          params: {
            sign: signos[signo],
            day: 'TODAY'
          },
          timeout: 20000
        }
      )

      const datos = respuesta.data?.data

      if (!datos?.horoscope_data) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude obtener el horóscopo en este momento.'
        })
      }

      await sock.sendMessage(chatId, {
        text:
          `🔮 *HORÓSCOPO DE HOY*\n\n` +
          `♈ Signo: *${signo.charAt(0).toUpperCase() + signo.slice(1)}*\n\n` +
          `${datos.horoscope_data}`
      })

    } catch (error) {
      console.error('Error en /horoscopo:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /horoscopo:\n${error.message}`
      })
    }
  }
}
