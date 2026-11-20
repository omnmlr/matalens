import { ClipboardList, Download } from 'lucide-react'
import { candidatePath, roster } from './catalogue'
import { steps } from './content'
import { downloadReminder, hasSavedPlan, nigeriaDate, type Plan } from './state'
import { ActionLink } from './ui'

export function PreparationPanel({ plan }: { plan: Plan }) {
  const savedCandidates = roster.filter(item => plan.candidates.includes(item.id))
  const hasPlan = hasSavedPlan(plan)
  return <section className="panel">
  <div className="panel-heading"><span className="card-icon mint"><ClipboardList size={22} /></span><div><h2>My preparation</h2><p>Private to this browser</p></div></div>
  {hasPlan ? <div className="saved-plan">
    <p>{plan.checklist.length} of {steps.length} checklist steps done{plan.practiced ? ' · Rehearsal completed' : ''}</p>
    {(plan.state || plan.lga || plan.pollingUnit) && <div><h3>My polling plan</h3><p>{[plan.state, plan.lga, plan.pollingUnit].filter(Boolean).join(' · ')}</p></div>}
    {plan.notes && <div><h3>My notes</h3><p>{plan.notes}</p></div>}
    {savedCandidates.length > 0 && <div><h3>Candidate bookmarks</h3><ul>{savedCandidates.map(candidate => <li key={candidate.id}><a className="text-link" href={candidatePath(candidate.id)}>{candidate.name} · {candidate.party}</a></li>)}</ul></div>}
    {plan.reminder && <div><h3>Personal reminder</h3><p>{nigeriaDate(plan.reminder)}</p><button className="link-button" onClick={() => downloadReminder(plan.reminder, 'Election preparation', 'Open MataLens to review your private preparation.')}>Export to calendar <Download size={15} /></button></div>}
  </div> : <p>Save a polling plan, bookmark a candidate or check off a step in My Election to see it here.</p>}
  <ActionLink href={plan.ballot?.place ? "/my-ballot" : "/election#polling-plan"} secondary>{plan.ballot?.place ? "Continue My Ballot" : hasPlan ? "Continue my plan" : "Make a private plan"}</ActionLink>
</section>
}
