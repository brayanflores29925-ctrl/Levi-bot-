export const CANAL_OFICIAL = 'https://whatsapp.com/channel/0029VbDBJk4BfxoCBx5ov41y'
export const GRUPO_OFICIAL = 'https://chat.whatsapp.com/EIUm1G9DrrzB440yROjOEq'

export const OWNER_NUMBER = '94874330'
export const GEMINI_API_KEY = ''

export function obtenerNumeroUsuario(m = {}) {
  const senderRaw =
    m.key?.senderPn ||
    m.key?.participantPn ||
    m.sender ||
    m.key?.participant ||
    m.key?.remoteJid ||
    ''

  return String(senderRaw)
    .split('@')[0]
    .split(':')[0]
    .replace(/\D/g, '')
}

export function esOwner(m = {}) {
  const owner = String(OWNER_NUMBER).replace(/\D/g, '')
  const numero = obtenerNumeroUsuario(m)

  return numero.endsWith(owner)
}
