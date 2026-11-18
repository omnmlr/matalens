import { existsSync, writeFileSync } from 'node:fs'
import { expireReports, openStore, setStatus } from './store.mjs'

if (existsSync('.env')) process.loadEnvFile()
const directory = process.env.MATALENS_DATA_DIR ?? '.matalens'
const [action, id, path] = process.argv.slice(2)
const db = openStore(directory)
try {
  expireReports(db)
  if (action === 'queue') {
    const rows = db.prepare("SELECT id, kind, category, description, location, created_at FROM reports WHERE status = 'pending' ORDER BY created_at LIMIT 100").all()
    console.log(JSON.stringify(rows, null, 2))
  } else if (action === 'photo' && id && path) {
    const result = db.prepare('SELECT preview FROM evidence WHERE report_id = ?').get(id)
    if (!result) throw new Error('There is no photo for this case.')
    writeFileSync(path, result.preview, { mode: 0o600, flag: 'wx' })
    console.log('Private review copy written.')
  } else if (['reviewed', 'declined'].includes(action) && id) {
    if (!setStatus(db, id, action)) throw new Error('This case is not awaiting review.')
    console.log(`Case marked ${action}.`)
  } else {
    console.error('Use queue, photo <case-id> <private-preview.webp>, reviewed <case-id>, or declined <case-id>.')
    process.exitCode = 1
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  db.close()
}
