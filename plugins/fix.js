import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

function ejecutar(comando) {
  return new Promise(resolve => {
    exec(comando, { cwd: process.cwd(), timeout: 10000 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        salida: (stdout || stderr || '').trim()
      })
    })
  })
}

export default {
  name: 'fix',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid

    const resultados = []

    const senderActual = m.sender || m.key?.participant || m.participant || m.key?.remoteJid || ''
    const numeroDetectado = String(senderActual).split('@')[0].split(':')[0].replace(/\D/g, '')
    resultados.push(`🔎 Identificador detectado: ${senderActual}`)
    resultados.push(`🔢 Número detectado: ${numeroDetectado}`)

    // Node.js
    const node = await ejecutar('node --version')
    resultados.push(node.ok ? `✅ Node.js: ${node.salida}` : '❌ Node.js: error')

    // npm
    const npm = await ejecutar('npm --version')
    resultados.push(npm.ok ? `✅ npm: ${npm.salida}` : '❌ npm: error')

    // Git
    const git = await ejecutar('git --version')
    resultados.push(git.ok ? `✅ Git: ${git.salida}` : '❌ Git: error')

    // index.js
    const index = await ejecutar('node --check index.js')
    resultados.push(
      index.ok
        ? '✅ index.js: sin errores de sintaxis'
        : '❌ index.js: tiene un error de sintaxis'
    )

    // plugins
    const pluginsDir = path.join(process.cwd(), 'plugins')
    let cantidadPlugins = 0

    if (fs.existsSync(pluginsDir)) {
      cantidadPlugins = fs
        .readdirSync(pluginsDir)
        .filter(nombre => nombre.endsWith('.js'))
        .length
    }

    resultados.push(`📦 Plugins encontrados: ${cantidadPlugins}`)

    // Git status
    const estado = await ejecutar('git status --short')
    resultados.push(
      estado.ok && !estado.salida
        ? '✅ Git: sin cambios locales'
        : '⚠️ Git: hay cambios locales'
    )

    const texto =
`🛠️ *LEVI-BOT FIX*

🔎 *DIAGNÓSTICO DEL SISTEMA*

${resultados.join('\n')}

━━━━━━━━━━━━━━━━━━━━
💡 /fix solo diagnostica.
No modifica ni elimina tus archivos.`

    await sock.sendMessage(chatId, {
      text
    }, { quoted: m })
  }
}
