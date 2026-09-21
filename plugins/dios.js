export default {
  name: 'dios',
  aliases: [],
  description: '✨ Mensaje de reflexión sobre Dios.',
  category: 'BÍBLICO',

  async execute(sock, m) {
    const mensajes = [
      '✨ Dios siempre puede darte fuerzas para seguir adelante. Confía, mantén la esperanza y no dejes de hacer el bien.',
      '🙏 Cuando no sepas qué camino tomar, busca a Dios con un corazón sincero y actúa con sabiduría, amor y paciencia.',
      '💛 Recuerda que cada día es una nueva oportunidad para aprender, mejorar y agradecer por las cosas buenas de la vida.',
      '🌿 La fe también significa seguir adelante con esperanza incluso cuando las cosas no salen como esperabas.',
      '✨ Que Dios ilumine tus decisiones, cuide a las personas que amas y te ayude a encontrar paz en los momentos difíciles.'
    ]

    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)]

    await sock.sendMessage(m.key.remoteJid, {
      text: `╭━━〔 ✨ DIOS 〕━━╮

${mensaje}

╰━━━━━━━━━━━━━━╯`
    }, { quoted: m })
  }
}
