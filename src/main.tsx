import { createRoot } from 'react-dom/client'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Camera, ChevronRight, ClipboardList, Home, Moon, ShieldCheck, Sun, Vote, WifiOff } from 'lucide-react'
import '@fontsource-variable/manrope'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import './styles.css'
import { HomePage } from './home'
import { Election, Practice, Sources } from './election'
import { CameraPage, MyActions } from './camera'
import { Brand } from './ui'
import { emptyPlan, readLocal, useLocal, writeLocal, type Plan, type ReceiptEntry } from './state'

const nav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/election', label: 'My Election', icon: Vote },
  { href: '/camera', label: 'Civic Camera', icon: Camera },
  { href: '/actions', label: 'My Actions', icon: ClipboardList },
]
const paths = new Set([...nav.map(item => item.href), '/practice', '/sources', '/privacy'])
const noReceipts: ReceiptEntry[] = []

function App() {
  const [location, setLocation] = useState(() => window.location.pathname)
  const [theme, setTheme] = useState(() => readLocal('theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [online, setOnline] = useState(navigator.onLine)
  const [plan, setPlan] = useLocal('plan', emptyPlan)
  const [receipts, setReceipts] = useLocal('receipts', noReceipts)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const handlePopstate = () => setLocation(window.location.pathname)
    const handleNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin || !paths.has(url.pathname)) return
      if (url.pathname === window.location.pathname && url.hash) return
      event.preventDefault()
      if (window.location.href === url.href) {
        window.scrollTo(0, 0)
        return
      }
      history.pushState(null, '', url)
      setLocation(url.pathname)
      requestAnimationFrame(() => {
        const target = url.hash ? document.getElementById(url.hash.slice(1)) : document.querySelector<HTMLElement>('main h1')
        if (target) {
          if (url.hash) {
            const heading = target.matches('h1, h2, h3') ? target : target.querySelector('h2, h3, summary')
            if (heading instanceof HTMLElement) {
              if (heading.tagName !== 'SUMMARY') heading.tabIndex = -1
              heading.focus({ preventScroll: true })
            }
            target.scrollIntoView()
          }
          else {
            target.setAttribute('tabindex', '-1')
            target.focus({ preventScroll: true })
            window.scrollTo(0, 0)
          }
        }
      })
    }
    const syncOnline = () => setOnline(navigator.onLine)
    addEventListener('popstate', handlePopstate)
    addEventListener('online', syncOnline)
    addEventListener('offline', syncOnline)
    document.addEventListener('click', handleNavigation)
    return () => {
      removeEventListener('popstate', handlePopstate)
      removeEventListener('online', syncOnline)
      removeEventListener('offline', syncOnline)
      document.removeEventListener('click', handleNavigation)
    }
  }, [])

  useEffect(() => {
    const name = nav.find(item => item.href === location)?.label ?? ({ '/privacy': 'Privacy', '/sources': 'Sources & updates', '/practice': 'Practice' }[location] ?? 'Page unavailable')
    document.title = location === '/' ? 'MataLens · Your civic companion' : `${name} · MataLens`
    if (window.location.hash && !window.location.hash.startsWith('#receipt=')) {
      const target = document.getElementById(window.location.hash.slice(1))
      if (target) requestAnimationFrame(() => target.scrollIntoView())
    }
  }, [location])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c2019' : '#f8faf5')
    writeLocal('theme', theme)
  }, [theme])


  function updatePlan(next: Partial<Plan>) {
    const saved = setPlan({ ...plan, ...next })
    if (!saved) setNotice('This browser couldn’t save your preparation. Your changes are available until you leave the app.')
    return saved
  }

  function rememberReceipt(entry: ReceiptEntry) {
    return setReceipts([entry, ...readLocal('receipts', receipts).filter(item => item.code !== entry.code)])
  }

  function forgetReceipt(code: string) {
    setReceipts(readLocal('receipts', receipts).filter(item => item.code !== code))
  }

  function clearLocalData() {
    setPlan(emptyPlan)
    setReceipts([])
    setNotice('Preparation and saved receipts were cleared from this browser.')
  }

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(item => <a key={item.href} href={item.href} aria-current={location === item.href ? 'page' : undefined} data-active={location === '/practice' && item.href === '/election' || undefined}>{item.label}</a>)}
        </nav>
        <div className="header-right">
          <span className="country"><span className="flag" aria-hidden="true" /> Nigeria</span>
          <button className="theme-toggle" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
    {!online && <div className="connection-bar"><WifiOff size={15} /> You’re offline. Saved guides and plans still work.</div>}
    {notice && <div className="connection-bar" role="status">{notice}<button className="link-button" onClick={() => setNotice('')}>Dismiss</button></div>}
    <main id="main" key={location} tabIndex={-1} className="screen">
      {location === '/' && <HomePage plan={plan} />}
      {location === '/election' && <Election plan={plan} updatePlan={updatePlan} />}
      {location === '/practice' && <Practice complete={() => updatePlan({ practiced: true })} />}
      {location === '/camera' && <CameraPage online={online} remember={rememberReceipt} forget={forgetReceipt} />}
      {location === '/actions' && <MyActions plan={plan} receipts={receipts} remember={rememberReceipt} forget={forgetReceipt} />}
      {location === '/sources' && <Sources />}
      {location === '/privacy' && <Privacy clear={clearLocalData} />}
      {!paths.has(location) && <section className="wrap standard-page"><p className="eyebrow">MataLens</p><h1>Page unavailable</h1><p>Return home to find election guides, practice and Civic Camera.</p><a className="button" href="/">Go home <ChevronRight size={17} /></a></section>}
    </main>
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div><Brand /><p>An independent civic project for Nigeria.</p></div>
        <nav aria-label="Footer"><a href="/sources">Sources & updates</a><a href="/privacy">Privacy</a><a href="/actions">My Actions</a></nav>
      </div>
    </footer>
    <nav className="mobile-nav" aria-label="Main navigation">
      {nav.map(({ href, label, icon: Icon }) => <a key={href} href={href} aria-current={location === href ? 'page' : undefined} data-active={location === '/practice' && href === '/election' || undefined}><Icon size={20} strokeWidth={1.8} /><span>{label}</span></a>)}
    </nav>
  </>
}

