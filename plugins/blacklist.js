import { getDB, saveDB } from '../database.js'
import { OWNER_NUMBER } from '../config.js'

function limpiarJid(valor = '') {
  return String(valor).split('@')[0].split(':')[0].replace(/\D/g, '')
}

function esOwner(jid = '') {
  const numero = limpiarJid(jid)
  return numero === OWNER_NUMBER || numero.endsWith(OWNER_NUMBER)
}

function obtenerObjetivo(m, args) {
  const mencionado =
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

  if (mencionado) return mencionado

  const texto = args.join(' ').trim()

  if (!texto) return null

  const numero = limpiarJid(texto)

  if (numero.length >= 7) {
    return `${numero}@s.whatsapp.net`
  }

  return null
}

export default {
  name: 'blacklist',

  async execute(sock, m, args, enviar) {
    const sender = m.key?.participant || m.participant || m.key?.remoteJid

    if (!esOwner(sender)) {
      return enviar('🚫 *ACCESO DENEGADO*\\n\\nSolo el dueño de LeviBots puede administrar la lista negra.')
    }

    const db = getDB()

    if (!Array.isArray(db.blacklist)) {
      db.blacklist = []
    }

    const accion = (args[0] || '').toLowerCase()

    // 📋 Mostrar lista
    if (!accion) {
      if (db.blacklist.length === 0) {
        return enviar(
          '🛡️ *LISTA NEGRA LEVIBOTS*\\n\\n' +
          '✅ No hay usuarios bloqueados.'
        )
      }

      const lista = db.blacklist
        .map((jid, i) => `${i + 1}. @${limpiarJid(jid)}`)
        .join('\\n')

      return enviar(
        '🚫 *LISTA NEGRA LEVIBOTS*\\n\\n' +
        lista
      )
    }

    // 🚫 Bloquear
    if (accion === 'agregar' || accion === 'add' || accion === 'bloquear') {
      const objetivo = obtenerObjetivo(m, args.slice(1))

      if (!objetivo) {
        return enviar(
          '⚠️ *FALTA EL USUARIO*\\n\\n' +
          'Usa:\\n' +
          '`.blacklist agregar @usuario`'
        )
      }

      if (esOwner(objetivo)) {
        return enviar('👑 No puedes agregar al dueño a la lista negra.')
      }

      if (db.blacklist.includes(objetivo)) {
        return enviar('⚠️ Ese usuario ya está en la lista negra.')
      }

      db.blacklist.push(objetivo)
      saveDB(db)

      return enviar(
        `🚫 *USUARIO BLOQUEADO*\\n\\n` +
        `👤 @${limpiarJid(objetivo)}\\n\\n` +
        `🛡️ Ya no podrá utilizar los comandos de LeviBots.`
      )
    }

    // ✅ Desbloquear
    if (
      accion === 'quitar' ||
      accion === 'remove' ||
      accion === 'desbloquear'
    ) {
      const objetivo = obtenerObjetivo(m, args.slice(1))

      if (!objetivo) {
        return enviar(
          '⚠️ *FALTA EL USUARIO*\\n\\n' +
          'Usa:\\n' +
          '`.blacklist quitar @usuario`'
        )
      }

      const posicion = db.blacklist.indexOf(objetivo)

      if (posicion === -1) {
        return enviar('ℹ️ Ese usuario no está en la lista negra.')
      }

      db.blacklist.splice(posicion, 1)
      saveDB(db)

      return enviar(
        `✅ *USUARIO DESBLOQUEADO*\\n\\n` +
        `👤 @${limpiarJid(objetivo)}\\n\\n` +
        `Ya puede volver a utilizar LeviBots.`
      )
    }

    return enviar(
      '🛡️ *LISTA NEGRA LEVIBOTS*\\n\\n' +
      '📋 `.blacklist` → Ver lista\\n' +
      '🚫 `.blacklist agregar @usuario` → Bloquear\\n' +
      '✅ `.blacklist quitar @usuario` → Desbloquear'
    )
  }
}
