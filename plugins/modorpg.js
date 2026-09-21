export default {
  name: 'modorpg',

  async execute(sock, m) {
    const chatId = m.chat || m.key?.remoteJid
    const texto = m.text || m.message?.conversation || ''
    const args = texto.trim().split(/\s+/)

    if (!args[1]) {
      return await sock.sendMessage(chatId, {
        text: `🎮 MODO RPG

Activa o desactiva el modo RPG del grupo.

📌 Uso:
 /Modorpg on
 /Modorpg off

✅ on — Activar
❌ off — Desactivar`
      })
    }

    const opcion = args[1].toLowerCase()

    if (opcion === 'on') {
      return await sock.sendMessage(chatId, {
        text: '🎮✅ Modo RPG activado.'
      })
    }

    if (opcion === 'off') {
      return await sock.sendMessage(chatId, {
        text: '🎮❌ Modo RPG desactivado.'
      })
    }

    await sock.sendMessage(chatId, {
      text: '❌ Opción no válida.\n\nUsa: /Modorpg on o /Modorpg off'
    })
  }
}
