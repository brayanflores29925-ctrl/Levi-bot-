import fs from 'fs'
import path from 'path'
import { eliminarSubbot } from './subbotmanager.js'

const BASE = path.join(process.cwd(), 'data', 'subbots')

export function vigilarSubbot(sock, numero, carpeta, opciones = {}) {
  const {
    parentSock,
    grupo,
    usuario,
    onOpen,
    onClose
  } = opciones

  let confirmado = false

  function guardarEstado(estado, extra = {}) {
    try {
      fs.mkdirSync(carpeta, { recursive: true })

      fs.writeFileSync(
        path.join(carpeta, 'estado.json'),
        JSON.stringify({
          numero,
          estado,
          actualizado: new Date().toISOString(),
          ...extra
        }, null, 2)
      )
    } catch (error) {
      console.log(
        `[LEVI] Error guardando estado de Sub-Bot ${numero}: ${error.message}`
      )
    }
  }

  sock.ev.on('connection.update', async update => {
    const { connection, lastDisconnect } = update

    if (connection === 'open') {
      guardarEstado('activo', {
        conectado: new Date().toISOString()
      })

      if (onOpen) {
        onOpen()
      }

      if (!confirmado && parentSock && grupo) {
        confirmado = true

        const mencion =
          usuario && usuario.endsWith('@s.whatsapp.net')
            ? `@${usuario.split('@')[0]}`
            : ''

        try {
          await parentSock.sendMessage(grupo, {
            text:
              `🎉 *VINCULACIÓN EXITOSA*\n\n` +
              `${mencion}\n\n` +
              `Te has vinculado correctamente y felicidades, ya eres un *Sub-Bot*. 🤖`,
            mentions: mencion ? [usuario] : []
          })
        } catch (error) {
          console.log(
            `[LEVI] No se pudo enviar confirmación de Sub-Bot: ${error.message}`
          )
        }
      }

      return
    }

    if (connection === 'close') {
      guardarEstado('desconectado', {
        desconectado: new Date().toISOString()
      })

      console.log(
        `[LEVI] Sub-Bot ${numero} perdió la conexión. La sesión se conserva.`
      )

      if (onClose) {
        try {
          await onClose(lastDisconnect)
        } catch (error) {
          console.log(
            `[LEVI] Error en onClose de ${numero}: ${error.message}`
          )
        }
      }
    }
  })
}

export default {
  name: 'subbotconexion',
  execute() {}
}
