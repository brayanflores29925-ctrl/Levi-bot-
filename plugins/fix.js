import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

function ejecutar(comando) {
  return new Promise(resolve => {
    exec(comando, {
      cwd: process.cwd(),
      timeout: 10000,
      maxBuffer: 1024 * 1024
    }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        salida: (stdout || stderr || '').trim()
      })
    })
  })
}

export default {
  name: 'fix',

  async execute(sock, m, args, enviar) {
    const resultados = []

    try {
      const senderActual =
        m.sender ||
        m.key?.participant ||
        m.participant ||
        m.key?.remoteJid ||
        ''

      const numeroDetectado = String(senderActual)
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '')

      resultados.push(`🔎 Identificador: ${senderActual}`)
      resultados.push(`🔢 Número: ${numeroDetectado}`)

      const node = await ejecutar('node --version')
      resultados.push(
        node.ok
          ? `✅ Node.js: ${node.salida}`
          : `❌ Node.js: ${node.salida || 'error'}`
      )

      const npm = await ejecutar('npm --version')
      resultados.push(
        npm.ok
          ? `✅ npm: ${npm.salida}`
          : `❌ npm: ${npm.salida || 'error'}`
      )

      const git = await ejecutar('git --version')
      resultados.push(
        git.ok
          ? `✅ Git: ${git.salida}`
          : `❌ Git: ${git.salida || 'error'}`
      )

      const index = await ejecutar('node --check index.js')
      resultados.push(
        index.ok
          ? '✅ index.js: sin errores de sintaxis'
          : `❌ index.js: ${index.salida || 'error de sintaxis'}`
      )

      const fixCheck = await ejecutar('node --check plugins/fix.js')
      resultados.push(
        fixCheck.ok
          ? '✅ fix.js: sin errores de sintaxis'
          : `❌ fix.js: ${fixCheck.salida || 'error de sintaxis'}`
      )

      const pluginsDir = path.join(process.cwd(), 'plugins')
      let cantidadPlugins = 0

      if (fs.existsSync(pluginsDir)) {
        cantidadPlugins = fs
          .readdirSync(pluginsDir)
          .filter(nombre => nombre.endsWith('.js'))
          .length
      }

      resultados.push(`📦 Plugins encontrados: ${cantidadPlugins}`)

      const estado = await ejecutar('git status --short')

      resultados.push(
        estado.ok && !estado.salida
          ? '✅ Git: sin cambios locales'
          : estado.ok
            ? '⚠️ Git: hay cambios locales'
            : '⚠️ Git: no se pudo comprobar el estado'
      )

      const texto =
`🛠️ *LEVI-BOT FIX*

🔎 *DIAGNÓSTICO DEL SISTEMA*

${resultados.join('\n')}

━━━━━━━━━━━━━━━━━━━━
💡 /fix solo diagnostica.
No modifica ni elimina tus archivos.`

      return await enviar(texto)

    } catch (error) {
      return await enviar(
        `🛠️ *LEVI-BOT FIX*\n\n` +
        `⚠️ El diagnóstico encontró un problema:\n\n` +
        `${error?.message || 'Error desconocido'}`
      )
    }
  }
}
