export default {
  name: 'versiculo',
  command: ['versiculo'],
  category: 'Biblia',
  description: '📖 Muestra un versículo bíblico.',
  async execute(sock, m) {
    const versiculos = [
      'Juan 3:16 — Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, mas tenga vida eterna.',
      'Salmos 23:1 — Jehová es mi pastor; nada me faltará.',
      'Filipenses 4:13 — Todo lo puedo en Cristo que me fortalece.',
      'Jeremías 29:11 — Porque yo sé los pensamientos que tengo acerca de vosotros, pensamientos de paz, y no de mal.',
      'Proverbios 3:5 — Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.'
    ]

    const versiculo = versiculos[Math.floor(Math.random() * versiculos.length)]

    await sock.sendMessage(m.key.remoteJid, {
      text: `✝️ *VERSÍCULO DEL DÍA* 📖\n\n${versiculo}\n\n🙏 Que Dios te bendiga.`
    }, { quoted: m })
  }
}
