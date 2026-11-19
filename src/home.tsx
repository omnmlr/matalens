import { ArrowRight, CalendarDays, Camera, ClipboardList, Fingerprint, GraduationCap, MapPin } from 'lucide-react'
import { dates, links, updates } from './content'
import { daysUntilNigeria, hasSavedPlan, nigeriaDate, type Plan } from './state'
import { External } from './ui'
import { DirectoryFinder } from './directory'
import { RightsFeature } from './rights'
import { DeclarationPreview } from './results'

function ElectionCalendar() {
  const [next, ...later] = dates.filter(item => daysUntilNigeria(item.date) >= 0)
  return <section className="field-calendar" aria-labelledby="home-calendar">
    <div className="field-calendar-heading"><h2 id="home-calendar"><CalendarDays size={16} aria-hidden="true" /> Election calendar</h2><External href={links.calendar}>INEC</External></div>
    {next ? <>
      <div className="field-next">
        <time dateTime={next.date}><strong>{nigeriaDate(next.date, { day: 'numeric' })}</strong><span>{nigeriaDate(next.date, { month: 'short' })}<br />{nigeriaDate(next.date, { year: 'numeric' })}</span></time>
        <div><h3>{next.title}</h3><p>{next.scope.startsWith('Nationwide') ? 'Nationwide' : next.scope}</p></div>
      </div>
      {later.map(item => <div key={item.date} className="field-later">
        <time dateTime={item.date}>{nigeriaDate(item.date, { day: 'numeric', month: 'short', year: 'numeric' })}</time><span>{item.title}</span>
      </div>)}
    </> : <p className="field-calendar-empty">Check the official calendar for upcoming elections.</p>}
  </section>
}

export function HomePage({ plan }: { plan: Plan }) {
  return <>
    <section className="field-masthead" aria-labelledby="home-title">
      <div className="wrap field-masthead-grid">
        <div className="field-intro">
          <h1 id="home-title">Make sense of your election</h1>
          <p>Find candidates, prepare to vote and know what to do if something goes wrong.</p>
          <div className="field-actions">
            <External href={links.polling}><MapPin size={17} aria-hidden="true" /> Find my polling unit</External>
            <a className="text-link" href="/camera"><Camera size={17} aria-hidden="true" /> Start a report <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
        <ElectionCalendar />
      </div>
    </section>
    <div className="wrap field-home">
      <section aria-labelledby="field-directory-title">
        <div className="field-section-head"><h2 id="field-directory-title">Explore elections</h2><a className="text-link" href="/elections">All elections <ArrowRight size={16} /></a></div>
        <DirectoryFinder />
      </section>
      <RightsFeature />
      <div className="field-bottom">
        <section aria-labelledby="field-prepare">
          <div className="field-section-head"><h2 id="field-prepare">Prepare to vote</h2></div>
          <External className="utility-row" href={links.voterStatus}><Fingerprint size={21} /><span><strong>Check voter registration</strong><small>INEC voter verification</small></span></External>
          <a className="utility-row" href="/practice"><GraduationCap size={21} /><span><strong>Practise election day</strong><small>Rehearse the voting process</small></span><ArrowRight size={17} /></a>
          <a className="utility-row" href="/election#polling-plan"><ClipboardList size={21} /><span><strong>{hasSavedPlan(plan) ? 'Continue my plan' : 'Make a private plan'}</strong><small>Saved only on this device</small></span><ArrowRight size={17} /></a>
        </section>
        <section aria-labelledby="field-updates">
          <div className="field-section-head"><h2 id="field-updates">Election updates</h2><a className="text-link" href="/sources">All updates <ArrowRight size={16} /></a></div>
          <ul className="field-updates">{updates.map(item => <li key={item.href}>
            <p>INEC · <time dateTime={item.date}>{nigeriaDate(item.date)}</time></p><External href={item.href}>{item.title}</External>
          </li>)}</ul>
        </section>
      </div>
      <DeclarationPreview />
    </div>
  </>
}
