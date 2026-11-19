import { ArrowLeft, ArrowRight, BookOpen, MapPin } from 'lucide-react'
import { actLink, contactLink, rights } from './catalogue'
import { links, reviewed } from './content'
import { nigeriaDate } from './state'
import { ActionLink, External } from './ui'

export function RightsFeature() {
  const [featured, ...others] = rights
  return <section className="field-rights" aria-labelledby="featured-right">
    <div className="field-rights-main">
      <div><p className="kicker">Know your rights</p><h2 id="featured-right">{featured.title}</h2><p>{featured.summary}</p></div>
      <div className="field-situation"><BookOpen size={22} aria-hidden="true" /><h3>{featured.situation}</h3><a className="text-link" href={`/rights/${featured.slug}`}>What you can do <ArrowRight size={16} /></a></div>
    </div>
    <nav className="field-rights-links" aria-label="More voting rights">
      {others.map(right => <a className="text-link" href={`/rights/${right.slug}`} key={right.slug}>{right.topic} <ArrowRight size={14} /></a>)}
      <a className="text-link" href="/rights">All rights guides <ArrowRight size={14} /></a>
    </nav>
  </section>
}

export function RightsPage({ slug }: { slug?: string }) {
  const right = rights.find(item => item.slug === slug)
  if (!right) return <section className="wrap standard-page">
    <div className="catalogue-title"><p className="kicker">Voting guidance</p><h1>Know your rights</h1><p>Find out what to do in common situations at the polls.</p></div>
    <ul className="guide-index">{rights.map(item => <li key={item.slug}>
      <a href={`/rights/${item.slug}`}><BookOpen size={21} aria-hidden="true" /><span><strong>{item.situation}</strong><span>{item.topic}</span></span><ArrowRight size={18} aria-hidden="true" /></a>
    </li>)}</ul>
    <div className="directory-note"><h2>Get ready for election day</h2><p>Check your registration, find your polling unit and practise the voting process.</p><ActionLink href="/election#polling-unit" secondary>Election day preparation</ActionLink></div>
  </section>
  return <article className="wrap standard-page">
    <a className="text-link back-link" href="/rights"><ArrowLeft size={16} /> All rights guides</a>
    <div className="catalogue-title"><p className="kicker">{right.topic}</p><h1>{right.title}</h1><p>{right.summary}</p></div>
    <div className="record-grid">
      <div className="guide-reading">
        <section className="guide-callout"><h2>{right.situation}</h2><p>{right.action}</p></section>
        <section><h2>What you can do</h2><ul>{right.steps.map(step => <li key={step}>{step}</li>)}</ul></section>
        <section><h2>Where to get guidance</h2><p>Use INEC’s official contact page for questions about INEC-administered elections.</p>
          {right.slug === 'assigned-polling-unit' && <External href={links.polling}><MapPin size={16} /> Open INEC polling-unit finder</External>}
          <External className="button" href={contactLink}>Open INEC contact centre</External>
        </section>
      </div>
      <aside className="source-rail" aria-label="Sources and scope">
        <h2>Sources and scope</h2>
        <p>Applies to INEC-administered elections covered by the Electoral Act. Check the relevant electoral authority for other elections.</p>
        <External href={actLink}>Electoral Act 2026 · {right.section}</External>
        <External href={links.guidelines}>INEC election guidelines</External>
        <p>Source checked <time dateTime={reviewed}>{nigeriaDate(reviewed)}</time></p>
      </aside>
    </div>
  </article>
}
