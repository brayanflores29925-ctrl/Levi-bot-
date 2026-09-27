import fs from 'fs'
import path from 'path'
import pino from 'pino'
import * as Baileys from '@whiskeysockets/baileys'
import { obtenerSubbotsActivos } from './subbotmanager.js'
import { cargarComandosSubbot, activarComandosSubbot } from './subbotcore.js'

const makeWASocket =
  typeof Baileys.default === 'function'
    ? Baileys.default
    : Baileys.makeWASocket

const useMultiFileAuthState =
  Baileys.useMultiFileAuthState ||
  Baileys.default?.useMultiFileAuthState

const Browsers =
  Baileys.Browsers ||
  Baileys.default?.Browsers

const BASE = path.join(process.cwd(), 'data', 'subbots')

export async function iniciarSubbotsGuardados() {
  const subbots = obtenerSubbotsActivos()

  if (!subbots.length) {
    console.log('[LEVI SUBBOTS] No hay Sub-Bots activos para reconectar.')
    return
  }

  console.log(
    `[LEVI SUBBOTS] Reconectando ${subbots.length} Sub-Bot(s)...`
  )

  for (const subbot of subbots) {
    const numero = subbot.numero
    const carpeta = path.join(BASE, numero)

    try {
      if (!fs.existsSync(path.join(carpeta, 'creds.json'))) {
        console.log(
          `[LEVI SUBBOTS] Sesión no encontrada para ${numero}.`
        )
        continue
      }

      const { state, saveCreds } =
        await useMultiFileAuthState(carpeta)

      const opciones = {
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        markOnlineOnConnect: false
      }

      if (Browsers) {
        opciones.browser = Browsers.ubuntu('Chrome')
      }

      const subSock = makeWASocket(opciones)

      subSock.ev.on('creds.update', saveCreds)

      await cargarComandosSubbot(subSock)
      activarComandosSubbot(subSock)

      subSock.ev.on('connection.update', update => {
        if (update.connection === 'open') {
          console.log(
            `[LEVI SUBBOTS] Sub-Bot ${numero} conectado correctamente.`
          )
        }

        if (update.connection === 'close') {
          console.log(
            `[LEVI SUBBOTS] Sub-Bot ${numero} perdió la conexión.`
          )
        }
      })

    } catch (error) {
      console.log(
        `[LEVI SUBBOTS] Error reconectando ${numero}: ${error.message}`
      )
    }
  }
}

export default {
  name: 'subbotarranque',
  execute() {}
}
