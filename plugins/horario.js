import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'horarios.json')

export default {
  name: 'horario',

  async execute(sock, m, parts, enviar) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    try {
      const metadata = await sock.groupMetadata(chatId)
      const participante = metadata.participants.find(p => p.id === sender)

      const esAdmin =
        participante?.admin === 'admin' ||
        participante?.admin === 'superadmin'

      if (!esAdmin) {
        return enviar('❌ Solo los administradores pueden configurar el horario.')
      }

      const horaAbrir = parts[0]
      const horaCerrar = parts[1]

      if (!horaAbrir || !horaCerrar) {
        return enviar(
          '⏰ *HORARIO*\n\n' +
          'Usa:\n' +
          '/horario 17:00 19:00\n\n' +
          '🟢 17:00 = abrir\n' +
          '🔴 19:00 = cerrar'
        )
      }

      const formato = /^([01]\d|2[0-3]):([0-5]\d)$/

      if (!formato.test(horaAbrir) || !formato.test(horaCerrar)) {
        return enviar(
          '❌ Hora incorrecta.\n\n' +
          'Ejemplo:\n' +
          '/horario 17:00 19:00'
        )
      }

      let horarios = {}

      try {
        if (fs.existsSync(DATA_PATH)) {
          horarios = JSON.parse(
            fs.readFileSync(DATA_PATH, 'utf8') || '{}'
          )
        }
      } catch {
        horarios = {}
      }

      horarios[chatId] = {
        apertura: horaAbrir,
        cierre: horaCerrar
      }

      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })

      fs.writeFileSync(
        DATA_PATH,
        JSON.stringify(horarios, null, 2)
      )

      return enviar(
        '✅ *HORARIO GUARDADO*\n\n' +
        `🟢 Apertura: ${horaAbrir}\n` +
        `🔴 Cierre: ${horaCerrar}\n\n` +
        '⚙️ Este horario pertenece solamente a este grupo.'
      )

    } catch (error) {
      return enviar(`❌ No se pudo guardar el horario: ${error.message}`)
    }
  }
}
