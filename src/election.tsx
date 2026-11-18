import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, CalendarDays, Check, ChevronDown, CircleCheck, FileText, Fingerprint, Landmark, ListChecks, LockKeyhole, MapPin, ScanLine, Vote } from 'lucide-react'
import { candidates, dates, links, partyNames, procedures, race, recognition, reviewed, states, steps, updates } from './content'
import { daysUntilNigeria, downloadReminder, nigeriaDate, type Plan } from './state'
import { ActionLink, CheckRow, External, PageTitle } from './ui'

type PlanProps = { plan: Plan; updatePlan: (value: Partial<Plan>) => void }

export function Election({ plan, updatePlan }: PlanProps) {
  return <div className="wrap standard-page">
    <PageTitle eyebrow="ELECTION PREPARATION" title="My Election" icon={Vote}>From checking your polling unit to reading your ballot, prepare at your own pace.</PageTitle>
    <nav className="election-jump" aria-label="On this page">
      <a href="#polling-plan">Private plan</a>
      <a href="#candidates">Candidates</a>
      <a href="#election-dates">Dates & checklist</a>
    </nav>
    <div className="page-grid">
      <div className="main-column">
        <section className="panel" aria-labelledby="voter-guide">
          <div className="panel-heading"><span className="card-icon mint"><Fingerprint size={23} /></span><div><h2 id="voter-guide">Start with the basics</h2><p>What to check before election day.</p></div></div>
          <div className="guide-steps">
            <article><h3>Check your registration</h3><p>Use INEC’s voter status service to check that your details appear on the register. You’ll need your physical Permanent Voter Card (PVC) for accreditation.</p><External href={links.voterStatus}>Check voter status with INEC</External></article>
            <article><h3>Find where you vote</h3><p>Use the official polling-unit finder to look up your assigned location. Save the name or code below so you can find it later.</p><External href={links.polling}>Open INEC polling-unit finder</External></article>
            <article><h3>Know what happens at the polls</h3><p>At your assigned unit, officials check your registration and accredit you with BVAS before issuing a ballot. Mark your choice in the private cubicle.</p><External href={links.education}>Read INEC voter guidance</External></article>
          </div>
        </section>
        <PollingPlan plan={plan} updatePlan={updatePlan} />
        <CandidateRace plan={plan} updatePlan={updatePlan} />
      </div>
      <aside className="side-column" aria-label="Election dates and preparation">
        <section className="panel" id="election-dates">
          <div className="panel-heading"><span className="card-icon mint"><CalendarDays size={21} /></span><div><h2>Election dates</h2><p>Published by INEC</p></div></div>
          <div className="date-list">
            {dates.map(item => {
              const days = daysUntilNigeria(item.date)
              return <article className="date-entry" key={item.date}>
              <span className="date-tile"><strong>{nigeriaDate(item.date, { day: 'numeric' })}</strong><span>{nigeriaDate(item.date, { month: 'short' })}</span></span>
              <div><h3>{item.title}</h3><p>{item.scope}{days === 0 ? ' · Today' : days > 0 ? ` · ${days} ${days === 1 ? 'day' : 'days'} away` : ''}</p>
                <button className="link-button" onClick={() => downloadReminder(item.date, item.title, `Check the latest date and local details with INEC. ${links.calendar}`)}>Download calendar event <ArrowUpRight size={14} /></button>
              </div>
            </article>
            })}
          </div>
          <External href={links.calendar}>Check the latest INEC calendar</External>
        </section>
        <section className="panel" aria-label="Your checklist">
          <div className="panel-heading"><span className="card-icon sand"><ListChecks size={22} /></span><div><h2>My checklist</h2><p>{plan.checklist.length} of {steps.length} done · Saved on this device</p></div></div>
          <progress className="progress" max={steps.length} value={plan.checklist.length} aria-label="Checklist progress" />
          <div className="checklist">
            {steps.map(step => <CheckRow key={step.id} checked={plan.checklist.includes(step.id)} onChange={() => updatePlan({ checklist: plan.checklist.includes(step.id) ? plan.checklist.filter(item => item !== step.id) : [...plan.checklist, step.id] })}>{step.label}</CheckRow>)}
          </div>
        </section>
        <section className="panel soft-panel">
          <div className="panel-heading"><span className="card-icon sand"><ScanLine size={22} /></span><div><h2>Rehearse election day</h2><p>Try four quick scenarios.</p></div></div>
          <ActionLink href="/practice" secondary>Start practice</ActionLink>
        </section>
      </aside>
    </div>
  </div>
}

