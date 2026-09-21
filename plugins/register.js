import { getDB, saveDB, getUser } from '../database.js'

export default {
  name: 'register',
  async execute(sock, m, args) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId

    const db = getDB()
    const user = getUser(db, sender)

    if (user.registrado) {
      return sock.sendMessage(chatId, { text: 'Ya te encuentras registrado en el sistema.' }, { quoted: m })
    }

    const input = args.join(' ')
    if (!input || !input.includes('.')) {
      return sock.sendMessage(chatId, { 
        text: '*Formato incorrecto.*\n\n' +
              'Usa el formato: `nombre.edad` o `nombre.edad.apellido`\n' +
              '• Ejemplos:\n' +
              '  ` /register Carlos.20 `\n' +
              '  ` /register Carlos.20.Gómez `'
      }, { quoted: m })
    }

    const [nombre, edadStr, ...resto] = input.split('.')
    const edad = parseInt(edadStr?.trim())
    const apellido = resto.join(' ').trim()

    if (!nombre || nombre.trim().length < 2) {
      return sock.sendMessage(chatId, { text: 'Escribe un nombre válido (mínimo 2 letras).' }, { quoted: m })
    }

    if (isNaN(edad) || edad < 5 || edad > 99) {
      return sock.sendMessage(chatId, { text: 'Ingresa una edad válida entre 5 y 99 años.' }, { quoted: m })
    }

    // Guardar datos
    user.registrado = true
    user.nombre = nombre.trim()
    user.edad = edad
    user.apellido = apellido ? apellido : ''
    saveDB(db)

    const nombreCompleto = user.apellido ? `${user.nombre} ${user.apellido}` : user.nombre

    const successText = `*¡REGISTRO EXITOSO!*\n\n` +
                        `• *Nombre:* ${nombreCompleto}\n` +
                        `• *Edad:* ${user.edad} años\n` +
                        `• *ID:* @${sender.split('@')[0]}`

    await sock.sendMessage(chatId, { text: successText, mentions: [sender] }, { quoted: m })
  }
}
