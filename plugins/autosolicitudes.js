const solicitudes = new Map()

const LIMITE = 100
const VENTANA = 15 * 60 * 1000

export default {
  name: 'autosolicitudes',

  async execute(sock, m, parts, enviar) {
    const chatId = m.chat || m.key?.remoteJid

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    const ahora = Date.now()

    let estado = solicitudes.get(chatId)

    if (!estado) {
      estado = {
        pendientes: [],
        tiempos: []
      }
      solicitudes.set(chatId, estado)
    }

    estado.tiempos = estado.tiempos.filter(
      t => ahora - t < VENTANA
    )

    const usadas = estado.tiempos.length
    const disponibles = Math.max(0, LIMITE - usadas)

    // Consultar directamente las solicitudes reales de WhatsApp
    try {
      const solicitudesReales =
        await sock.groupRequestParticipantsList(chatId)

      estado.pendientes = solicitudesReales
        .map(s => s.jid || s.participant || s.id)
        .filter(Boolean)
    } catch (error) {
      console.error(
        `[LEVI] Error consultando solicitudes pendientes:`,
        error.message
      )
    }

    const pendientes = estado.pendientes.length

    const cantidad = Number(parts?.[0])

    // Si no se indica cantidad, solo muestra el estado
    if (!parts?.[0]) {
      return enviar(
        '🤖 *AUTO-SOLICITUDES*\n\n' +
        `📥 Solicitudes pendientes: *${pendientes}*\n` +
        `✅ Aceptadas en los últimos 15 minutos: *${usadas}/${LIMITE}*\n` +
        `📊 Capacidad disponible: *${disponibles}*\n\n` +
        '💡 Para aceptar una cantidad escribe:\n' +
        '➜ */autosolicitudes 15*'
      )
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return enviar(
        '❌ Cantidad inválida.\n\n' +
        'Ejemplo: */autosolicitudes 15*'
      )
    }

    if (pendientes === 0) {
      return enviar(
        '📥 *No hay solicitudes pendientes.*'
      )
    }

    if (disponibles === 0) {
      return enviar(
        '⛔ *LÍMITE ALCANZADO*\n\n' +
        `Ya aceptaste *${LIMITE}/${LIMITE}* solicitudes en los últimos 15 minutos.`
      )
    }

    const cantidadAceptar = Math.min(
      cantidad,
      pendientes,
      disponibles
    )

    let aceptadas = 0

    for (let i = 0; i < cantidadAceptar; i++) {
      const participant = estado.pendientes.shift()

      if (!participant) break

      try {
        await sock.groupRequestParticipantsUpdate(
          chatId,
          [participant],
          'approve'
        )

        estado.tiempos.push(Date.now())
        aceptadas++

        console.log(
          `[LEVI] Solicitud aceptada: ${participant} | ${estado.tiempos.length}/${LIMITE}`
        )
      } catch (error) {
        console.error(
          `[LEVI] Error aceptando solicitud de ${participant}:`,
          error.message
        )

        // Si falló, vuelve a dejarla pendiente
        estado.pendientes.unshift(participant)
      }
    }

    return enviar(
      '🤖 *AUTO-SOLICITUDES*\n\n' +
      `✅ Solicitudes aceptadas: *${aceptadas}*\n` +
      `📥 Solicitudes pendientes: *${estado.pendientes.length}*\n` +
      `📊 Límite usado: *${estado.tiempos.length}/${LIMITE}*`
    )
  },

  async manejarSolicitud(sock, evento) {
    const { id, participant, action } = evento

    if (action !== 'created') return
    if (!id?.endsWith('@g.us') || !participant) return

    let estado = solicitudes.get(id)

    if (!estado) {
      estado = {
        pendientes: [],
        tiempos: []
      }

      solicitudes.set(id, estado)
    }

    if (!estado.pendientes.includes(participant)) {
      estado.pendientes.push(participant)

      console.log(
        `[LEVI] Nueva solicitud pendiente: ${participant} | Total: ${estado.pendientes.length}`
      )
    }
  }
}
