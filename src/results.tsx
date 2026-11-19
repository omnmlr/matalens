import { useState } from 'react'
import { ArrowRight, FileCheck2 } from 'lucide-react'
import { irevLink } from './catalogue'
import { nigeriaDate } from './state'
import { External } from './ui'

const declaration = {
  title: '2023 presidential election',
  declared: '2023-03-01',
  source: 'https://wp1.inecnigeria.org/wp-content/uploads/2024/02/2023-GENERAL-ELECTION-REPORT-1.pdf#page=457',
  valid: 24_025_940,
  rejected: 939_278,
  electedParty: 'APC',
  rows: [
    ['A', 'Imumolen Irene Christopher', 61_014],
    ['AA', 'Almustapha Hamza', 14_542],
    ['AAC', 'Sowore Omoyele Stephen', 14_608],
    ['ADC', 'Kachikwu Dumebi', 81_919],
    ['ADP', 'Sani Yabagi Yusuf', 43_924],
    ['APC', 'Tinubu Bola Ahmed', 8_794_726],
    ['APGA', 'Umeadi Peter Nnanna Chukwudi', 61_966],
    ['APM', 'Ojei Princess Chichi', 25_961],
    ['APP', 'Nnadi Charles Osita', 12_839],
    ['BP', 'Adenuga Sunday Oluwafemi', 16_156],
    ['LP', 'Obi Peter Gregory', 6_101_533],
    ['NNPP', 'Musa Mohammed Rabiu Kwankwaso', 1_496_687],
    ['NRM', 'Osakwe Felix Johnson', 24_869],
    ['PDP', 'Abubakar Atiku', 6_984_520],
    ['PRP', 'Abiola Latifu Kolawole', 72_144],
    ['SDP', 'Adebayo Adewole Ebenezer', 80_267],
    ['YPP', 'Ado-Ibrahim Abdulmalik', 60_600],
    ['ZLP', 'Nwanyanwu Daniel Daberechukwu', 77_665],
  ] as const,
}
const number = new Intl.NumberFormat('en-NG')

export function DeclarationPreview() {
  return <section className="field-archive">
    <FileCheck2 size={25} aria-hidden="true" />
    <div><p className="kicker">Results archive</p><h2>{declaration.title}</h2><p>INEC national declaration · <time dateTime={declaration.declared}>{nigeriaDate(declaration.declared)}</time></p></div>
    <a className="text-link" href="/results">Read the declared results <ArrowRight size={16} /></a>
  </section>
}

export function ResultsPage() {
  const [year, setYear] = useState('2023')
  return <section className="wrap standard-page">
    <div className="catalogue-title"><p className="kicker">Official declarations</p><h1>Results archive</h1><p>Read declared results with the original INEC source.</p></div>
    <label className="directory-label race-search">Election year<select value={year} onChange={event => setYear(event.target.value)}><option>2023</option><option>2027</option></select></label>
    <div className="record-grid results-grid">
      {year === '2027' ? <div className="directory-note"><h2>No 2027 declarations in this archive</h2><p>Check INEC for official election publications.</p><a className="text-link" href="/elections">Explore scheduled elections <ArrowRight size={16} /></a></div> : <div>
        <div className="field-section-head"><div><h2>{declaration.title}</h2><p>National · Declared <time dateTime={declaration.declared}>{nigeriaDate(declaration.declared)}</time></p></div></div>
        <table className="results-table">
          <caption className="sr-only">Votes in INEC’s declaration order</caption>
          <thead><tr><th scope="col">Candidate</th><th scope="col">Party</th><th scope="col">Votes</th></tr></thead>
          <tbody>{declaration.rows.map(([party, person, votes]) => <tr key={party}><th scope="row">{person}{party === declaration.electedParty && <small>Declared elected</small>}</th><td>{party}</td><td>{number.format(votes)}</td></tr>)}</tbody>
          <tfoot><tr><th scope="row" colSpan={2}>Valid votes</th><td>{number.format(declaration.valid)}</td></tr><tr><th scope="row" colSpan={2}>Rejected votes</th><td>{number.format(declaration.rejected)}</td></tr></tfoot>
        </table>
      </div>}
      <aside className="source-rail" aria-label="Results sources">
        <h2>Read the sources</h2><External href={declaration.source}>INEC 2023 report · Annexure 2</External>
        <p>The national totals are transcribed in the order printed in the declaration. INEC publishes polling-unit sheets separately.</p>
        <External href="https://inecnigeria.org/elections/general-2023">INEC 2023 election publications</External>
        <External href={irevLink}>Open INEC IReV</External>
        <a className="text-link" href="/corrections?record=2023-president">Flag a factual error <ArrowRight size={16} /></a>
      </aside>
    </div>
  </section>
}
