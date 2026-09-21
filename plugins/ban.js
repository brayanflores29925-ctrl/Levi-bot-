import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'mensajes.json')

function cargar() {
  try {
    if (!fs.existsSync(FILE)) return {}
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

export default {
  name: 'ban',

  async execute(sock, m, parts) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ Este comando solo funciona en grupos.'
      })
    }

    const mencionados =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []

    const respondido =
      m.message?.extendedTextMessage?.contextInfo?.participant

    const usuario = mencionados[0] || respondido
    const cantidad = Number(parts?.[0])

    if (!usuario || !cantidad || cantidad < 1) {
      return sock.sendMessage(chatId, {
        text:
          '❌ Uso correcto:\\n\\n' +
          '/ban @usuario 5\\n' +
          '/ban @usuario 10\\n\\n' +
          'También puedes responder a un mensaje y usar:\\n' +
          '/ban 5'
      })
    }

    if (cantidad > 50) {
      return sock.sendMessage(chatId, {
        text: '❌ La cantidad máxima es 50 mensajes.'
      })
    }

    const data = cargar()
    const mensajes = data[chatId] || []

    const objetivos = mensajes
      .filter(x => x.sender === usuario)
      .slice(-cantidad)
      .reverse()

    if (!objetivos.length) {
      return sock.sendMessage(chatId, {
        text: '⚠️ No encontré mensajes registrados de esa persona.'
      })
    }

    let borrados = 0

    for (const mensaje of objetivos) {
      try {
        await sock.sendMessage(chatId, {
          delete: {
            remoteJid: chatId,
            fromMe: false,
            id: mensaje.id,
            participant: mensaje.sender
          }
        })

        borrados++
      } catch {}
    }

    await sock.sendMessage(chatId, {
      text: `🗑️ Se intentaron borrar ${borrados} de ${cantidad} mensajes de la persona mencionada.`
    })
  }
}
