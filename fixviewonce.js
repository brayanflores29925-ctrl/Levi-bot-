import fs from 'fs'

const filePath = './index.js'
let content = fs.readFileSync(filePath, 'utf-8')

const importLine = "import { manejarVistaUnica } from './viewonce.js'"
const marker = "if (!m?.message || m.key?.fromMe) return"
const insertion = `

      await manejarVistaUnica(sock, m)`

if (content.includes('manejarVistaUnica')) {
  console.log('Ya estaba aplicado, no se hicieron cambios.')
} else if (!content.includes(marker)) {
  console.log('No se encontro la linea marcadora. No se modifico nada.')
} else {
  content = importLine + '\n' + content
  content = content.replace(marker, marker + insertion)
  fs.writeFileSync(filePath, content)
  console.log('Cambio aplicado correctamente.')
}
