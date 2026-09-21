import fs from 'fs'

const filePath = './index.js'
let content = fs.readFileSync(filePath, 'utf-8')

const marker = 'const command = sock.commands?.get(commandName)'
const insertion = `

      const sender = m.sender || m.key?.participant || m.key?.remoteJid
      const ownerNumber = sock.user.id.split(':')[0].split('@')[0]
      const senderNumber = sender.split('@')[0]
      const publicCommands = ['auth', 'menu']

      if (senderNumber !== ownerNumber && !publicCommands.includes(commandName)) {
        const { isAuthorized } = await import('./authdb.js')
        if (!isAuthorized(sender, ownerNumber)) {
          return await sock.sendMessage(m.key.remoteJid, { text: 'No estas autorizado para usar este bot. Escribe /auth <contraseña> para activarlo.' }, { quoted: m })
        }
      }`

if (content.includes('publicCommands')) {
  console.log('Ya estaba aplicado, no se hicieron cambios.')
} else if (!content.includes(marker)) {
  console.log('No se encontro la linea marcadora. No se modifico nada.')
} else {
  content = content.replace(marker, marker + insertion)
  fs.writeFileSync(filePath, content)
  console.log('Cambio aplicado correctamente.')
}
