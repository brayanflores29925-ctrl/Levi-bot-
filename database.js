import fs from 'fs'

const DB_PATH = './database.json'

export const getDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = { users: {}, propuestas: {} }
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2))
      return initialData
    }
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    if (!data.users) data.users = {}
    if (!data.propuestas) data.propuestas = {}
    return data
  } catch (err) {
    return { users: {}, propuestas: {} }
  }
}

export const saveDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}


export const getUser = (db, jid) => {
  if (!db.users) db.users = {}
  
  if (!db.users[jid]) {
    db.users[jid] = {
      registrado: false,
      nombre: 'Sin registrar',
      edad: 'N/A',
      apellido: '',
      desc: 'Sin descripción',
      genero: 'No especificado',
      cumple: 'No configurado',
      pareja: null
    }
  }
  return db.users[jid]
}
