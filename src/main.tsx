import { createRoot } from 'react-dom/client'
import { useEffect, useLayoutEffect, useState } from 'react'
import { CalendarDays, ChevronRight, FileSearch, Home, Library, Moon, ShieldCheck, Sun, WifiOff } from 'lucide-react'
import '@fontsource-variable/manrope'
import './styles.css'
import './civic.css'
import './editorial.css'
import './guide.css'
import { HomePage } from './home'
import { ElectionArchive } from './archive'
import { Election, Practice, Sources } from './election'
import { CameraPage, MyActions } from './camera'
import { Brand, External } from './ui'
import { candidatePath, contests, contestPath, identities, partyNames, partyPath, rights, roster } from './catalogue'
import { links } from './content'
import { Ballot, CandidatePage, Compare, Explorer, RacePage } from './explorer'
import { Parties, PartyPractice } from './parties'
import { RightsPage } from './rights'
import { ResultsPage } from './results'
import { DiscoverPage } from './discover'
import { DeskPage } from './desk'
import { LearnPage, LessonPage, type ExerciseStatus } from './learning'
import { lessonPath, lessons } from './learning-data'
import { mateRoutes } from './people'
import { RunningMatePage } from './profile-learning'
import { storyIdPattern } from './stories'
import { StoryPage, UpdatesPage, useStoryFeed } from './story-ui'
import { emptyPlan, readLocal, useLocal, writeLocal, type Plan, type ReceiptEntry } from './state'

const nav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/elections', label: '2027 Elections', mobileLabel: 'Elections', icon: CalendarDays },
  { href: '/stories', label: 'Developments', icon: FileSearch },
  { href: '/desk', label: 'My Desk', icon: Library },
]
const lessonRoutes = new Map(lessons.map(lesson => [lessonPath(lesson.id), lesson]))
const raceRoutes = new Map(contests.map(race => [contestPath(race), race]))
const compareRoutes = new Map(contests.map(race => [contestPath(race) + '/compare', race]))
const candidateRoutes = new Map(roster.map(person => [candidatePath(person.id), person]))
const paths = new Set([
  ...nav.map(item => item.href), '/elections', '/rights', '/camera', '/actions', '/stories', '/election', '/practice', '/sources', '/privacy', '/my-ballot',
  '/parties', '/parties/practice', '/results', '/archive', '/discover', '/learn', '/corrections', '/help',
  ...raceRoutes.keys(), ...compareRoutes.keys(), ...candidateRoutes.keys(), ...mateRoutes.keys(), ...lessonRoutes.keys(),
  ...Object.keys(partyNames).map(partyPath),
  ...rights.map(right => '/rights/' + right.slug),
])
const currentUrl = () => window.location.pathname + window.location.search
const electionPaths = ['/election', '/my-ballot', '/parties', '/results', '/discover', '/archive']
const getStoryId = (path: string) => {
  if (!path.startsWith('/stories/')) return undefined
  const id = path.slice('/stories/'.length)
  return id.length <= 120 && storyIdPattern.test(id) ? id : undefined
}
const knownPath = (path: string) => paths.has(path) || Boolean(getStoryId(path))
const noReceipts: ReceiptEntry[] = []
const noIds: string[] = []

