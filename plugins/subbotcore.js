import fs from 'fs'
import path from 'path'
import { isAuthorized } from '../authdb.js'
import { OWNER_NUMBER } from '../config.js'

const PLUGINS_PATH = path.join(process.cwd(), 'plugins')
const PREFIXES = ['.', '!', '#', '/']
const GRUPO_OFICIAL = '120363405079498012@g.us'

export async function cargarComandosSubbot(sock) {
  sock.commands = new Map()

  const files = fs.readdirSync(PLUGINS_PATH)
    .filter(file => file.endsWith('.js'))
    .filter(file => ![
      'subbotcore.js',
      'subbotconexion.js',
      'subbotmanager.js'
    ].includes(file))

  for (const file of files) {
    try {
      const modulo = await import(
        `file://${path.join(PLUGINS_PATH, file)}?subbot=${Date.now()}`
      )

      const command = modulo.default

      if (!command?.name || typeof command.execute !== 'function') continue

      const nombres = Array.isArray(command.name)
        ? command.name
        : [command.name]

      for (const nombre of nombres) {
        sock.commands.set(nombre.toLowerCase(), command)
      }

      if (Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
          sock.commands.set(alias.toLowerCase(), command)
        }
      }
    } catch {}
  }
}

export function activarComandosSubbot(sock) {
  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const m = messages?.[0]

      if (!m?.message || m.key?.fromMe) return

      const chatId = m.key?.remoteJid

      if (chatId?.endsWith('@g.us')) {
        if (!sock.subbotIdentidades) {
          sock.subbotIdentidades = new Set()
        }

        if (!sock.subbotIdentidades.has(chatId)) {
          sock.subbotIdentidades.add(chatId)

          if (chatId === GRUPO_OFICIAL) {
            await sock.sendMessage(chatId, {
              text:
                '⭐ *GRUPO OFICIAL DE LEVIBOTS*\\n\\n' +
                '🤖 LeviBot está presente en su grupo oficial.'
            })
          } else {
            await sock.sendMessage(chatId, {
              text:
                '🤖 *SUB-BOT DE LEVIBOT*\\n\\n' +
                '✅ Este número está conectado como Sub-Bot de LeviBot.'
            })
          }
        }
      }

      let text =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        m.message.imageMessage?.caption ||
        m.message.videoMessage?.caption ||
        ''

      if (!text) return

      const prefix = PREFIXES.find(p => text.startsWith(p))

      if (!prefix) return

      const body = text.slice(prefix.length).trim()

      if (!body) return

      const parts = body.split(/\s+/)
      const commandName = parts.shift()?.toLowerCase()

      if (!commandName) return

      const command = sock.commands?.get(commandName)

      if (!command) return

      // 🔐 Bloqueo de Sub-Bots no autorizados
      // /auth queda permitido para poder introducir el código.
      if (chatId?.endsWith('@g.us') && commandName !== 'auth') {
        const botId = sock.user?.id

        if (!botId) return

        const botNumber = botId
          .split('@')[0]
          .split(':')[0]

        const ownerNumber = String(OWNER_NUMBER).replace(/\\D/g, '')

        if (!isAuthorized(botNumber + '@s.whatsapp.net', ownerNumber)) {
          const mensaje =
            '🔐 *LEVI BOT — ACCESO NO AUTORIZADO*\\n\\n' +
            '❌ Este Sub-Bot no está autorizado para usar LeviBot en este grupo.\\n\\n' +
            '📞 Ponte en contacto con el administrador del grupo oficial para solicitar autorización.'

          if (commandName === 'menu') {
            await enviar(mensaje)
          }

          return
        }
      }

      const enviar = (message, options = {}) => {
        return sock.sendMessage(
          m.key.remoteJid,
          { text: message, ...options },
          { quoted: m }
        )
      }

      await command.execute(sock, m, parts, enviar)

    } catch (error) {
      console.log(
        `[LEVI] Error en Sub-bot: ${error.message}`
      )
    }
  })
}
