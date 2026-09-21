import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUTH_PATH = path.join(__dirname, 'authdb.json')

function load() {
  if (!fs.existsSync(AUTH_PATH)) {
    const initial = { password: 'levi123', authorized: [] }
    fs.writeFileSync(AUTH_PATH, JSON.stringify(initial, null, 2))
    return initial
  }
  return JSON.parse(fs.readFileSync(AUTH_PATH, 'utf-8'))
}

function save(data) {
  fs.writeFileSync(AUTH_PATH, JSON.stringify(data, null, 2))
}

export function isAuthorized(sender, ownerNumber) {
  const db = load()
  const number = sender.split('@')[0]
  if (number === ownerNumber) return true
  return db.authorized.includes(number)
}

export function addAuthorized(sender) {
  const db = load()
  const number = sender.split('@')[0].split(':')[0]

  if (!db.authorized.includes(number)) {
    db.authorized.push(number)
    save(db)
  }

  return true
}

export function authorizeUser(sender, password) {
  const db = load()
  const number = sender.split('@')[0]
  if (password !== db.password) return false
  if (!db.authorized.includes(number)) {
    db.authorized.push(number)
    save(db)
  }
  return true
}

export function setPassword(newPassword) {
  const db = load()
  db.password = newPassword
  save(db)
}