function PollingPlan({ plan, updatePlan }: PlanProps) {
  const [feedback, setFeedback] = useState('')
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    updatePlan({
      state: String(values.get('state') ?? ''),
      lga: String(values.get('lga') ?? '').trim(),
      pollingUnit: String(values.get('pollingUnit') ?? '').trim(),
      notes: String(values.get('notes') ?? '').trim(),
      reminder: String(values.get('reminder') ?? ''),
    })
    setFeedback('Your plan is updated on this device.')
  }
  return <section className="panel" id="polling-plan">
    <div className="panel-heading"><span className="card-icon sage"><MapPin size={22} /></span><div><h2>Make a private plan</h2><p>Fill in whatever helps you get there. Every field is optional.</p></div></div>
    <form className="field-stack" onSubmit={save} onChange={() => setFeedback('')}>
      <div className="field-grid">
        <label>State<select name="state" defaultValue={plan.state}><option value="">Choose a state</option>{states.map(state => <option key={state}>{state}</option>)}</select></label>
        <label>Local government area<input name="lga" defaultValue={plan.lga} maxLength={80} placeholder="e.g. Surulere" /></label>
      </div>
      <label>Polling-unit name or code<input name="pollingUnit" defaultValue={plan.pollingUnit} maxLength={120} placeholder="Copy the details from INEC" /></label>
      <label>Preparation notes<textarea name="notes" defaultValue={plan.notes} maxLength={600} rows={3} placeholder="Directions, what to bring or when to leave" /></label>
      <label>Personal reminder date<input type="date" name="reminder" defaultValue={plan.reminder} min="2020-01-01" max="2100-12-31" /><span className="field-help">Save a date here, then export it to your calendar for an alert.</span></label>
      <div className="button-row"><button className="button" type="submit">Save my plan <Check size={17} /></button>{plan.reminder && <button className="button button-secondary" type="button" onClick={() => downloadReminder(plan.reminder, 'Election preparation', 'Open MataLens to review your private preparation.')}>Export reminder <CalendarDays size={16} /></button>}</div>
      <p className="field-feedback" role="status">{feedback}</p>
    </form>
  </section>
}

