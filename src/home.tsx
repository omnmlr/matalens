import { ArrowRight, BookOpen, Camera, ChevronRight, CircleCheck, ClipboardList, Compass, Flag, GraduationCap, MapPin, Search } from 'lucide-react'
import { contestPath, contests, presidential, presidentialArchive, raceStatus, rosterFor } from './catalogue'
import { links, updates } from './content'
import { CandidateRows } from './directory'
import { ElectionCalendar, type PlanProps } from './explorer'
import { DeclarationPreview } from './results'
import { RightsFeature } from './rights'
import { daysUntilNigeria, hasSavedPlan, nigeriaDate } from './state'
import { ActionLink, External } from './ui'

const tickets = rosterFor(presidential)
const shortcutLinks = [
  { title: 'Find my polling unit', detail: 'Check where you’re registered', icon: MapPin, href: '/election#polling-unit' },
  { title: 'Build my ballot', detail: 'Find contests that apply to you', icon: ClipboardList, href: '/my-ballot' },
  { title: 'Civic Camera', detail: 'Document an issue privately', icon: Camera, href: '/camera' },
]
const learning = [
  { title: 'Know your party', detail: 'Read party records and practise identifying names and symbols.', href: '/parties', icon: Flag },
  { title: 'Practise election day', detail: 'Rehearse what to do from accreditation to casting your ballot.', href: '/practice', icon: GraduationCap },
  { title: 'Make a voting plan', detail: 'Save your polling unit, checklist and reminder on this device.', href: '/election#polling-plan', icon: ClipboardList },
]

export function HomePage(props: PlanProps) {
  const days = daysUntilNigeria(presidential.date)
  const resume = hasSavedPlan(props.plan)
  const electionDay = nigeriaDate(presidential.date, { day: 'numeric' })
  const electionMonth = nigeriaDate(presidential.date, { month: 'short' })
  return <div className="civic-home">
    <div className="wrap home-lead">
      <div className="lead-edition"><span><span className="flag" aria-hidden="true" /> Nigeria’s independent voter guide</span><a href="/sources">Sources &amp; updates <ChevronRight size={15} aria-hidden="true" /></a></div>
      <div className="lead-grid">
        <div className="lead-copy">
          <h1>Be ready<br />{' '}to <em>vote.</em></h1>
          <p>See who’s running, know your rights and get ready for election day in Nigeria.</p>
          <div className="button-row"><ActionLink href={contestPath(presidential)}>Explore presidential candidates</ActionLink><a className="text-link" href="/elections">All elections <ArrowRight size={16} /></a></div>
        </div>
        <section className="presidential-brief" aria-label="2027 presidential election">
          <div className="brief-top"><p className="kicker">Next general election</p><span><i /> {raceStatus(presidential)}</span></div>
          <h2>Presidential election</h2>
          <div className="brief-date"><time dateTime={presidential.date} aria-label={nigeriaDate(presidential.date, { dateStyle: 'long' })}><strong>{electionDay}</strong><span>{electionMonth}<br />{presidential.year}</span></time>{days >= 0 && <p>{days === 0 ? 'Scheduled for today' : `${days} days to go`}</p>}</div>
          <div className="brief-bottom"><a href={contestPath(presidential)}><CircleCheck size={17} aria-hidden="true" /> {tickets.length} named tickets <ArrowRight size={16} /></a><External href={links.calendar}>INEC calendar</External></div>
        </section>
      </div>
      <nav className="lead-shortcuts" aria-label="Voter tools">{shortcutLinks.map(({ title, detail, icon: Icon, href }) => <a key={href} href={href}><Icon size={22} strokeWidth={1.6} aria-hidden="true" /><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={16} aria-hidden="true" /></a>)}</nav>
    </div>

    <section className="wrap home-edition" aria-labelledby="what-is-on-ballot">
      <div className="home-section-head"><div><p className="kicker"><Compass size={16} aria-hidden="true" /> Explore the election</p><h2 id="what-is-on-ballot">Who’s on the ballot?</h2></div><a className="text-link" href="/elections">Explore {contests.length} contests <ArrowRight size={16} /></a></div>
      <div className="home-election-grid">
        <div className="home-candidates">
          <div className="section-line"><h3>Presidential candidates</h3><span>INEC final list · A–Z</span></div>
          <CandidateRows people={tickets.slice(0, 3)} {...props} />
          <a className="text-link" href={contestPath(presidential)}>View all {tickets.length} named candidates <ArrowRight size={16} /></a>
          <form className="home-search" action="/elections"><label htmlFor="home-candidate">Find a candidate across the catalogue</label><div><input id="home-candidate" name="q" type="search" placeholder="Candidate, running mate or party" maxLength={120} /><input type="hidden" name="view" value="candidates" /><button type="submit" className="button" aria-label="Search candidates"><Search size={18} /></button></div></form>
        </div>
        <aside className="home-calendar"><div className="section-line"><h3>2027 calendar</h3><External href={links.calendar}>Source</External></div><ElectionCalendar /><a className="text-link" href="/election#election-dates">Add dates to my calendar <ArrowRight size={16} /></a><a className="text-link" href={contestPath(presidentialArchive)}>2023 presidential candidate archive <ArrowRight size={16} /></a></aside>
      </div>
    </section>

    <RightsFeature />

    <section className="wrap home-edition">
      <div className="home-section-head"><div><p className="kicker"><BookOpen size={16} aria-hidden="true" /> Voting day</p><h2>Make a plan before you go.</h2></div>{resume && <a className="text-link" href="/actions">Resume My Actions <ArrowRight size={16} /></a>}</div>
      <div className="home-learning-grid">
        <div className="home-lessons">{learning.map(({ title, detail, href, icon: Icon }) => <a key={href} href={href}><Icon size={25} strokeWidth={1.6} aria-hidden="true" /><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={17} aria-hidden="true" /></a>)}</div>
        <DeclarationPreview />
      </div>
    </section>
    <section className="wrap civic-band"><div><Camera size={29} strokeWidth={1.7} aria-hidden="true" /><h2>Civic Camera</h2><p>Document a community issue or a publicly displayed result sheet. Save a private receipt to reopen your report.</p></div><ActionLink href="/camera" secondary>Start a report</ActionLink></section>
    <section className="wrap home-edition update-edition"><div className="home-section-head"><div><p className="kicker">Official notices</p><h2>Election updates</h2></div><a className="text-link" href="/sources">All sources <ArrowRight size={16} /></a></div><ul className="field-updates">{updates.map(item => <li key={item.href}><p><time dateTime={item.date}>{nigeriaDate(item.date)}</time></p><div><h3>{item.title}</h3><p>{item.detail}</p></div><External href={item.href}>Read at INEC</External></li>)}</ul></section>
  </div>
}
