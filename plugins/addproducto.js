import fs from 'fs'
import path from 'path'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const DB_PATH = path.join(process.cwd(), 'database.json')
const IMG_DIR = path.join(process.cwd(), 'data', 'productos')

export default {
  name: 'addproducto',

  async execute(sock, m, parts, enviar) {
    const chatId = m.key?.remoteJid
    const sender = m.key?.participant || m.participant || chatId

    if (!chatId?.endsWith('@g.us')) {
      return enviar('❌ Este comando solo funciona en grupos.')
    }

    try {
      const metadata = await sock.groupMetadata(chatId)

      const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)

      if (!admins.includes(sender)) {
        return enviar('❌ Este comando es solo para administradores.')
      }

      const texto = parts.join(' ').trim()

      if (!texto) {
        return enviar(
          '📦 *AGREGAR PRODUCTO*\n\n' +
          'Responde a una foto con:\n' +
          '/addproducto nombre | precio | stock | descripción\n\n' +
          'Ejemplo:\n' +
          '/addproducto Camiseta | 150 | 10 | Camiseta negra'
        )
      }

      const datos = texto.split('|').map(x => x.trim())

      if (datos.length < 3) {
        return enviar(
          '❌ Formato incorrecto.\n\n' +
          '/addproducto nombre | precio | stock | descripción'
        )
      }

      const nombre = datos[0]
      const precio = Number(datos[1])
      const stock = Number(datos[2])
      const descripcion = datos.slice(3).join(' | ')

      if (!nombre) {
        return enviar('❌ El nombre del producto es obligatorio.')
      }

      if (!Number.isFinite(precio) || precio <= 0) {
        return enviar('❌ El precio debe ser mayor que 0.')
      }

      if (!Number.isInteger(stock) || stock < 0) {
        return enviar('❌ El stock debe ser un número entero.')
      }

      const imagen =
        m.message?.imageMessage ||
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas?.configuracion?.activa) {
        return enviar('❌ Primero activa la tienda con /setup.')
      }

      if (!db.ventas.productos) {
        db.ventas.productos = {}
      }

      const id = `PROD-${Date.now()}`
      let imagenPath = ''

      if (imagen) {
        fs.mkdirSync(IMG_DIR, { recursive: true })

        const stream = await downloadContentFromMessage(imagen, 'image')
        const chunks = []

        for await (const chunk of stream) {
          chunks.push(chunk)
        }

        const buffer = Buffer.concat(chunks)
        imagenPath = path.join(IMG_DIR, `${id}.jpg`)
        fs.writeFileSync(imagenPath, buffer)
      }

      db.ventas.productos[id] = {
        id,
        nombre,
        precio,
        stock,
        descripcion,
        imagen: imagenPath,
        ventas: 0,
        creado: new Date().toISOString()
      }

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      const moneda = db.ventas.tienda?.moneda || 'L'

      await enviar(
        '✅ *PRODUCTO PUBLICADO*\n\n' +
        `🆔 ID: *${id}*\n` +
        `📦 Producto: *${nombre}*\n` +
        `💰 Precio: *${moneda} ${precio}*\n` +
        `📊 Stock: *${stock}*\n` +
        `📝 Descripción: *${descripcion || 'Sin descripción'}*\n` +
        `🖼️ Imagen: *${imagen ? 'Guardada' : 'Sin imagen'}*`
      )
    } catch (error) {
      console.error('Error en /addproducto:', error)
      await enviar('❌ No se pudo publicar el producto.')
    }
  }
}
