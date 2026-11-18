import { useEffect, useState } from 'react'

export type ReceiptEntry = { code: string; id?: string; category?: string; createdAt?: string }
export type Report = {
  id: string
  kind: 'community' | 'result'
  category: string
  description: string
  location: string
  status: 'pending' | 'reviewed' | 'declined' | 'withdrawn'
  createdAt: string
  expiresAt: string
  hasPhoto: boolean
}

export type Plan = {
  checklist: string[]
  candidates: string[]
  state: string
  lga: string
  pollingUnit: string
  notes: string
  reminder: string
  practiced: boolean
}
export const emptyPlan: Plan = {
  checklist: [], candidates: [], state: '', lga: '', pollingUnit: '', notes: '', reminder: '', practiced: false,
}
const prefix = 'matalens:v1:'

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(prefix + key)
    return raw === null ? fallback : JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function useLocal<T>(key: string, fallback: T) {
  const [value, setValue] = useState(() => readLocal(key, fallback))
  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.key === prefix + key || event.key === null) setValue(readLocal(key, fallback))
    }
    window.addEventListener('storage', update)
    return () => window.removeEventListener('storage', update)
  }, [key, fallback])

  return [value, (next: T) => {
    setValue(next)
    return writeLocal(key, next)
  }] as const
}

export function downloadFile(name: string, value: string, type: string) {
  const url = URL.createObjectURL(new Blob([value], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 5000)
}

export function downloadReminder(date: string, title: string, detail: string) {
  const start = date.replaceAll('-', '')
  const escape = (text: string) => text.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;')
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  downloadFile('matalens-reminder.ics', [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MataLens//Preparation//EN',
    'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${start}-${title.toLowerCase().replace(/[^a-z]/g, '')}@matalens`,
    `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${start}`, `SUMMARY:${escape(title)}`,
    `DESCRIPTION:${escape(detail)}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:-P1D',
    `DESCRIPTION:${escape(title)}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n'), 'text/calendar;charset=utf-8')
}

export function daysUntilNigeria(date: string, now = Date.now()) {
  const today = Math.floor((now + 3_600_000) / 86_400_000)
  return Date.parse(date) / 86_400_000 - today
}

export function nigeriaDate(date: string, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) {
  return new Intl.DateTimeFormat('en-NG', { ...options, timeZone: 'Africa/Lagos' }).format(new Date(date))
}

export const receiptCodePattern = /^[a-f0-9]{64}$/
export function newReceiptCode() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function receiptRequest(path: string, code: string, options: RequestInit = {}) {
  let response: Response
  try {
    response = await fetch(path, {
      ...options, headers: { Authorization: `Bearer ${code}` },
      cache: 'no-store', signal: options.signal ?? AbortSignal.timeout(55_000),
    })
  } catch {
    throw new Error('Couldn’t reach MataLens. Check your connection and try again.')
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.error ?? 'MataLens could not complete this action. Please try again.')
  }
  return response
}

export function codeFromInput(value: string) {
  const trimmed = value.trim()
  try {
    const url = new URL(trimmed)
    return new URLSearchParams(url.hash.slice(1)).get('receipt')?.toLowerCase() ?? ''
  } catch {
    return trimmed.toLowerCase()
  }
}
