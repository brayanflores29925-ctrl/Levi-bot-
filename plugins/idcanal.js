export default {
  name: ["idcanal"],
  async execute(sock, m) {
    try {
      const code = "0029VbDBJk4BfxoCBx5ov41y"
      const res = await sock.newsletterMetadata("invite", code)
      
      console.log("\n========================================")
      console.log("📌 NOMBRE CANAL:", res.name)
      console.log("🔑 JID CANAL:", res.id)
      console.log("========================================\n")

      const target = m.chat || m.key?.remoteJid
      if (target) {
        await sock.sendMessage(target, { 
          text: `✅ *JID del Canal:*\n\`${res.id}\`` 
        })
      }
    } catch (e) {
      console.error("[ERROR GET JID]:", e.message || e)
    }
  }
}
