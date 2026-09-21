const accessInput = document.getElementById("access")
const numeroInput = document.getElementById("numero")
const boton = document.getElementById("solicitar")
const resultado = document.getElementById("resultado")

boton.addEventListener("click", async () => {
  const access = accessInput.value.trim()
  const numero = numeroInput.value.replace(/\D/g, "")

  resultado.innerHTML = ""

  if (!access) {
    resultado.innerHTML = "<p>❌ Ingresa la clave de acceso.</p>"
    return
  }

  if (!numero || numero.length < 10) {
    resultado.innerHTML = "<p>❌ Ingresa un número válido.</p>"
    return
  }

  boton.disabled = true
  boton.textContent = "⏳ PROCESANDO..."

  try {
    const respuesta = await fetch("/api/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access,
        numero
      })
    })

    const datos = await respuesta.json()

    if (!respuesta.ok || !datos.ok) {
      throw new Error(datos.error || "No se pudo solicitar el código.")
    }

    resultado.innerHTML = `
      <div class="codigo">
        <div class="codigo-titulo">🔐 TU CÓDIGO</div>
        <div class="codigo-numero">${datos.codigo}</div>
        <div class="codigo-titulo">
          ⏳ Expira en ${datos.expiraEn || "15 minutos"}
        </div>
      </div>
    `
  } catch (error) {
    resultado.innerHTML = `<p>❌ ${error.message}</p>`
  } finally {
    boton.disabled = false
    boton.textContent = "🔐 SOLICITAR CODE"
  }
})
