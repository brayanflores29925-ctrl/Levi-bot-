import http from "http"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { WEB_CODE_ACCESS } from "./config.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const WEB_PATH = path.join(__dirname, "..", "web")

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
}

const MAX_BODY = 4096

function responderJson(res, status, datos) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  })

  res.end(JSON.stringify(datos))
}

function leerBody(req) {
  return new Promise((resolve, reject) => {
    let body = ""

    req.on("data", chunk => {
      body += chunk

      if (Buffer.byteLength(body, "utf8") > MAX_BODY) {
        reject(new Error("Solicitud demasiado grande"))
        req.destroy()
      }
    })

    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"))
      } catch {
        reject(new Error("JSON inválido"))
      }
    })

    req.on("error", reject)
  })
}

export function iniciarApiCode(getSock) {
  const servidor = http.createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/api/status") {
        const sock = getSock()

        responderJson(res, 200, {
          ok: true,
          whatsapp: !!sock?.user
        })

        return
      }

      if (req.method === "POST" && req.url === "/api/code") {
        const datos = await leerBody(req)

        if (datos.access !== WEB_CODE_ACCESS) {
          responderJson(res, 403, {
            ok: false,
            error: "Clave de acceso incorrecta."
          })
          return
        }

        const numero = String(datos.numero || "")
          .replace(/\D/g, "")

        if (!numero || numero.length < 10) {
          responderJson(res, 400, {
            ok: false,
            error: "Número de WhatsApp no válido."
          })
          return
        }

        const sock = getSock()

        if (!sock?.user) {
          responderJson(res, 503, {
            ok: false,
            error: "Levi Bot todavía no está conectado a WhatsApp."
          })
          return
        }

        responderJson(res, 501, {
          ok: false,
          error: "La generación del código web todavía no está activada."
        })

        return
      }

      if (req.method === "GET") {
        const url = new URL(
          req.url,
          "http://127.0.0.1"
        )

        let archivo =
          url.pathname === "/"
            ? "index.html"
            : url.pathname.slice(1)

        if (
          archivo.includes("..") ||
          archivo.includes("\\")
        ) {
          res.writeHead(403)
          res.end("Acceso denegado")
          return
        }

        const ruta = path.join(WEB_PATH, archivo)

        if (
          !fs.existsSync(ruta) ||
          !fs.statSync(ruta).isFile()
        ) {
          res.writeHead(404)
          res.end("Página no encontrada")
          return
        }

        const extension = path.extname(ruta)
        const tipo =
          MIME_TYPES[extension] ||
          "application/octet-stream"

        res.writeHead(200, {
          "Content-Type": tipo
        })

        fs.createReadStream(ruta).pipe(res)
        return
      }

      responderJson(res, 404, {
        ok: false,
        error: "Ruta no encontrada"
      })
    } catch (error) {
      console.log(
        "[LEVI WEB] Error:",
        error.message
      )

      if (!res.headersSent) {
        responderJson(res, 500, {
          ok: false,
          error: "Error interno del servidor"
        })
      }
    }
  })

  servidor.listen(3000, "127.0.0.1", () => {
    console.log(
      "[LEVI WEB] API disponible en http://127.0.0.1:3000"
    )
  })

  return servidor
}
