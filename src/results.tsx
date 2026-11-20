import { ArrowRight, FileCheck2 } from 'lucide-react'
import { candidateById, candidatePath, contestPath, declaration, irevLink, offices, partyPath, presidential, presidentialArchive, sources } from './catalogue'
import { useQueryField } from './directory'
import { nigeriaDate } from './state'
import { External } from './ui'

const source = sources[presidentialArchive.sourceId]
const number = new Intl.NumberFormat('en-NG')
const pct = new Intl.NumberFormat('en-NG', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })
const voteRows = declaration.entries.map(entry => ({ ...entry, person: candidateById.get(entry.candidateId)! }))
const top = [...voteRows].sort((a, b) => b.votes - a.votes).slice(0, 4)

export function DeclarationPreview() {
  return <section className="archive-preview">
    <FileCheck2 size={22} aria-hidden="true" /><p className="kicker">Declared results / 2023</p><h2>How Nigeria voted.</h2>
    <div className="archive-number"><strong>{number.format(declaration.valid)}</strong><span>valid votes in the presidential election</span></div>
    <a className="text-link" href="/results">See the declaration <ArrowRight size={16} /></a>
  </section>
}

export function ResultsPage() {
  const [year, setYear] = useQueryField('year', '2023')
  const [office, setOffice] = useQueryField('office', 'President')
  const [area, setArea] = useQueryField('place', 'National')
  const available = year === '2023' && (office === 'President' || !office) && (area === 'National' || !area)
  return <section className="wrap standard-page results-page">
    <a className="text-link back-link" href="/archive">2023 Election Archive <ArrowRight size={16} aria-hidden="true" /></a>
    <div className="catalogue-title"><p className="kicker">Historical records · INEC</p><h1>2023 presidential results</h1><p>Read INEC’s national declaration and trace the vote totals to the original record.</p></div>
    <div className="catalogue-filters"><label className="directory-label">Election year<select value={year} onChange={event => setYear(event.target.value)}><option>2023</option><option>2027</option></select></label><label className="directory-label">Office<select value={office} onChange={event => setOffice(event.target.value)}><option value="">All offices</option>{Object.values(offices).map(record => <option key={record.label}>{record.label}</option>)}</select></label><label className="directory-label">Geography<select value={area} onChange={event => setArea(event.target.value)}><option value="">All areas</option><option>National</option><option>Edo</option><option>Lagos</option><option>Oyo</option></select></label></div>
    <div className="record-grid results-grid">
      <div>
        {available ? <>
          <div className="field-section-head"><div><h2>{presidentialArchive.label}</h2><p>National · Declared <time dateTime={declaration.declared}>{nigeriaDate(declaration.declared)}</time></p></div></div>
          <section className="result-chart" aria-label="Vote share of four largest totals">
            <h3>Largest vote shares</h3><p>Share of {number.format(declaration.valid)} valid votes</p>
            {top.map(({ person, votes }) => <div className="result-bar" key={person.id}><div><a href={candidatePath(person.id)}>{person.name}</a><span>{pct.format(votes / declaration.valid)}</span></div><progress max={declaration.valid} value={votes} aria-label={person.name + ' vote share'} /></div>)}
          </section>
          <table className="results-table">
            <caption className="sr-only">Votes in INEC’s declaration order</caption>
            <thead><tr><th scope="col">Candidate</th><th scope="col">Party</th><th scope="col">Votes</th></tr></thead>
            <tbody>{voteRows.map(({ person, votes }) => <tr key={person.id}><th scope="row"><a className="result-name" href={candidatePath(person.id)}>{person.name}</a>{person.party === declaration.electedParty && <small>Declared elected</small>}</th><td><a className="result-party" href={partyPath(person.party) + '?year=2023'}>{person.party}</a></td><td>{number.format(votes)}</td></tr>)}</tbody>
            <tfoot><tr><th scope="row" colSpan={2}>Valid votes</th><td>{number.format(declaration.valid)}</td></tr><tr><th scope="row" colSpan={2}>Rejected votes</th><td>{number.format(declaration.rejected)}</td></tr></tfoot>
          </table>
        </> : <div className="directory-note" role="status"><h2>{year === '2027' ? 'No 2027 declarations in this archive' : 'No declaration for this selection'}</h2><p>Current archive coverage is the 2023 national presidential declaration.</p><button className="link-button" onClick={() => { setYear('2023'); setOffice('President'); setArea('National') }}>Show the 2023 presidential declaration</button><br /><a className="text-link" href={contestPath(presidential)}>Open the 2027 presidential roster <ArrowRight size={16} /></a></div>}
      </div>
      <aside className="source-rail" aria-label="Results sources">
        <h2>Official record</h2><External href={source.url}>{source.label}</External>
        <p>Report published February 2024. Source reviewed <time dateTime={source.reviewed}>{nigeriaDate(source.reviewed)}</time>.</p>
        <a className="text-link" href={contestPath(presidentialArchive)}>Open the 2023 candidate archive <ArrowRight size={16} /></a>
        <h3>Polling-unit evidence</h3><p>INEC IReV publishes polling-unit sheets. This archive uses INEC’s national declaration.</p>
        <External href={irevLink}>Open INEC IReV</External>
        <a className="text-link" href="/corrections?record=2023-president">Flag a factual error <ArrowRight size={16} /></a>
      </aside>
    </div>
  </section>
}
