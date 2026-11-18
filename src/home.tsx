import { ArrowRight, ArrowUpRight, CalendarDays, Camera, ChevronRight, CircleCheck, ClipboardList, ScanLine, ShieldCheck, Vote } from 'lucide-react'
import { dates, links } from './content'
import { daysUntilNigeria, nigeriaDate, type Plan } from './state'
import { ActionLink, External } from './ui'

const journeys = [
  { title: 'My Election', icon: Vote, href: '/election', tone: 'mint', summary: 'Find your polling unit, explore the ballot and make a private plan.', label: 'Get prepared' },
  { title: 'Practice', icon: ScanLine, href: '/practice', tone: 'sand', summary: 'Walk through what happens at the polling unit, one decision at a time.', label: 'Try an exercise' },
  { title: 'Civic Camera', icon: Camera, href: '/camera', tone: 'sage', summary: 'Document a community issue or public result sheet and get a private receipt.', label: 'Start a report' },
]

export function HomePage({ plan }: { plan: Plan }) {
  const next = dates.find(item => daysUntilNigeria(item.date) >= 0)
  return <div className="wrap home-page">
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" /> YOUR CIVIC COMPANION</p>
        <h1 id="home-title">See what matters.<br /><em>Know what to<br className="desktop-break" /> do next.</em></h1>
        <p>Get ready to vote, practise election day and document what needs attention in your community.</p>
        <div className="hero-actions">
          <ActionLink href="/election">Explore my election</ActionLink>
          <a className="quiet-action" href="/camera"><Camera size={17} /> Civic Camera <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <img src="/hero.webp" alt="" width="1200" height="800" fetchPriority="high" />
        <span className="focus-corner top-left" /><span className="focus-corner top-right" />
        <span className="focus-corner bottom-left" /><span className="focus-corner bottom-right" />
        {next && <div className="hero-date">
          <span className="hero-date-icon"><CalendarDays size={19} /></span>
          <div><span>{next.shortLabel}</span><strong>{nigeriaDate(next.date, { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
        </div>}
      </div>
    </section>

    <section className="home-journeys" aria-labelledby="journeys-title">
      <div className="section-heading">
        <div><h2 id="journeys-title">Make your next move.</h2><p>Choose what you’d like to do today.</p></div>
        <a className="text-link section-side" href="/actions"><ClipboardList size={17} /> My Actions <ChevronRight size={15} /></a>
      </div>
      <div className="journey-grid">
        {journeys.map(({ title, icon: Icon, href, tone, summary, label }) => <a href={href} className={`journey-card ${tone}`} key={href}>
          <span className="card-icon"><Icon size={23} strokeWidth={1.7} /></span>
          <span className="card-arrow"><ArrowUpRight size={20} /></span>
          <h3>{title}</h3>
          <p>{summary}</p>
          <span className="card-link">{label}<ArrowRight size={15} /></span>
        </a>)}
      </div>
    </section>

    <section className="home-notes" aria-label="Preparation and sources">
      {next && <div className="home-note">
        <span className="card-icon"><CalendarDays size={21} /></span>
        <div><h3>{next.title}</h3><p>{nigeriaDate(next.date, { dateStyle: 'long' })} · INEC election calendar</p></div>
        <External href={links.calendar}>Source</External>
      </div>}
      <div className="home-note">
        <span className="card-icon">{plan.checklist.length ? <CircleCheck size={21} /> : <ShieldCheck size={21} />}</span>
        <div><h3>{plan.checklist.length ? 'Pick up your preparation' : 'Private by design'}</h3><p>{plan.checklist.length ? `${plan.checklist.length} checklist steps saved here` : 'Your election choices stay on this device.'}</p></div>
        <a className="text-link" href={plan.checklist.length ? '/actions' : '/privacy'}>{plan.checklist.length ? 'My Actions' : 'Privacy'} <ArrowRight size={15} /></a>
      </div>
    </section>
  </div>
}