function App() {
  const [url, setUrl] = useState(currentUrl)
  const location = url.split('?')[0]
  const race = raceRoutes.get(location)
  const comparison = compareRoutes.get(location)
  const person = candidateRoutes.get(location)
  const party = Object.keys(partyNames).find(code => partyPath(code) === location)
  const mate = mateRoutes.get(location)
  const lesson = lessonRoutes.get(location)
  const storyId = getStoryId(location)
  const activeSection = (href: string) => location.startsWith(href + '/') ||
    (href === '/elections' && (electionPaths.includes(location) || Boolean(race || comparison || person || party || mate))) ||
    (href === '/desk' && ['/actions', '/camera'].includes(location))
  const [theme, setTheme] = useState(() => readLocal('theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [online, setOnline] = useState(navigator.onLine)
  const [plan, setPlan] = useLocal('plan', emptyPlan)
  const [receipts, setReceipts] = useLocal('receipts', noReceipts)
  const [savedPeople, setSavedPeople] = useLocal('followed', noIds)
  const [savedStories, setSavedStories] = useLocal('stories', noIds)
  const [legacyProgress] = useState<Record<string, ExerciseStatus>>(() => {
    const legacy = readLocal('learning', noIds)
    return Object.fromEntries(Array.isArray(legacy) ? legacy.filter(id => typeof id === 'string').map(id => [id, 'attempted']) : [])
  })
  const [outcomes, setOutcomes] = useLocal('learning-outcomes', legacyProgress)
  const [notice, setNotice] = useState('')
  const feed = useStoryFeed(online, location === '/' || location === '/desk' || location === '/stories' || Boolean(person?.race.year === 2027 || mate || storyId))

  useEffect(() => {
    const handlePopstate = () => {
      setUrl(currentUrl())
      const scroll = history.state?.scroll
      if (typeof scroll === 'number') requestAnimationFrame(() => window.scrollTo(0, scroll))
    }
    const handleNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin || !knownPath(url.pathname)) return
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return
      event.preventDefault()
      if (window.location.href === url.href) {
        window.scrollTo(0, 0)
        return
      }
      history.replaceState({ ...history.state, scroll: window.scrollY }, '')
      history.pushState(link.dataset.compareId ? { comparison: { first: link.dataset.compareId } } : null, '', url)
      setUrl(currentUrl())
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
    const name = document.querySelector('main h1')?.textContent ?? 'MataLens'
    document.title = location === '/' ? 'MataLens · Nigeria’s 2027 election guide' : `${name} · MataLens`
    if (window.location.hash && !window.location.hash.startsWith('#receipt=')) {
      const target = document.getElementById(window.location.hash.slice(1))
      if (target) requestAnimationFrame(() => target.scrollIntoView())
    }
  }, [url, location])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1d16' : '#f8f8f0')
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
    setSavedPeople([])
    setSavedStories([])
    setOutcomes({})
    writeLocal('learning', [])
    setNotice('Your locally saved data was cleared from this browser.')
  }

  function togglePerson(id: string) {
    if (!identities[id]) return
    if (!setSavedPeople(savedPeople.includes(id) ? savedPeople.filter(item => item !== id) : [...savedPeople, id])) {
      setNotice('This browser couldn’t save your watchlist across visits.')
    }
  }

  function toggleStory(id: string) {
    if (!setSavedStories(savedStories.includes(id) ? savedStories.filter(item => item !== id) : [...savedStories, id])) {
      setNotice('This browser couldn’t save your reading list across visits.')
    }
  }

  function recordAttempt(id: string, correct: boolean) {
    const next = correct ? 'correct' : 'attempted'
    if (outcomes[id] === 'correct' || outcomes[id] === next) return
    if (!setOutcomes({ ...outcomes, [id]: next })) {
      setNotice('This browser couldn’t save your learning progress across visits.')
    }
  }

  const watchlist = { savedPeople, togglePerson }
  const saves = { savedStories, toggleStory }
  const progress = { outcomes, recordAttempt }
  const planProps = { plan, updatePlan }
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(item => <a key={item.href} href={item.href} aria-current={location === item.href ? 'page' : undefined} data-active={activeSection(item.href) || undefined}>{item.label}</a>)}
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
    <main id="main" key={url} tabIndex={-1} className="screen">
      {location === '/' && <HomePage feed={feed} />}
      {location === '/discover' && <DiscoverPage watchlist={watchlist} {...planProps} />}
      {location === '/stories' && <UpdatesPage feed={feed} />}
      {storyId && <StoryPage id={storyId} feed={feed} saves={saves} progress={progress} />}
      {location === '/learn' && <LearnPage {...progress} />}
      {lesson && <LessonPage lesson={lesson} {...progress} />}
      {location === '/desk' && <DeskPage {...{ watchlist, saves, progress, plan, receipts, feed }} />}
      {mate && <RunningMatePage person={mate} watchlist={watchlist} feed={feed} />}
      {location === '/elections' && <Explorer {...planProps} />}
      {race && <RacePage race={race} {...planProps} />}
      {person && <CandidatePage person={person} watchlist={watchlist} feed={feed} {...planProps} />}
      {comparison && <Compare race={comparison} />}
      {location === '/my-ballot' && <Ballot plan={plan} updatePlan={updatePlan} />}
      {(location === '/parties' || party) && <Parties party={party} {...planProps} />}
      {location === '/parties/practice' && <PartyPractice />}
      {location === '/archive' && <ElectionArchive />}
      {location === '/results' && <ResultsPage />}
      {location === '/rights' && <RightsPage />}
      {location.startsWith('/rights/') && paths.has(location) && <RightsPage slug={location.split('/').at(-1)} />}
      {location === '/corrections' && <Corrections />}
      {location === '/help' && <Help />}
      {location === '/election' && <Election plan={plan} updatePlan={updatePlan} />}
      {location === '/practice' && <Practice complete={() => updatePlan({ practiced: true })} />}
      {location === '/camera' && <CameraPage online={online} remember={rememberReceipt} forget={forgetReceipt} />}
      {location === '/actions' && <MyActions plan={plan} receipts={receipts} remember={rememberReceipt} forget={forgetReceipt} />}
      {location === '/sources' && <Sources />}
      {location === '/privacy' && <Privacy clear={clearLocalData} />}
      {!knownPath(location) && <section className="wrap standard-page"><p className="eyebrow">MataLens</p><h1>Page unavailable</h1><p>Return home to find election guides, practice and Civic Camera.</p><a className="button" href="/">Go home <ChevronRight size={17} /></a></section>}
    </main>
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div><Brand /><p>An independent civic project for Nigeria.</p></div>
        <nav aria-label="Footer"><a href="/archive">2023 Archive</a><a href="/learn">Civic learning</a><a href="/rights">Voting rights</a><a href="/camera">Civic Camera</a><a href="/sources">Sources</a><a href="/corrections">Corrections</a><a href="/privacy">Privacy</a><a href="/help">Help</a></nav>
      </div>
    </footer>
    <nav className="mobile-nav" aria-label="Main navigation">
      {nav.map(({ href, label, mobileLabel, icon: Icon }) => <a key={href} href={href} aria-current={location === href ? 'page' : undefined} data-active={activeSection(href) || undefined}><Icon size={20} strokeWidth={1.8} /><span>{mobileLabel ?? label}</span></a>)}
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
      <p>Saved people, saved stories, learning progress, candidate bookmarks, comparisons, checklist progress, notes, polling-unit details and reminders stay in this browser. MataLens has no account system or tracking analytics. Anyone with access to this browser profile can see locally saved information.</p>
      <h2>Civic Camera</h2>
      <p>MataLens stores the original photo and report details in private storage for review. Originals may contain camera metadata, including location. The preview shown with your receipt strips that metadata. Leave out personal information, use public location details, and remove identifying details before uploading.</p>
      <p>Reports have a 30-day retention period from submission. Withdrawal removes the photo and clears the description and location from the active database. A minimal receipt record remains until expiry. Hosted operators must apply the same retention policy to backups and any private review copies.</p>
      <p>Keep the receipt code or link private. Anyone with it can open or withdraw your report. Lost receipt codes cannot be recovered by MataLens. Uploads and receipt requests are limited by network address in memory to reduce abuse.</p>
      <h2>Browser storage</h2>
      <p>Clearing your data here removes your reading list, watchlist, learning progress, election preparation and saved receipt codes from this browser. Download any receipt you want to keep. To withdraw a report, open it from My Actions before clearing your data.</p>
      {confirm ? <div className="button-row"><button className="button danger" onClick={() => { clear(); setConfirm(false) }}>Confirm clear</button><button className="button button-secondary" onClick={() => setConfirm(false)}>Cancel</button></div> : <button className="button button-secondary" onClick={() => setConfirm(true)}>Clear saved browser data</button>}
    </div>
  </section>
}

