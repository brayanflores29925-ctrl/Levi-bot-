export default {
  name: 'premium',
  command: ['premium'],
  category: 'Soporte',
  description: 'Información sobre Levi Bots Premium',

  async execute({ sock, m }) {
    const texto = `💎 *LEVI BOTS PREMIUM* 💎

🤖 *¡ALQUILA TU PROPIO LEVI-BOT!*

💰 *Precio:* $10 USD
📅 *Duración:* 1 mes

✨ *¿QUÉ INCLUYE?*

❑ 🤖 Levi-Bot completo
❑ ⚙️ Todos los sistemas y funciones disponibles
❑ 📱 Número integrado para el bot
❑ 🛠️ Configuración inicial
❑ 🔄 Actualizaciones del bot
❑ 🆘 Soporte durante el período contratado

💎 *TODO INCLUIDO POR SOLO $10 USD AL MES.*

📲 *¿QUIERES CONTRATARLO?*

Contacta al administrador para realizar el pago y activar tu Levi-Bot Premium.

⚠️ *El servicio tiene una duración de 30 días desde su activación.*
⚠️ *La activación se realiza después de confirmar el pago.*`;

    await sock.sendMessage(
      m.key.remoteJid,
      { text: texto },
      { quoted: m }
    );
  }
};
