import ytSearch from 'yt-search'

export default {
  name: 'ytsearch',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const busqueda = parts?.join(' ').trim()

    if (!busqueda) {
      return sock.sendMessage(chatId, {
        text: '❌ Escribe lo que quieres buscar.\n\nEjemplo: /ytsearch Feliz Navidad'
      })
    }

    await sock.sendMessage(chatId, {
      text: `🔎 Buscando en YouTube: *${busqueda}*...`
    })

    try {
      const resultado = await ytSearch(busqueda)
      const videos = resultado.videos?.slice(0, 5)

      if (!videos?.length) {
        return sock.sendMessage(chatId, {
          text: '❌ No encontré resultados.'
        })
      }

      let texto = '🔎 *RESULTADOS DE YOUTUBE*\n\n'

      videos.forEach((video, i) => {
        texto +=
          `*${i + 1}.* ${video.title}\n` +
          `👤 ${video.author?.name || 'Desconocido'}\n` +
          `⏱️ ${video.timestamp || 'N/A'}\n` +
          `🔗 ${video.url}\n\n`
      })

      await sock.sendMessage(chatId, { text: texto })

    } catch (error) {
      console.error('Error en /ytsearch:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /ytsearch: ${error.message}`
      })
    }
  }
}
