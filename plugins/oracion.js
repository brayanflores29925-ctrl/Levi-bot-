export default {
  name: 'oracion',
  aliases: [],
  description: '🙏 Muestra una oración.',
  category: 'BÍBLICO',

  async execute(sock, m) {
    const oraciones = [
      '🙏 Señor, gracias por este nuevo día. Guía mis pasos, dame sabiduría para tomar buenas decisiones y ayúdame a tratar a los demás con amor y respeto. Amén.',
      '🙏 Dios, fortalece mi corazón en los momentos difíciles y ayúdame a mantener la esperanza. Que tu paz acompañe mi vida y mis decisiones. Amén.',
      '🙏 Padre, gracias por mi familia, mis amigos y por cada oportunidad que me das. Protégelos y ayúdanos a caminar siempre por el buen camino. Amén.',
      '🙏 Señor, dame fuerzas para superar los obstáculos, paciencia para esperar y sabiduría para comprender aquello que no puedo cambiar. Amén.',
      '🙏 Dios, ilumina mi camino, aparta de mí aquello que pueda hacerme daño y ayúdame a ser una mejor persona cada día. Amén.'
    ]

    const oracion = oraciones[Math.floor(Math.random() * oraciones.length)]

    await sock.sendMessage(m.key.remoteJid, {
      text: `╭━━〔 🙏 ORACIÓN 〕━━╮

${oracion}

╰━━━━━━━━━━━━━━╯`
    }, { quoted: m })
  }
}
