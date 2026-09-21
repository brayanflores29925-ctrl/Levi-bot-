import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'editarproducto',

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
          '✏️ *EDITAR PRODUCTO*\n\n' +
          'Formato:\n' +
          '/editarproducto ID | nombre | precio | stock | descripción\n\n' +
          'Ejemplo:\n' +
          '/editarproducto PROD-123 | Camiseta | 180 | 15 | Camiseta nueva'
        )
      }

      const datos = texto.split('|').map(x => x.trim())

      if (datos.length < 4) {
        return enviar(
          '❌ Faltan datos.\n\n' +
          'Usa:\n' +
          '/editarproducto ID | nombre | precio | stock | descripción'
        )
      }

      const id = datos[0]
      const nombre = datos[1]
      const precio = Number(datos[2])
      const stock = Number(datos[3])
      const descripcion = datos.slice(4).join(' | ')

      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas?.configuracion?.activa) {
        return enviar('❌ Primero activa la tienda con /setup.')
      }

      if (!db.ventas.productos?.[id]) {
        return enviar(`❌ No existe ningún producto con el ID *${id}*.`)
      }

      if (!nombre) {
        return enviar('❌ El nombre no puede estar vacío.')
      }

      if (!Number.isFinite(precio) || precio <= 0) {
        return enviar('❌ El precio debe ser mayor que 0.')
      }

      if (!Number.isInteger(stock) || stock < 0) {
        return enviar('❌ El stock debe ser un número entero de 0 o más.')
      }

      const producto = db.ventas.productos[id]

      producto.nombre = nombre
      producto.precio = precio
      producto.stock = stock
      producto.descripcion = descripcion

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      const moneda = db.ventas.tienda?.moneda || 'L'

      await enviar(
        '✅ *PRODUCTO ACTUALIZADO*\n\n' +
        `🆔 ID: *${id}*\n` +
        `📦 Producto: *${nombre}*\n` +
        `💰 Precio: *${moneda} ${precio}*\n` +
        `📊 Stock: *${stock}*\n` +
        `📝 Descripción: *${descripcion || 'Sin descripción'}*`
      )
    } catch (error) {
      console.error('Error en /editarproducto:', error)
      await enviar('❌ No se pudo editar el producto.')
    }
  }
}
