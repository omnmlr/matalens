import { chmodSync, existsSync, mkdirSync, realpathSync, statSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { protectWindowsStore } from './windows-storage.mjs'

export const retentionDays = 30
const day = 86_400_000

function comparablePath(path) {
  return process.platform === 'win32' ? path.toLowerCase() : path
}

function privateDatabasePath(directory) {
  const target = resolve(directory)
  const created = mkdirSync(target, { recursive: true, mode: 0o700 }) !== undefined
  const dataPath = realpathSync(target)
  const data = comparablePath(dataPath)
  for (const folder of ['public', 'dist']) {
    if (!existsSync(folder)) continue
    const served = comparablePath(realpathSync(folder))
    if (data === served || data.startsWith(served + sep)) {
      throw new Error('MATALENS_DATA_DIR must be outside public and dist.')
    }
  }
  if (process.platform === 'win32') protectWindowsStore(target, created)
  else if (statSync(dataPath).mode & 0o077) {
    throw new Error('MATALENS_DATA_DIR must be a private directory (permissions 0700).')
  }
  return resolve(dataPath, 'cases.sqlite')
}

export function openStore(directory) {
  const databasePath = directory ? privateDatabasePath(directory) : undefined
  const db = new DatabaseSync(databasePath ?? ':memory:')
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA secure_delete = ON;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      receipt_hash TEXT NOT NULL UNIQUE,
      kind TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'declined', 'withdrawn'))
    ) STRICT;
    CREATE INDEX IF NOT EXISTS reports_created_at ON reports(created_at);
    CREATE TABLE IF NOT EXISTS evidence (
      report_id TEXT PRIMARY KEY REFERENCES reports(id) ON DELETE CASCADE,
      original BLOB NOT NULL,
      sha256 TEXT NOT NULL,
      preview BLOB NOT NULL
    ) STRICT;
  `)
  if (databasePath && process.platform !== 'win32') chmodSync(databasePath, 0o600)
  return db
}

export function expireReports(db, now = Date.now()) {
  const { changes } = db.prepare('DELETE FROM reports WHERE created_at <= ?').run(now - retentionDays * day)
  if (changes) db.exec('PRAGMA wal_checkpoint(TRUNCATE)')
}

export function findReport(db, receiptHash) {
  return db.prepare(`
    SELECT id, kind, category, description, location, status, created_at,
      EXISTS(SELECT 1 FROM evidence WHERE report_id = reports.id) AS has_photo
    FROM reports WHERE receipt_hash = ?
  `).get(receiptHash)
}

export function publicReport(row) {
  return {
    id: row.id, kind: row.kind, category: row.category,
    description: row.description, location: row.location, status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    expiresAt: new Date(row.created_at + retentionDays * day).toISOString(),
    hasPhoto: Boolean(row.has_photo),
  }
}

export function setStatus(db, id, status) {
  const filter = status === 'withdrawn' ? "status != 'withdrawn'" : "status = 'pending'"
  db.exec('BEGIN IMMEDIATE')
  try {
    const redact = status === 'withdrawn' || status === 'declined'
    const result = db.prepare(`
      UPDATE reports SET status = ?, description = CASE WHEN ? THEN '' ELSE description END,
        location = CASE WHEN ? THEN '' ELSE location END WHERE id = ? AND ${filter}
    `).run(status, Number(redact), Number(redact), id)
    if (redact && result.changes) db.prepare('DELETE FROM evidence WHERE report_id = ?').run(id)
    db.exec('COMMIT')
    if (redact && result.changes) db.exec('PRAGMA wal_checkpoint(TRUNCATE)')
    return Boolean(result.changes)
  } catch (error) {
    if (db.isTransaction) db.exec('ROLLBACK')
    throw error
  }
}