function Privacy({ clear }: { clear: () => void }) {
  const [confirm, setConfirm] = useState(false)
  return <section className="wrap standard-page narrow">
    <p className="eyebrow"><ShieldCheck size={15} /> Privacy</p>
    <h1>Your information, your choice.</h1>
    <div className="panel prose">
      <h2>Election preparation</h2>
      <p>Candidate bookmarks, checklist progress, notes, polling-unit details and reminders stay in this browser. MataLens has no account system or tracking analytics. Anyone with access to this browser profile can see locally saved information.</p>
      <h2>Civic Camera</h2>
      <p>MataLens stores the original photo and report details in private storage for review. Originals may contain camera metadata, including location. The preview shown with your receipt strips that metadata. Leave out personal information, use public location details, and remove identifying details before uploading.</p>
      <p>Reports have a 30-day retention period from submission. Withdrawal removes the photo and clears the description and location from the active database. A minimal receipt record remains until expiry. Hosted operators must apply the same retention policy to backups and any private review copies.</p>
      <p>Keep the receipt code or link private. Anyone with it can open or withdraw your report. Lost receipt codes cannot be recovered by MataLens. Uploads and receipt requests are limited by network address in memory to reduce abuse.</p>
      <h2>Browser storage</h2>
      <p>Clearing your browser data here removes local preparation and saved receipt codes. Download any receipt you want to keep. To withdraw a report, open it from My Actions before clearing your data.</p>
      {confirm ? <div className="button-row"><button className="button danger" onClick={() => { clear(); setConfirm(false) }}>Confirm clear</button><button className="button button-secondary" onClick={() => setConfirm(false)}>Cancel</button></div> : <button className="button button-secondary" onClick={() => setConfirm(true)}>Clear preparation and receipts</button>}
    </div>
  </section>
}

createRoot(document.getElementById('root')!).render(<App />)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}) })
}
