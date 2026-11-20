import { ArrowRight, FileCheck2, Files } from 'lucide-react'
import type { Story } from './story-contract'
import { storyPath } from './stories'
import { External } from './ui'

export const recruitmentStoryId = 'inec-recruitment-deadline-2027'

const recruitmentSources = [
  { id: 'recruitment-notice', role: 'Official INEC notice', date: '2026-12-02', label: '2 December 2026', Icon: FileCheck2 },
  { id: 'recruitment-statement', role: 'Republished INEC statement', date: '2026-12-03', label: '3 December 2026', Icon: Files },
]

export function recruitmentComparison(story: Story) {
  if (story.id !== recruitmentStoryId) return
  const comparison = story.sourceComparisons?.find(item => recruitmentSources.every(entry => item.sourceIds.includes(entry.id)))
  if (!comparison) return
  const entries = recruitmentSources.flatMap(entry => {
    const source = story.sources.find(item => item.id === entry.id)
    return source?.evidence?.includes(entry.label) ? [{ ...entry, source }] : []
  })
  return entries.length === recruitmentSources.length ? { comparison, entries } : undefined
}

export function RecruitmentComparison({ story, compact = false }: { story: Story; compact?: boolean }) {
  const evidence = recruitmentComparison(story)
  if (!evidence) return null
  return <section className="evidence-case" id="source-comparison" aria-labelledby="case-title">
    <header className="case-header">
      <p className="editorial-kicker">Evidence comparison</p>
      <h2 id="case-title" tabIndex={-1}>One deadline extension. Two published dates.</h2>
      <p>Both sources report an extension for election staff applications. They differ on the revised cutoff.</p>
    </header>
    <div className="case-documents">
      {evidence.entries.map(({ source, role, date, label, Icon }, index) => <article key={source.id} className={index === 0 ? 'case-document case-primary' : 'case-document'}>
        <div className="case-role"><Icon size={19} strokeWidth={1.7} aria-hidden="true" /> {role}</div>
        <h3><time dateTime={date}>{label}</time></h3>
        <p>{source.publisher}</p>
        {!compact && <p className="case-excerpt">{source.evidence}</p>}
        <External href={source.url}>{index === 0 ? 'Read the official notice' : 'Read the republished statement'}</External>
      </article>)}
    </div>
    {compact ? <a className="case-continue text-link" href={storyPath(story.id) + '#source-comparison'}>Investigate the deadline discrepancy <ArrowRight size={17} aria-hidden="true" /></a> :
      <div className="case-verdict">
        <div><h3>Before applying</h3><p>{evidence.comparison.summary}</p></div>
        {story.openQuestion && <div><h3>Still unclear</h3><p>{story.openQuestion}</p></div>}
      </div>}
  </section>
}
