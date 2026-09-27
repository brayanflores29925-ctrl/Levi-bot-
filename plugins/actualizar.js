import { OWNER_NUMBER } from '../config.js'
import { exec } from 'child_process'

function ejecutar(comando) {
  return new Promise((resolve, reject) => {
    exec(comando, { cwd: process.cwd(), maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message))
        return
      }

      resolve(stdout.trim())
    })
  })
}

export default {
  name: 'actualizar',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''

    const numero = sender
      .split('@')[0]
      .replace(/\D/g, '')

    if (!numero.endsWith(OWNER_NUMBER)) {
      return await sock.sendMessage(chatId, {
        text: '❌ *ACCESO DENEGADO*\n\nEste comando es exclusivo del OWNER de LeviBot.'
      }, { quoted: m })
    }

    try {
      await sock.sendMessage(chatId, {
        text: '🔄 *ACTUALIZANDO LEVIBOT...*\n\n🔎 Comprobando cambios en GitHub...'
      }, { quoted: m })

      const cambios = await ejecutar('git status --short')

      if (cambios) {
        return await sock.sendMessage(chatId, {
          text:
`⚠️ *ACTUALIZACIÓN DETENIDA*

LeviBot tiene cambios locales pendientes.

No haré el "git pull" para evitar sobrescribir tus modificaciones.

📌 Primero guarda o sube tus cambios a GitHub y después vuelve a usar:
👉 /actualizar`
        }, { quoted: m })
      }

      await ejecutar('git fetch origin main')

      const pendientes = await ejecutar('git rev-list --count HEAD..origin/main')

      if (pendientes === '0') {
        return await sock.sendMessage(chatId, {
          text: '✅ *LEVIBOT YA ESTÁ ACTUALIZADO*\n\nNo hay nuevas versiones disponibles.'
        }, { quoted: m })
      }

      await sock.sendMessage(chatId, {
        text: `📥 *NUEVA ACTUALIZACIÓN ENCONTRADA*\n\nHay ${pendientes} actualización(es).\n\n⏳ Descargando...`
      }, { quoted: m })

      await ejecutar('git pull --ff-only origin main')
      await ejecutar('npm install')
      await ejecutar('node --check index.js')

      await sock.sendMessage(chatId, {
        text:
`✅ *LEVIBOT ACTUALIZADO*

📥 Cambios descargados: ${pendientes}
📦 Dependencias actualizadas.
🔎 Código comprobado correctamente.

🔄 Reiniciando LeviBot...`
      }, { quoted: m })

      setTimeout(() => {
        try {
          if (sock.ws?.close) {
            sock.ws.close()
          } else if (sock.end) {
            sock.end(new Error('Actualización solicitada por el OWNER'))
          }
        } catch {}
      }, 2000)

    } catch (error) {
      await sock.sendMessage(chatId, {
        text:
`❌ *ERROR AL ACTUALIZAR*

No se pudo completar la actualización.

📋 Error:
${error.message}`
      }, { quoted: m })
    }
  }
}
