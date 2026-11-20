import { ArrowLeft, ArrowUpRight, FileText, Table2 } from 'lucide-react'
import { contestPath, presidentialArchive } from './catalogue'

export function ElectionArchive() {
  return <section className="wrap standard-page editorial-page">
    <a className="text-link back-link" href="/elections"><ArrowLeft size={16} aria-hidden="true" /> 2027 Elections</a>
    <header className="catalogue-title editorial-title"><p className="editorial-kicker">Historical records</p><h1>2023 Election Archive</h1><p>Inspect the candidates and declared national results from Nigeria’s 2023 presidential election.</p></header>
    <div className="guide-route-strip archive-routes">
      <a href={contestPath(presidentialArchive)}><FileText aria-hidden="true" /><span><strong>2023 presidential candidates</strong><small>Official nomination record</small></span><ArrowUpRight aria-hidden="true" /></a>
      <a href="/results"><Table2 aria-hidden="true" /><span><strong>2023 presidential results</strong><small>INEC national declaration</small></span><ArrowUpRight aria-hidden="true" /></a>
    </div>
    <p className="directory-caption">Archive coverage is limited to the national presidential contest.</p>
  </section>
}