function Corrections() {
  const id = new URLSearchParams(window.location.search).get('record')
  const candidate = roster.find(person => person.id === id)
  const record = candidate?.name ?? (id === '2023-president' ? '2023 presidential election results' : '')
  const [feedback, setFeedback] = useState('')
  const [note, setNote] = useState('')
  const message = [record && `MataLens record: ${record}`, note.trim()].filter(Boolean).join('\n\n')
  return <section className="wrap standard-page narrow">
    <div className="catalogue-title"><h1>Corrections</h1><p>Prepare a correction for a public record. Include the field in question and an official source if you have one.</p></div>
    <div className="field-stack">
      {record && <p>Record: <strong>{record}</strong></p>}
      <label>Correction details<textarea rows={5} value={note} onChange={event => { setNote(event.target.value); setFeedback('') }} maxLength={800} /></label>
      <p>Online delivery is unavailable. You can copy your note for sharing.</p>
      <button className="button" disabled={!note.trim()} onClick={async () => {
        try { await navigator.clipboard.writeText(message); setFeedback('Correction note copied.') }
        catch { setFeedback('Select and copy your note from the text box.') }
      }}>Copy correction note</button>
      <p role="status">{feedback}</p>
    </div>
  </section>
}

function Help() {
  return <section className="wrap standard-page narrow">
    <div className="catalogue-title"><h1>Help with MataLens</h1><p>Find the official service you need or return to your private preparation.</p></div>
    <ul className="help-links">
      <li><External href={links.polling}>Find your polling unit with INEC</External></li>
      <li><a className="text-link" href="/rights">Read voting rights and safety guidance</a></li>
      <li><a className="text-link" href="/actions">Recover a private receipt</a></li>
      <li><a className="text-link" href="/privacy">Manage saved data and read our privacy policy</a></li>
    </ul>
  </section>
}

createRoot(document.getElementById('root')!).render(<App />)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}) })
}
