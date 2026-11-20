import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Pause, Play, ShieldCheck } from 'lucide-react'
import { actLink, contactLink, matchWords, rights } from './catalogue'
import { links } from './content'
import { SearchField, useQueryField } from './directory'
import { nigeriaDate } from './state'
import { ActionLink, External } from './ui'

function RightAdvice({ right, deepLink = false }: { right: typeof rights[number]; deepLink?: boolean }) {
  return <div className="right-advice">
    <p><strong>What it means.</strong> {right.summary}</p>
    <p><strong>At the polls.</strong> {right.situation}</p>
    {right.concern && <p><strong>What may be a violation.</strong> {right.concern}</p>}
    <p><strong>What you can do.</strong> {right.action}</p>
    <ul>{right.steps.map(step => <li key={step}>{step}</li>)}</ul>
    <div className="inline-actions">
      <External href={actLink}>Electoral Act 2026 · {right.section}</External>
      <External href={right.slug === 'assigned-polling-unit' ? links.polling : contactLink}>{right.slug === 'assigned-polling-unit' ? 'INEC polling-unit finder' : 'INEC contact centre'}</External>
      {deepLink && <a className="text-link" href={'/rights/' + right.slug}>Read the full guide <ArrowRight size={15} /></a>}
    </div>
  </div>
}

export function RightsFeature() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const carousel = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const right = rights[active]

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(motion.matches)
    motion.addEventListener('change', change)
    return () => motion.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    if (!carousel.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 })
    observer.observe(carousel.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || paused || hovered || focused || open || reduced) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % rights.length)
    }, 7500)
    return () => window.clearInterval(timer)
  }, [visible, paused, hovered, focused, open, reduced])

  function move(offset: number) {
    setPaused(true)
    setOpen(false)
    setActive(index => (index + offset + rights.length) % rights.length)
  }
  function keys(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  return <section className="rights-feature" aria-labelledby="featured-right">
    <div className="wrap rights-layout">
      <div className="rights-intro"><ShieldCheck size={23} aria-hidden="true" /><p className="kicker">Your rights at the polls</p><h2 id="featured-right">Know your rights.</h2><p>Prepare for situations that can come up on election day, with guidance grounded in the Electoral Act.</p><a className="text-link" href="#rights-guides">Browse all rights guides <ArrowRight size={16} /></a></div>
      <div className="rights-carousel" ref={carousel} role="group" aria-label="Voting rights reminders"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
        <div className="rights-controls" onKeyDown={keys}>
          <p className="kicker">Rights reminder <span>{active + 1} / {rights.length}</span></p>
          <div>
            <button className="icon-button" type="button" aria-label="Previous reminder" onClick={() => move(-1)}><ChevronLeft size={18} /></button>
            <button className="icon-button" type="button" aria-label="Next reminder" onClick={() => move(1)}><ChevronRight size={18} /></button>
            {!reduced && <button className="icon-button" type="button" aria-label={paused ? 'Play reminders' : 'Pause reminders'} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
          </div>
        </div>
        <div className="rights-message" aria-live={paused || reduced || focused ? 'polite' : 'off'}>
          <div className="rights-slide" key={right.slug}><h3>{right.title}</h3><p>{right.summary}</p></div>
          <button type="button" className="link-button" aria-expanded={open} aria-controls="reminder-advice" onClick={() => { setPaused(true); setOpen(!open) }}>What you can do <ChevronDown size={17} /></button>
        </div>
        <div className="rights-expansion" id="reminder-advice" hidden={!open}>{open && <RightAdvice right={right} deepLink />}</div>
      </div>
    </div>
  </section>
}

export function RightsPage({ slug }: { slug?: string }) {
  const right = rights.find(item => item.slug === slug)
  const [query, setQuery] = useQueryField('q')
  const [topic, setTopic] = useQueryField('topic')
  const filtered = rights.filter(item => (!topic || item.topic === topic) && matchWords([item.slug, item.topic, item.title, item.summary, item.situation, item.concern, item.action, ...item.steps].join(' '), query))
  return <><section className="wrap standard-page rights-page">
    {right && <a className="text-link back-link" href="/rights"><ArrowLeft size={16} /> All rights guides</a>}
    <div className="catalogue-title" id="rights-guides"><p className="kicker">{right?.topic ?? 'Voting guidance / Nigeria'}</p><h1>{right?.title ?? 'Know your rights'}</h1><p>{right?.summary ?? 'Practical advice for common situations at INEC-administered elections.'}</p></div>
    <div className="record-grid">
      <div>
        {right ? <RightAdvice right={right} /> : <>
          <div className="catalogue-filters right-filters"><SearchField label="Search rights guides" value={query} update={setQuery} placeholder="e.g. assistance" /><label className="directory-label">Topic<select value={topic} onChange={event => setTopic(event.target.value)}><option value="">All topics</option>{rights.map(item => <option key={item.slug}>{item.topic}</option>)}</select></label></div>
          <p className="directory-caption" role="status">{filtered.length} {filtered.length === 1 ? 'guide' : 'guides'}</p>
          {filtered.length ? <ul className="right-index">{filtered.map(item => <li key={item.slug}><details className="registry-disclosure"><summary><ShieldCheck size={21} aria-hidden="true" /><span><strong>{item.topic}</strong><small>{item.title}</small></span><ChevronDown size={18} aria-hidden="true" /></summary><RightAdvice right={item} deepLink /></details></li>)}</ul> :
            <div className="directory-note"><p>No rights guides match this search.</p><button className="link-button" onClick={() => { setQuery(''); setTopic('') }}>Clear filters</button></div>}
        </>}
      </div>
      <aside className="source-rail"><h2>Official guidance</h2><p>These guides cover INEC-administered elections. Check the relevant election authority for other polls.</p><External href={actLink}>Electoral Act 2026{right && ' · ' + right.section}</External><External href={links.guidelines}>INEC election guidelines</External><External href={contactLink}>Contact INEC</External><p>Reviewed <time dateTime="2026-11-20">{nigeriaDate('2026-11-20')}</time></p><a href="/election#polling-unit" className="text-link">Prepare to vote <ArrowRight size={15} /></a></aside>
    </div>
    <div className="rights-handoff"><div><h2>Document an issue safely</h2><p>Civic Camera gives you a private MataLens receipt. For official assistance, use the election authority’s contact information.</p></div><ActionLink href="/camera" secondary>Open Civic Camera</ActionLink></div>
  </section>{!right && <RightsFeature />}</>
}
