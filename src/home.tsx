import { ArrowRight, CalendarDays, Camera, ChevronRight, CircleCheck, ClipboardList, Fingerprint, GraduationCap, MapPin } from 'lucide-react'
import { candidates, dates, links, race, updates } from './content'
import { daysUntilNigeria, hasSavedPlan, nigeriaDate, type Plan } from './state'
import { ActionLink, External } from './ui'

function ElectionCalendar() {
  const upcoming = dates.filter(item => daysUntilNigeria(item.date) >= 0)
  const [next, ...later] = upcoming
  return <section className="election-calendar" aria-labelledby="home-calendar">
    <div className="calendar-heading">
      <h2 id="home-calendar"><CalendarDays size={15} /> Election calendar</h2>
      <External href={links.calendar}>INEC source</External>
    </div>
    {next ? <>
      <div className="calendar-main">
        <time dateTime={next.date} className="calendar-date">
          <strong>{nigeriaDate(next.date, { day: 'numeric' })}</strong>
          <span>{nigeriaDate(next.date, { month: 'long' })}<br />{nigeriaDate(next.date, { year: 'numeric' })}</span>
        </time>
        <div><h3>{next.title}</h3><p>{next.scope.startsWith('Nationwide') ? 'Nationwide' : next.scope}</p></div>
      </div>
      {later.map(item => <div key={item.date} className="calendar-next">
        <time dateTime={item.date}>{nigeriaDate(item.date, { day: 'numeric', month: 'short' })}</time><span>{item.title}</span>
      </div>)}
    </> : <p className="calendar-empty">Check INEC for the latest election dates.</p>}
  </section>
}

export function HomePage({ plan }: { plan: Plan }) {
  return <div className="wrap home-page">
    <section className="home-intro" aria-labelledby="home-title">
      <div className="home-lead">
        <p className="eyebrow election-edition"><span /> Nigeria · 2027 general elections</p>
        <h1 id="home-title">Get ready <em>to vote.</em></h1>
        <p>Get to know the candidates, find your polling unit and make a plan for election day.</p>
        <div className="home-actions">
          <ActionLink href="/election#candidates">See candidates</ActionLink>
          <External className="button button-secondary polling-action" href={links.polling}><MapPin size={16} /> Find my polling unit</External>
        </div>
      </div>
      <ElectionCalendar />
      <a className="mobile-camera-link" href="/camera"><Camera size={19} /><span><strong>Civic Camera</strong><small>Document a community issue</small></span><ArrowRight size={17} /></a>
    </section>

    <div className="home-content">
      <section className="home-roster" aria-labelledby="home-roster-title">
        <div className="section-head">
          <div><p className="eyebrow">Candidate register</p><h2 id="home-roster-title">{race.constituency}</h2></div>
          <p className="section-location"><MapPin size={15} /> {race.state}</p>
        </div>
        <div className="home-roster-meta"><p>{race.office}</p><External href={links.race}>{candidates.length} candidates on the INEC list</External></div>
        <ul className="home-candidates">
          {candidates.slice(0, 4).map(candidate => <li key={candidate.id}>
            <a href={`/election#candidate-${candidate.id}`} aria-label={`${candidate.name}, ${candidate.party} candidate details`}>
              <span className="party-code">{candidate.party}</span><strong>{candidate.name}</strong><ChevronRight size={17} />
            </a>
          </li>)}
        </ul>
        <div className="home-roster-footer"><a className="text-link" href="/election#candidates">View all {candidates.length} candidates <ArrowRight size={16} /></a><a className="text-link soft-link" href="/election#coverage">Looking for another area?</a></div>
      </section>

      <aside className="home-utilities" aria-label="Voter tools">
        <a className="camera-feature" href="/camera">
          <div className="camera-feature-head"><span className="utility-icon"><Camera size={21} /></span><ArrowRight size={19} /></div>
          <h2>Civic Camera</h2>
          <p>Document a community issue or public result sheet. Get a private receipt.</p>
          <strong>Start a report</strong>
        </a>
        <div className="utility-links">
          <External className="utility-row" href={links.voterStatus}><Fingerprint size={20} /><span><strong>Check voter registration</strong><small>INEC voter verification</small></span></External>
          <a className="utility-row" href="/practice"><GraduationCap size={21} /><span><strong>Practise election day</strong><small>Try a short rehearsal</small></span><ChevronRight size={16} /></a>
          {hasSavedPlan(plan) && <a className="utility-row" href="/election#polling-plan"><ClipboardList size={20} /><span><strong>Continue my plan</strong><small>Saved on this device</small></span><ChevronRight size={16} /></a>}
        </div>
      </aside>
    </div>

    <section className="home-updates" aria-labelledby="home-updates-title">
      <div className="section-head"><h2 id="home-updates-title">Election updates</h2><a className="text-link" href="/sources">All sources <ArrowRight size={16} /></a></div>
      <ul>{updates.map(item => <li key={item.href}>
        <p><CircleCheck size={14} /> INEC · <time dateTime={item.date}>{nigeriaDate(item.date)}</time></p>
        <External href={item.href}>{item.title}</External>
      </li>)}</ul>
    </section>
  </div>
}
