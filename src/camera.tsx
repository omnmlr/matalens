import { useEffect, useEffectEvent, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Camera, Check, CircleAlert, ClipboardList, Copy, Download, FileCheck2, FileImage, KeyRound, Landmark, LockKeyhole, MapPin, Upload, X } from 'lucide-react'
import { candidates, steps } from './content'
import { codeFromInput, downloadFile, downloadReminder, newReceiptCode, nigeriaDate, receiptCodePattern, receiptRequest, type Plan, type ReceiptEntry, type Report } from './state'
import { ActionLink, CheckRow, PageTitle } from './ui'

const categories = ['Road or pavement', 'Drainage or flooding', 'Public facility', 'Waste or sanitation', 'Other community issue']
const fileTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxBytes = 8 * 1024 * 1024
type ReceiptProps = { remember: (entry: ReceiptEntry) => boolean; forget: (code: string) => void }

function entryFor(report: Report, code: string): ReceiptEntry {
  return { code, id: report.id, category: report.category, createdAt: report.createdAt }
}

export function CameraPage({ online, remember }: { online: boolean; remember: ReceiptProps['remember'] }) {
  const [intake, setIntake] = useState<'checking' | 'ready' | 'disabled' | 'unreachable'>('checking')
  const [retry, setRetry] = useState(0)
  const enabled = intake === 'ready'
  const [kind, setKind] = useState<'community' | 'result'>('community')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<{ report: Report; code: string; saved: boolean } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const uploadLock = useRef(false)
  const pendingCode = useRef('')
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const errorBox = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!online) return
    const controller = new AbortController()
    setIntake('checking')
    fetch('/api/intake', { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]) })
      .then(response => {
        if (!response.ok) throw new Error('Intake unavailable')
        return response.json()
      })
      .then(data => setIntake(data.uploadsEnabled === true ? 'ready' : 'disabled'))
      .catch(() => { if (!controller.signal.aborted) setIntake('unreachable') })
    return () => controller.abort()
  }, [online, retry])

  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  useEffect(() => {
    if (receipt) {
      resultHeading.current?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
    }
  }, [receipt])
  useEffect(() => { if (error) errorBox.current?.focus() }, [error])

  function choosePhoto(next?: File) {
    setDragging(false)
    if (!next) return
    if (!fileTypes.includes(next.type) || !next.size || next.size > maxBytes) {
      setError('Choose a JPG, PNG or WebP photo up to 8 MB.')
      return
    }
    setFile(next)
    setConsent(false)
    setError('')
  }

  function chooseKind(value: typeof kind) {
    if (value !== kind) {
      setKind(value)
      setConsent(false)
      setError('')
      formRef.current?.reset()
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (uploadLock.current) return
    if (!online || !enabled) return setError('Photo intake is unavailable right now. Your photo has not been sent.')
    if (!file) return setError('Add a photo to continue.')
    if (!consent) return setError('Confirm the photo is safe to share.')
    const form = new FormData(event.currentTarget)
    form.delete('reportType')
    form.set('photo', file)
    form.set('kind', kind)
    form.set('consent', 'yes')
    const code = pendingCode.current || newReceiptCode()
    pendingCode.current = code
    const locallySaved = remember({ code })
    uploadLock.current = true
    setBusy(true)
    setError('')
    try {
      const response = await receiptRequest('/api/reports', code, { method: 'POST', body: form })
      const report = await response.json() as Report
      const saved = remember(entryFor(report, code))
      setReceipt({ report, code, saved })
      setFile(null)
      setConsent(false)
      pendingCode.current = ''
    } catch (error) {
      setError(`${(error as Error).message} You can retry here with the same receipt.${locallySaved ? ' If you leave, check My Actions for the pending receipt.' : ' Keep this tab open to retry.'}`)
    } finally {
      uploadLock.current = false
      setBusy(false)
    }
  }

  function reset() {
    setReceipt(null)
    setKind('community')
    setFile(null)
    setConsent(false)
    setError('')
    pendingCode.current = ''
  }

  if (receipt) return <section className="wrap standard-page narrow">
    <PageTitle eyebrow="CIVIC CAMERA" title="Your report is in." icon={FileCheck2}>MataLens received your photo and issued a private receipt.</PageTitle>
    <div className="panel receipt-card">
      <span className="success-icon"><Check size={27} /></span>
      <h2 ref={resultHeading} tabIndex={-1}>Submitted to MataLens</h2>
      <p>{statusLabels[receipt.report.status]}. No authority has received this report through MataLens.</p>
      <ReportDetails report={receipt.report} />
      <ReceiptTools code={receipt.code} report={receipt.report} />
      <p className="field-help">{receipt.saved ? 'Also saved in this browser under My Actions.' : 'This browser couldn’t save the receipt. Download it before leaving.'}</p>
      <div className="button-row"><ActionLink href="/actions">Open My Actions</ActionLink><button className="button button-secondary" onClick={reset}>Make another report <Camera size={17} /></button></div>
    </div>
  </section>

  return <section className="wrap standard-page">
    <PageTitle eyebrow="DOCUMENT WHAT YOU SEE" title="Civic Camera" icon={Camera}>Send a photo and a little context to MataLens. Keep a private receipt to find it again.</PageTitle>
    <div className="page-grid camera-grid">
      <form className="panel camera-form" ref={formRef} onSubmit={submit}>
        <fieldset className="form-fields" disabled={busy}>
          <legend className="sr-only">Photo report</legend>
          <div className="form-step"><span>1</span><h2>Choose what to document</h2></div>
          <fieldset className="type-picker">
            <legend className="sr-only">Report type</legend>
            <label className={kind === 'community' ? 'chosen' : ''}><input type="radio" name="reportType" checked={kind === 'community'} onChange={() => chooseKind('community')} /><MapPin size={21} /><span><strong>Community issue</strong><small>Roads, drainage and public facilities</small></span></label>
            <label className={kind === 'result' ? 'chosen' : ''}><input type="radio" name="reportType" checked={kind === 'result'} onChange={() => chooseKind('result')} /><Landmark size={21} /><span><strong>Public result sheet</strong><small>Posted polling-unit results</small></span></label>
          </fieldset>
          {kind === 'result' && <p className="inline-notice"><CircleAlert size={17} />Only photograph a publicly posted result sheet where it’s lawful and safe. Keep marked ballots and private documents out of the frame.</p>}
          <div className="form-step"><span>2</span><h2>Add one photo</h2></div>
          {file ? <figure className="photo-preview">
            {preview && <img src={preview} alt="Preview of your uploaded photo" onError={() => setError('This photo could not be previewed. Choose another photo.')} />}
            <figcaption><FileImage size={19} /><span>{file.name}</span><button type="button" className="icon-button" onClick={() => { setFile(null); setConsent(false); setError('') }} aria-label="Remove photo"><X size={19} /></button></figcaption>
          </figure> : <div className={`drop-zone${dragging ? ' dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => {
            event.preventDefault()
            if (event.dataTransfer.files.length > 1) { setDragging(false); return setError('Add one photo at a time.') }
            choosePhoto(event.dataTransfer.files[0])
          }}>
            <label>
              <input className="sr-only" type="file" accept={fileTypes.join(',')} onChange={event => { choosePhoto(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} />
              <span className="upload-icon"><Upload size={23} /></span>
              <strong>Choose a photo</strong>
              <span>JPG, PNG or WebP · Up to 8 MB</span>
            </label>
            <label className="capture-label"><input className="sr-only" type="file" accept="image/*" capture="environment" onChange={event => { choosePhoto(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} /><span><Camera size={16} /> Take a photo</span></label>
          </div>}
          <div className="form-step"><span>3</span><h2>Add context</h2></div>
          <div className="field-stack" key={kind}>
            {kind === 'community' && <label>Category<select defaultValue="" name="category" required><option value="" disabled>Choose a category</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label>}
            <label>{kind === 'community' ? 'What did you see?' : 'Extra context (optional)'}<textarea name="description" required={kind === 'community'} minLength={kind === 'community' ? 12 : undefined} maxLength={600} rows={4} placeholder={kind === 'community' ? 'Describe the issue in your own words. Share what you saw and leave out names.' : 'Add any factual context that helps explain the photo.'} /></label>
            <label>{kind === 'community' ? 'Public location (optional)' : 'Polling-unit name or code'}<input name="location" maxLength={140} minLength={kind === 'result' ? 3 : undefined} required={kind === 'result'} placeholder={kind === 'community' ? 'e.g. Near the market entrance, Surulere' : 'Use the details shown on the sheet'} /></label>
          </div>
          <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <p className="field-help">MataLens keeps the original photo privately for review. Remove camera location metadata before uploading if you want to keep it private.</p>
          <CheckRow checked={consent} onChange={() => setConsent(!consent)}>{kind === 'result' ? 'This shows a publicly posted result sheet. It contains no marked ballot or personal documents.' : 'This photo is safe to share. I’ve kept out personal information and identifiable people.'}</CheckRow>
        </fieldset>
        {(!online || !enabled) && <div className="availability-block">
          <p className="inline-notice availability" role="status"><CircleAlert size={18} />{!online ? 'You’re offline. Reconnect to submit this photo.' : intake === 'disabled' ? 'Photo intake is unavailable on this copy of MataLens.' : intake === 'unreachable' ? 'MataLens couldn’t check photo intake. Try again when your connection returns.' : 'Checking photo intake…'}</p>
          {online && intake === 'unreachable' && <button className="link-button" type="button" onClick={() => setRetry(retry + 1)}>Check again</button>}
        </div>}
        {error && <p className="inline-notice error" tabIndex={-1} ref={errorBox} role="alert"><CircleAlert size={18} />{error}</p>}
        <div className="button-row"><button className="button" disabled={busy || !enabled || !online} type="submit">{busy ? 'Uploading photo…' : 'Submit to MataLens'} {busy ? <span className="spinner" /> : <ArrowRight size={17} />}</button><a className="text-link" href="/actions">Find a receipt</a></div>
      </form>
      <aside className="side-column" aria-label="Civic Camera guidance">
        <section className="panel soft-panel">
          <div className="panel-heading"><span className="card-icon sage"><LockKeyhole size={21} /></span><div><h2>Keep it safe</h2><p>Private evidence for review</p></div></div>
          {kind === 'result' ? <p>Follow instructions at the polling unit and avoid confrontation. Keep identifying details out of the frame.</p> : <p>Photograph the issue from a safe place. Leave out faces, number plates, identity documents and private addresses.</p>}
          <a className="text-link" href="/privacy">Read about photo privacy <ArrowRight size={15} /></a>
        </section>
        <section className="panel">
          <div className="panel-heading"><span className="card-icon sand"><FileCheck2 size={22} /></span><div><h2>What happens next?</h2></div></div>
          <p>MataLens stores the report privately for review and gives you a receipt. Keep a copy so you can see the status or withdraw the report for up to 30 days.</p>
        </section>
      </aside>
    </div>
  </section>
}

const statusLabels = { pending: 'Awaiting review', reviewed: 'Reviewed by MataLens', declined: 'Declined by MataLens', withdrawn: 'Withdrawn' }
function ReportDetails({ report }: { report: Report }) {
  return <dl className="report-details">
    <div><dt>Status</dt><dd><span className={`status-tag ${report.status}`}><span />{statusLabels[report.status]}</span></dd></div>
    <div><dt>Category</dt><dd>{report.category}</dd></div>
    <div><dt>Received</dt><dd>{nigeriaDate(report.createdAt)}</dd></div>
    <div><dt>Receipt expires</dt><dd>{nigeriaDate(report.expiresAt)}</dd></div>
    <div className="report-id"><dt>Case ID</dt><dd>{report.id}</dd></div>
  </dl>
}

function ReceiptTools({ code, report }: { code: string; report: Report }) {
  const [copied, setCopied] = useState('')
  const recoveryLink = `${window.location.origin}/actions#receipt=${code}`
  function save() {
    downloadFile(`matalens-receipt-${report.id.slice(0, 8)}.txt`, [
      'MataLens private report receipt', `Case ID: ${report.id}`, `Received: ${nigeriaDate(report.createdAt)}`,
      `Expires: ${nigeriaDate(report.expiresAt)}`, '', `Open this link: ${recoveryLink}`, `Receipt code: ${code}`, '',
      'Keep this private. Anyone with the code or link can open and withdraw the report.',
      'MataLens cannot recover a lost receipt. The report was submitted to MataLens.',
    ].join('\n'), 'text/plain;charset=utf-8')
  }
  return <div className="receipt-tools">
    <h3><KeyRound size={19} /> Keep your receipt private</h3>
    <p>Anyone with the code or link can see or withdraw the report. Download a copy now. MataLens can’t recover a lost receipt.</p>
    <div className="button-row">
      <button className="button button-secondary" onClick={save}><Download size={17} /> Download receipt</button>
      <button className="button button-secondary" onClick={async () => {
        try { await navigator.clipboard.writeText(recoveryLink); setCopied('Private link copied.') }
        catch { setCopied('Clipboard unavailable. Download your receipt for a recovery link.') }
      }}><Copy size={16} /> Copy recovery link</button>
    </div>
    <p className="field-feedback" role="status">{copied}</p>
  </div>
}

export function MyActions({ plan, receipts, remember, forget }: { plan: Plan; receipts: ReceiptEntry[] } & ReceiptProps) {
  const [codeInput, setCodeInput] = useState('')
  const [active, setActive] = useState<{ report: Report; code: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  const panel = useRef<HTMLElement>(null)
  const savedCandidates = candidates.filter(item => plan.candidates.includes(item.id))
  const hasPlan = plan.checklist.length || savedCandidates.length || plan.state || plan.lga || plan.pollingUnit || plan.notes || plan.reminder || plan.practiced

  async function openReceipt(input: string) {
    if (lock.current) return
    const code = codeFromInput(input)
    if (!receiptCodePattern.test(code)) {
      setError('Paste the full recovery link or the 64-character code from your receipt.')
      return
    }
    lock.current = true
    setBusy(true)
    setError('')
    setActive(null)
    try {
      const response = await receiptRequest('/api/receipt', code)
      const report = await response.json() as Report
      remember(entryFor(report, code))
      setActive({ report, code })
      setCodeInput('')
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setBusy(false)
      lock.current = false
    }
  }

  const openFromLink = useEffectEvent((code: string) => { void openReceipt(code) })
  useEffect(() => {
    function recoverFromHash() {
      const code = new URLSearchParams(window.location.hash.slice(1)).get('receipt')
      if (code === null) return
      history.replaceState(null, '', window.location.pathname)
      setCodeInput(code)
      openFromLink(code)
    }
    recoverFromHash()
    window.addEventListener('hashchange', recoverFromHash)
    return () => window.removeEventListener('hashchange', recoverFromHash)
  }, [])
  useEffect(() => { if (active) panel.current?.focus() }, [active])

  return <section className="wrap standard-page">
    <PageTitle eyebrow="SAVED ON THIS DEVICE" title="My Actions" icon={ClipboardList}>Pick up your election preparation or open a private Civic Camera receipt.</PageTitle>
    <div className="page-grid">
      <div className="main-column">
        <section className="panel">
          <div className="panel-heading"><span className="card-icon sage"><FileCheck2 size={22} /></span><div><h2>My reports</h2><p>Open a saved receipt to see the current status.</p></div></div>
          {receipts.length ? <div className="receipt-list">{receipts.map(entry => <div className="receipt-list-item" key={entry.code}>
            <button className="receipt-row" disabled={busy} onClick={() => void openReceipt(entry.code)}><span><strong>{entry.category ?? 'Pending upload receipt'}</strong><small>{entry.createdAt ? `${nigeriaDate(entry.createdAt)} · ${entry.id?.slice(0, 8)}` : 'Check if this upload finished'}</small></span><ArrowRight size={17} /></button>
            <button className="link-button forget-button" onClick={() => forget(entry.code)} aria-label={`Remove ${entry.category ?? 'pending upload receipt'} reference from this device`}>Remove</button>
          </div>)}</div> : <p>No receipts saved here yet. A report you submit from this browser will appear here.</p>}
          <form className="recovery-form field-stack" onSubmit={event => { event.preventDefault(); void openReceipt(codeInput) }}>
            <label>Recover a receipt<input type="text" value={codeInput} onChange={event => setCodeInput(event.target.value)} placeholder="Paste your receipt code or recovery link" maxLength={1024} autoComplete="off" autoCapitalize="none" spellCheck={false} required /></label>
            <button className="button button-secondary" disabled={busy} type="submit">{busy ? 'Opening receipt…' : 'Open receipt'} <KeyRound size={16} /></button>
            {error && <p className="inline-notice error" role="alert"><CircleAlert size={18} />{error}</p>}
          </form>
        </section>
        {active && <section className="panel receipt-card" ref={panel} tabIndex={-1} aria-label="Report receipt">
          <ReportSheet key={active.code} report={active.report} code={active.code} />
        </section>}
      </div>
      <aside className="side-column" aria-label="Saved preparation">
        <section className="panel">
          <div className="panel-heading"><span className="card-icon mint"><ClipboardList size={22} /></span><div><h2>My preparation</h2><p>Private to this browser</p></div></div>
          {hasPlan ? <div className="saved-plan">
            <p>{plan.checklist.length} of {steps.length} checklist steps done{plan.practiced ? ' · Rehearsal completed' : ''}</p>
            {(plan.state || plan.lga || plan.pollingUnit) && <div><h3>My polling plan</h3><p>{[plan.state, plan.lga, plan.pollingUnit].filter(Boolean).join(' · ')}</p></div>}
            {plan.notes && <div><h3>My notes</h3><p>{plan.notes}</p></div>}
            {savedCandidates.length > 0 && <div><h3>Candidate bookmarks</h3><ul>{savedCandidates.map(candidate => <li key={candidate.id}>{candidate.name} · {candidate.party}</li>)}</ul></div>}
            {plan.reminder && <div><h3>Personal reminder</h3><p>{nigeriaDate(plan.reminder)}</p><button className="link-button" onClick={() => downloadReminder(plan.reminder, 'Election preparation', 'Open MataLens to review your private preparation.')}>Export to calendar <Download size={15} /></button></div>}
          </div> : <p>Save a polling plan, bookmark a candidate or check off a step in My Election to see it here.</p>}
          <ActionLink href="/election" secondary>Open My Election</ActionLink>
        </section>
        <section className="panel soft-panel"><h2>Have something to report?</h2><p>Start with a photo of a community issue or a publicly posted result sheet.</p><ActionLink href="/camera" secondary>Open Civic Camera</ActionLink></section>
      </aside>
    </div>
  </section>
}

function ReportSheet({ report: initial, code }: { report: Report; code: string }) {
  const [report, setReport] = useState(initial)
  const [photo, setPhoto] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState('')
  const objectUrl = useRef('')
  const controller = useRef<AbortController | null>(null)

  useEffect(() => () => {
    controller.current?.abort()
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
  }, [])

  async function act(action: 'photo' | 'withdraw') {
    if (controller.current) return
    const request = new AbortController()
    controller.current = request
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(30_000)])
    setBusy(true)
    setError('')
    try {
      if (action === 'withdraw') {
        const response = await receiptRequest('/api/receipt', code, { method: 'DELETE', signal })
        setReport(await response.json() as Report)
        setConfirm(false)
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
        objectUrl.current = ''
        setPhoto('')
      } else {
        const response = await receiptRequest('/api/receipt/photo', code, { signal })
        const image = await response.blob()
        if (request.signal.aborted) return
        objectUrl.current = URL.createObjectURL(image)
        setPhoto(objectUrl.current)
      }
    } catch (error) {
      if (!request.signal.aborted) setError((error as Error).message)
    } finally {
      controller.current = null
      if (!request.signal.aborted) setBusy(false)
    }
  }

  const isWithdrawn = report.status === 'withdrawn'
  const isDeclined = report.status === 'declined'
  return <>
    <h2>{isWithdrawn ? 'Report withdrawn' : isDeclined ? 'Report declined' : 'MataLens report receipt'}</h2>
    <p>{isWithdrawn ? 'MataLens removed the photo, description and location.' : isDeclined ? 'The photo and report details were removed during review.' : 'This receipt tracks your submission to MataLens.'}</p>
    <ReportDetails report={report} />
    {report.description && <div className="report-text"><h3>Description</h3><p>{report.description}</p></div>}
    {report.location && <div className="report-text"><h3>{report.kind === 'result' ? 'Polling-unit details' : 'Location'}</h3><p>{report.location}</p></div>}
    {photo && <img className="private-photo" src={photo} alt="Private report photo preview" />}
    {report.hasPhoto && !photo && <button className="button button-secondary" disabled={busy} onClick={() => void act('photo')}>View photo <FileImage size={17} /></button>}
    {!isWithdrawn && !isDeclined && <ReceiptTools code={code} report={report} />}
    {!isWithdrawn && !isDeclined && (confirm ? <div className="withdraw-confirm">
      <p>Withdraw this report and remove its photo and details?</p>
      <div className="button-row"><button className="button danger" disabled={busy} onClick={() => void act('withdraw')}>{busy ? 'Withdrawing…' : 'Confirm withdrawal'}</button><button className="button button-secondary" disabled={busy} onClick={() => setConfirm(false)}>Cancel</button></div>
    </div> : <button className="link-button danger-link" disabled={busy} onClick={() => setConfirm(true)}>Withdraw this report</button>)}
    {error && <p className="inline-notice error" role="alert"><CircleAlert size={18} />{error}</p>}
  </>
}
