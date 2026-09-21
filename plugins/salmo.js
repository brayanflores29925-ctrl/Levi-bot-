export default {
  name: 'salmo',
  aliases: [],
  description: '📜 Muestra un salmo.',
  category: 'BÍBLICO',

  async execute(sock, m) {
    const salmos = [
      {
        titulo: 'Salmo 23',
        texto: 'El Señor es mi pastor; nada me faltará. Él me guía, me cuida y me acompaña por el camino.'
      },
      {
        titulo: 'Salmo 27',
        texto: 'El Señor es mi luz y mi salvación; ¿a quién temeré? El Señor es la fortaleza de mi vida.'
      },
      {
        titulo: 'Salmo 46',
        texto: 'Dios es nuestro refugio y nuestra fuerza, nuestra ayuda segura en momentos de dificultad.'
      },
      {
        titulo: 'Salmo 91',
        texto: 'El que habita al abrigo del Altísimo descansará bajo la protección del Todopoderoso.'
      },
      {
        titulo: 'Salmo 121',
        texto: 'Mi ayuda viene del Señor, creador del cielo y de la tierra. Él cuidará tus pasos.'
      }
    ]

    const salmo = salmos[Math.floor(Math.random() * salmos.length)]

    await sock.sendMessage(m.key.remoteJid, {
      text: `╭━━〔 📜 SALMO 〕━━╮

📖 *${salmo.titulo}*

${salmo.texto}

╰━━━━━━━━━━━━━━╯`
    }, { quoted: m })
  }
}
