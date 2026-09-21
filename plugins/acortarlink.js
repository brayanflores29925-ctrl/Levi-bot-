import axios from 'axios'

export default {
  name: 'acortarlink',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid
    const url = parts?.join(' ').trim()

    if (!url) {
      return sock.sendMessage(chatId, {
        text: '🔗 Envía un enlace para acortarlo.\n\nEjemplo:\n/acortarlink https://www.google.com'
      })
    }

    if (!/^https?:\/\//i.test(url)) {
      return sock.sendMessage(chatId, {
        text: '❌ El enlace debe comenzar con http:// o https://'
      })
    }

    try {
      const respuesta = await axios.get(
        'https://tinyurl.com/api-create.php',
        {
          params: { url },
          timeout: 15000
        }
      )

      const corto = String(respuesta.data || '').trim()

      if (!/^https?:\/\//i.test(corto)) {
        return sock.sendMessage(chatId, {
          text: '❌ No pude acortar ese enlace.'
        })
      }

      await sock.sendMessage(chatId, {
        text:
          `🔗 *ENLACE ACORTADO*\n\n` +
          `📎 Original:\n${url}\n\n` +
          `✅ Acortado:\n${corto}`
      })

    } catch (error) {
      console.error('Error en /acortarlink:', error)

      await sock.sendMessage(chatId, {
        text: `❌ Error en /acortarlink:\n${error.message}`
      })
    }
  }
}
