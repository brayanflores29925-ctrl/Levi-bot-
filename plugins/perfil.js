import { getDB, getUser } from '../database.js'

export default {
  name: 'perfil',
  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const sender = m.sender || m.key?.participant || chatId
    const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender

    const db = getDB()
    const user = getUser(db, target)

    const parejaText = user.pareja ? `@${user.pareja.split('@')[0]}` : 'Soltero/a'
    const nombreCompleto = user.apellido ? `${user.nombre} ${user.apellido}` : user.nombre
    const estadoRegistro = user.registrado ? 'Registrado' : 'No registrado (`/register`)'

    const perfilText = `*PERFIL DE USUARIO*\n\n` +
                       `• *Nombre:* ${nombreCompleto}\n` +
                       `• *Edad:* ${user.edad}\n` +
                       `• *Estado:* ${estadoRegistro}\n` +
                       `• *Género:* ${user.genero}\n` +
                       `• *Cumpleaños:* ${user.cumple}\n` +
                       `• *Pareja:* ${parejaText}\n` +
                       `• *Descripción:* ${user.desc}`

    const mentions = [target]
    if (user.pareja) mentions.push(user.pareja)

    await sock.sendMessage(chatId, { text: perfilText, mentions }, { quoted: m })
  }
}
