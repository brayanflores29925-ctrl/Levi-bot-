import fs from 'fs'

const filePath = './plugins/menu.js'
let content = fs.readFileSync(filePath, 'utf-8')

if (content.includes('menufoto.jpg')) {
  console.log('Ya estaba aplicado.')
} else {
  content = content.replace(
    "import fs from 'fs'\n\n",
    ""
  )
  content = "import fs from 'fs'\nimport path from 'path'\nimport { fileURLToPath } from 'url'\n\nconst __dirname = path.dirname(fileURLToPath(import.meta.url))\n\n" + content

  content = content.replace(
    "await sock.sendMessage(chatId, { text: texto, mentions: [sender] }, { quoted: m })",
    `const fotoPath = path.join(__dirname, '..', 'menufoto.jpg')
    if (fs.existsSync(fotoPath)) {
      await sock.sendMessage(chatId, { image: fs.readFileSync(fotoPath), caption: texto, mentions: [sender] }, { quoted: m })
    } else {
      await sock.sendMessage(chatId, { text: texto, mentions: [sender] }, { quoted: m })
    }`
  )

  fs.writeFileSync(filePath, content)
  console.log('Cambio aplicado correctamente.')
}