function CandidateRace({ plan, updatePlan }: PlanProps) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const matches = candidates.filter(item => `${item.name} ${item.party}`.toLowerCase().includes(query))
  return <section className="panel" id="candidates">
    <div className="panel-heading"><span className="card-icon sand"><Landmark size={23} /></span><div><h2>Explore a local ballot</h2><p>Candidate coverage for one federal constituency.</p></div></div>
    <div className="race-heading">
      <span className="eyebrow">LAGOS · FEDERAL CONSTITUENCY</span>
      <h3>{race.constituency}</h3>
      <p>{race.office} · {nigeriaDate(dates[0].date)} · {candidates.length} candidates on the INEC list</p>
      <External href={links.race}>INEC candidate list, rows 171–178</External>
    </div>
    <label className="field search-field">Search by name or party<input value={search} onChange={event => setSearch(event.target.value)} type="search" placeholder="Search Surulere I candidates" /></label>
    <div className="candidate-list">
      {matches.map(candidate => {
        const saved = plan.candidates.includes(candidate.id)
        return <article className="candidate" key={candidate.id}>
          <div className="candidate-row">
            <span className="party-tag">{candidate.party}</span>
            <h3>{candidate.name}</h3>
            <button className="icon-button bookmark" aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${candidate.name}${saved ? ' from' : ' to'} my preparation`} onClick={() => updatePlan({ candidates: saved ? plan.candidates.filter(id => id !== candidate.id) : [...plan.candidates, candidate.id] })}><Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /></button>
          </div>
          <details><summary>Candidate details <ChevronDown size={15} /></summary>
            <dl><div><dt>Party</dt><dd>{partyNames[candidate.party]}</dd></div><div><dt>Age on INEC list</dt><dd>{candidate.age}</dd></div><div><dt>Listed qualifications</dt><dd>{candidate.qualification}</dd></div></dl>
            <External href={links.race}>INEC source · checked {nigeriaDate(reviewed)}</External>
          </details>
        </article>
      })}
      {!matches.length && <p className="empty-inline" role="status">No candidates match that search.</p>}
    </div>
    <p className="field-help"><LockKeyhole size={15} /> Bookmarks stay in this browser. Check INEC for amendments and for other races.</p>
    <External href={links.allHouse}>Find other House of Representatives lists</External>
  </section>
}

export function Practice({ complete }: { complete: () => void }) {
  const [mode, setMode] = useState<'procedures' | 'recognition' | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const feedback = useRef<HTMLDivElement>(null)
  const questions = mode === 'recognition' ? recognition : procedures
  const question = questions[index]
  const finished = mode && index >= questions.length
  const source = mode === 'recognition' ? links.race : links.education

  useEffect(() => { if (mode) heading.current?.focus({ preventScroll: true }) }, [mode, index])
  useEffect(() => { if (answered) feedback.current?.focus({ preventScroll: true }) }, [answered])

  function restart(next: typeof mode) {
    setMode(next)
    setIndex(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
  }

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selected === null || answered) return
    if (selected === question.correct) setScore(score + 1)
    setAnswered(true)
  }

  function advance() {
    if (index + 1 === questions.length && mode === 'procedures') complete()
    setIndex(index + 1)
    setSelected(null)
    setAnswered(false)
  }

  return <section className="wrap standard-page practice-page">
    <PageTitle eyebrow="PRACTICE" title="A little rehearsal goes a long way." icon={ScanLine}>Get familiar with polling-day steps and learn to read a candidate list.</PageTitle>
    {!mode && <div className="journey-grid practice-options">
      <button className="journey-card mint" onClick={() => restart('procedures')}><span className="card-icon"><Vote size={23} /></span><span className="card-arrow"><ArrowUpRight size={20} /></span><h2>Election day</h2><p>Four everyday decisions, from finding your unit to casting your ballot.</p><span className="card-link">Start rehearsal <ArrowRight size={16} /></span></button>
      <button className="journey-card sand" onClick={() => restart('recognition')}><span className="card-icon"><Landmark size={23} /></span><span className="card-arrow"><ArrowUpRight size={20} /></span><h2>Read a candidate list</h2><p>Match all eight Surulere I candidates to the abbreviations on the INEC list.</p><span className="card-link">Start recognition <ArrowRight size={16} /></span></button>
    </div>}
    {mode && <div className="practice-shell">
      <button className="link-button practice-back" onClick={() => restart(null)}><ArrowLeft size={16} /> All exercises</button>
      {finished ? <div className="panel success-panel"><span className="success-icon"><CircleCheck size={29} /></span><p className="eyebrow">EXERCISE COMPLETE</p><h2 tabIndex={-1} ref={heading}>You got {score} of {questions.length} right.</h2><p>Revisit the source or go through the exercise again at your pace.</p><div className="button-row"><button className="button" onClick={() => restart(mode)}>Try again <ArrowRight size={17} /></button><External href={source}>Read the INEC source</External></div></div> : <form className="panel quiz-panel" onSubmit={check}>
        <div className="quiz-meta"><span>{mode === 'recognition' ? 'SURULERE I CANDIDATE LIST' : 'ELECTION DAY REHEARSAL'}</span><span>{index + 1} / {questions.length}</span></div>
        <progress className="progress" max={questions.length} value={index + Number(answered)} aria-label="Exercise progress" />
        <h2 tabIndex={-1} ref={heading} id="question-title">{question.prompt}</h2>
        <fieldset className="quiz-options" aria-labelledby="question-title" disabled={answered}>
          {question.options.map((option, optionIndex) => <label key={option} className={answered && optionIndex === question.correct ? 'correct-option' : ''}>
            <input type="radio" name="option" checked={selected === optionIndex} onChange={() => setSelected(optionIndex)} />
            <span>{option}</span>{answered && optionIndex === question.correct && <Check size={19} />}
          </label>)}
        </fieldset>
        {answered && <div className="quiz-feedback" ref={feedback} tabIndex={-1} role="status"><strong>{selected === question.correct ? 'That’s right.' : 'Here’s the correct answer.'}</strong><p>{question.explanation}</p><External href={source}>INEC source</External></div>}
        <div className="button-row">{answered ? <button key="advance" className="button" type="button" onClick={advance}>{index + 1 === questions.length ? 'See my score' : 'Next question'} <ArrowRight size={17} /></button> : <button key="check" className="button" type="submit" disabled={selected === null}>Check answer <ArrowRight size={17} /></button>}</div>
      </form>}
    </div>}
  </section>
}

export function Sources() {
  return <section className="wrap standard-page narrow">
    <PageTitle eyebrow="INFORMATION & ATTRIBUTION" title="Sources & updates" icon={FileText}>Dated announcements and the official references behind MataLens.</PageTitle>
    <div className="panel">
      <h2>Recent INEC notices</h2>
      <div className="source-list">{updates.map(item => <article key={item.href}><p className="eyebrow">INEC · {nigeriaDate(item.date)}</p><h3>{item.title}</h3><p>{item.detail}</p><External href={item.href}>Read the notice</External></article>)}</div>
      <External href={links.updates}>Find newer updates at INEC</External>
    </div>
    <div className="panel prose">
      <h2>Where our guides come from</h2>
      <p>We checked the sources below on {nigeriaDate(reviewed, { dateStyle: 'long' })}. MataLens is an independent civic project. Check the original source for changes, especially before travelling to vote.</p>
      <ul>
        <li><External href={links.calendar}>INEC election dates</External></li>
        <li><External href={links.education}>INEC voter education and procedures</External></li>
        <li><External href={links.guidelines}>INEC regulations and guidelines</External></li>
        <li><External href={links.pollingGuide}>INEC polling-unit guidance</External></li>
        <li><External href={links.parties}>INEC political party register</External></li>
        <li><External href={links.race}>INEC list used for Surulere I candidate records</External></li>
      </ul>
    </div>
  </section>
}
