const registros = new Map()

const LIMITE = 10
const VENTANA = 15 * 60 * 1000

export default {
  name: 'antispamcomandos',

  async execute(sock, m, parts, enviar) {
    return
  },

  puedeUsar(chatId, usuario) {
    if (!chatId || !usuario) return { permitido: true }

    const clave = `${chatId}:${usuario}`
    const ahora = Date.now()

    let registro = registros.get(clave)

    if (!registro) {
      registro = []
      registros.set(clave, registro)
    }

    registro = registro.filter(tiempo => ahora - tiempo < VENTANA)
    registros.set(clave, registro)

    if (registro.length >= LIMITE) {
      const restante = VENTANA - (ahora - registro[0])

      return {
        permitido: false,
        restante
      }
    }

    registro.push(ahora)

    return {
      permitido: true,
      usados: registro.length,
      restantes: LIMITE - registro.length
    }
  }
}
