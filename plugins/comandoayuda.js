import axios from 'axios'

export default {
  name: 'comandoayuda',

  async execute(sock, m, parts, enviar) {
    const texto = parts?.join(' ').trim()
    if (!texto) return

    const normalizado = texto
      .toLowerCase()
      .replace(/^[/.*]+/, '')
      .trim()

    const comandos = [
      'menu','code','perfil','casarse','divorcio','setdesc','setgenero','setcumple',
      'deldesc','delgenero','delcumple','ship','infobot','sugerencia','bug','ping',
      'menulogos','configp','status','adv','cerrar','abrir','horario','warn','rmadv',
      'advlist','antiimg','antivideo','antisticker','antilinkgp','antilinkhard',
      'antifacke','leyendafacke','antipalabrotas','addpalabra','delpalabra',
      'listapalabra','antispam','limiteglobal','antiflood','leveling','modorpg',
      'creartorneo','modoadmin','multiprefijo','addprefijo','delprefijo','mute',
      'desmute','kick','ban','promover','degradar','notify','todos','grupo','linkgp',
      'reglas','contadormensajes','veractividad','rankactivos','reiniciarcontador',
      'idioma','verfantasmas','kickfantasmas','del','infowelcome','welcome',
      'setwelcome','setbye','textowelcome','textobye','tipowelcome','tipobye',
      'textwelcome','textbye','delbye','x9vistaunica','revelar','x9','odelete',
      'ausente','activo','sorteo','infogp','infoventas','setup','setnombre',
      'setmoneda','settipo','setimgtienda','tienda','recargar','confirmar','delsaldo',
      'addproducto','delproducto','delallproductos','editarproducto','comprar',
      'miscompras','totalventas','topcompradores','pocostock','estadisticas','puntos',
      'autoferta','setoferta','autorepo','crearrespuesta','crearrespuestaimg',
      'listarrespuestas','crearcomando','eliminarcomando','menunuevo','play','play2',
      'playdoc','playvideo','ytsearch','tiktok','x','instagram','facebook',
      'descargarapk','mediafire','pinterest','simi','chatgpt','llama','google',
      'wikipedia','clima','mareas','horoscopo','hd','totext','acortarlink','videolento',
      'videorapido','videocontrario','audiolento','audiorapido','grave','grave2',
      'ardilla','explotar','bass','bass2','bass3','adolecente','attp','attp2','attp3',
      'sticker','sticker2','emojimix','setsticker','toimg','togif','placaloli',
      'cartera','dep','ret','rankcoins','regalar','daily','work','crimen','robar',
      'pescar','minar','casino','dado','flip','blackdice','tiendarpg','ranknivel',
      'minivel','vernivel','niveles','rw','clain','harem','delchar','sell','wshop',
      'buyc','givechar','giveall','trade','votar','wtop','tresenlinea',
      'resettresenlinea','gartic','revelargartic','enigma','revelarenigma','ppt',
      'guerra','4vs4','6vs6','12vs12','16vs16','hug','kiss','pat','slap','patada',
      'punch','patear','poke','tickle','cuddle','bite','feed','nom','smile','wink',
      'blush','smug','happy','angry','bored','cry','laugh','pout','baka','bonk','wave',
      'nod','shrug','nope','thumbsup','handshake','handhold','highfive','dance','run',
      'sleep','yawn','lurk','stare','think','facepalm','tableflip','shoot','yeet',
      'peck','bleh','clap','coffee','dramatic','drunk','cold','kisscheek','love','sad',
      'scared','shy','smoke','spit','step','walk','bath','cringe','lick','scream',
      'push','jump','heat','gaming','draw','call','snuggle','blowkiss','trip','sniff',
      'curious','comfort','peek','bully','eat','sing','feo','rankbromistas','rankgay',
      'ranklindo','rankcornudos','rankotaku','ranklesbianas','rankinfieles',
      'rankfieles','ranktherian','subbots','maxsubbots','bots','qr','consola',
      'reiniciar','botoff','boton','darcoins','quitarcoins','fijarcoins','bangp',
      'setsimi','blockuser','unblockuser','resetperfiles','resetniveles','nombrebot',
      'fotomenu','setprefix','emojiresp','emojimenu','nombredinero','antillamadas',
      'antipv','antipv2','readmsg','reportar'
    ]

    if (comandos.includes(normalizado)) {
      return enviar(
        `✅ *COMANDO CORRECTO*\n\n` +
        `El comando */${normalizado}* está disponible en LeviBots.\n\n` +
        `📋 Usa */menu* para ver todos los comandos disponibles.`
      )
    }

    // Buscar errores pequeños antes de consultar a la IA
    function distancia(a, b) {
      const matriz = Array.from(
        { length: a.length + 1 },
        () => Array(b.length + 1).fill(0)
      )

      for (let i = 0; i <= a.length; i++) matriz[i][0] = i
      for (let j = 0; j <= b.length; j++) matriz[0][j] = j

      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          const costo = a[i - 1] === b[j - 1] ? 0 : 1

          matriz[i][j] = Math.min(
            matriz[i - 1][j] + 1,
            matriz[i][j - 1] + 1,
            matriz[i - 1][j - 1] + costo
          )
        }
      }

      return matriz[a.length][b.length]
    }

    let mejor = null
    let menor = Infinity

    for (const comando of comandos) {
      const d = distancia(normalizado, comando)

      if (d < menor) {
        menor = d
        mejor = comando
      }
    }

    const limite =
      normalizado.length <= 4 ? 1 :
      normalizado.length <= 7 ? 2 : 3

    if (mejor && menor <= limite) {
      return enviar(
        `🤖 *¿QUIZÁS QUISISTE DECIR?*\n\n` +
        `El comando *${texto}* no es correcto.\n\n` +
        `👉 Comando correcto: */${mejor}*\n\n` +
        `📋 Usa */menu* para ver todos los comandos.`
      )
    }

    // IA Llama para comandos que no reconoce
    try {
      const respuesta = await axios.get(
        'https://prexzyapis.com/ai/deepquery',
        {
          params: {
            prompt:
              `Eres el asistente inteligente de LeviBots. ` +
              `El usuario escribió el posible comando: "${texto}". ` +
              `Los comandos disponibles son: ${comandos.join(', ')}. ` +
              `Indica brevemente si parece que quiso escribir alguno de esos comandos. ` +
              `Si no coincide con ninguno, responde que no existe. ` +
              `No inventes comandos.`
          },
          timeout: 30000
        }
      )

      const resultado =
        respuesta.data?.response ||
        respuesta.data?.result ||
        respuesta.data?.answer ||
        respuesta.data?.message ||
        respuesta.data?.text

      if (resultado) {
        return enviar(
          `🦙 *ASISTENTE LEVIBOTS*\n\n${resultado}\n\n` +
          `📋 Usa */menu* para ver todos los comandos.`
        )
      }
    } catch (error) {
      console.error('Error en IA de comandoayuda:', error.message)
    }

    return enviar(
      `❌ *COMANDO NO ENCONTRADO*\n\n` +
      `Lo siento, ese comando no está disponible en LeviBots.\n\n` +
      `📋 Usa */menu* para ver mis comandos.\n` +
      `💡 ¿Quieres sugerir ese comando?\n` +
      `📝 Usa */reportar* para enviar tu sugerencia.`
    )
  }
}
