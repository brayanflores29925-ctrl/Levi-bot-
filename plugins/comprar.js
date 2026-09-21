import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

export default {
  name: 'comprar',

  async execute(sock, m, parts, enviar) {
    const sender = m.key?.participant || m.participant || m.key?.remoteJid
    const id = parts[0]?.trim()
    const cantidad = Number(parts[1] || 1)

    if (!id) {
      return enviar(
        '🛒 *COMPRAR PRODUCTO*\n\n' +
        'Usa el ID del producto.\n\n' +
        'Ejemplo:\n' +
        '/comprar PROD-123456789\n\n' +
        'Para comprar varias unidades:\n' +
        '/comprar PROD-123456789 2'
      )
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return enviar('❌ La cantidad debe ser un número entero mayor que 0.')
    }

    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))

      if (!db.ventas?.configuracion?.activa) {
        return enviar('❌ La tienda no está activa. Usa /setup primero.')
      }

      const producto = db.ventas.productos?.[id]

      if (!producto) {
        return enviar(`❌ No existe ningún producto con el ID *${id}*.`)
      }

      const stock = Number(producto.stock || 0)
      const precio = Number(producto.precio)

      if (stock < cantidad) {
        return enviar(
          '❌ *STOCK INSUFICIENTE*\n\n' +
          `📦 Producto: *${producto.nombre}*\n` +
          `📊 Stock disponible: *${stock}*\n` +
          `🛒 Cantidad solicitada: *${cantidad}*`
        )
      }

      if (!Number.isFinite(precio) || precio <= 0) {
        return enviar('❌ El precio del producto no es válido.')
      }

      if (!db.ventas.saldos) {
        db.ventas.saldos = {}
      }

      const saldo = Number(db.ventas.saldos[sender] || 0)
      const total = precio * cantidad
      const moneda = db.ventas.tienda?.moneda || 'L'

      if (saldo < total) {
        return enviar(
          '❌ *SALDO INSUFICIENTE*\n\n' +
          `📦 Producto: *${producto.nombre}*\n` +
          `💵 Precio: *${moneda} ${precio}*\n` +
          `🔢 Cantidad: *${cantidad}*\n` +
          `💰 Total: *${moneda} ${total}*\n` +
          `💳 Tu saldo: *${moneda} ${saldo}*`
        )
      }

      db.ventas.saldos[sender] = saldo - total
      producto.stock = stock - cantidad
      producto.ventas = Number(producto.ventas || 0) + cantidad

      if (!Array.isArray(db.ventas.ventas)) {
        db.ventas.ventas = []
      }

      if (!Array.isArray(db.ventas.compras)) {
        db.ventas.compras = []
      }

      const compra = {
        id: `COMP-${Date.now()}`,
        usuario: sender,
        productoId: id,
        producto: producto.nombre,
        cantidad,
        precioUnitario: precio,
        total,
        fecha: new Date().toISOString()
      }

      db.ventas.ventas.push(compra)
      db.ventas.compras.push(compra)

      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))

      await enviar(
        '✅ *COMPRA REALIZADA* 🛒\n\n' +
        `🧾 ID: *${compra.id}*\n` +
        `📦 Producto: *${producto.nombre}*\n` +
        `🔢 Cantidad: *${cantidad}*\n` +
        `💵 Precio unitario: *${moneda} ${precio}*\n` +
        `💰 Total: *${moneda} ${total}*\n` +
        `📦 Stock restante: *${producto.stock}*\n` +
        `💳 Saldo restante: *${moneda} ${db.ventas.saldos[sender]}*`
      )
    } catch (error) {
      console.error('Error en /comprar:', error)
      await enviar('❌ No se pudo realizar la compra.')
    }
  }
}
