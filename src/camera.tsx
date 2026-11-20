import { useEffect, useEffectEvent, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Camera, Check, CircleAlert, ClipboardList, Copy, Download, FileCheck2, FileImage, KeyRound, Landmark, LockKeyhole, MapPin, Upload, X } from 'lucide-react'
import { codeFromInput, downloadFile, newReceiptCode, nigeriaDate, receiptCodePattern, receiptRequest, ReceiptRequestError, type Plan, type ReceiptEntry, type Report } from './state'
import { ActionLink, CheckRow, PageTitle } from './ui'
import { PreparationPanel } from './preparation'

const categories = ['Road or pavement', 'Drainage or flooding', 'Public facility', 'Waste or sanitation', 'Other community issue']
const fileTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxBytes = 8 * 1024 * 1024
type Review = { category: string; description: string; location: string }
type ReceiptProps = { remember: (entry: ReceiptEntry) => boolean; forget: (code: string) => void }

function entryFor(report: Report, code: string): ReceiptEntry {
  return { code, id: report.id, category: report.category, createdAt: report.createdAt }
}

export function CameraPage({ online, remember, forget }: { online: boolean } & ReceiptProps) {
  const [intake, setIntake] = useState<'checking' | 'ready' | 'disabled' | 'unreachable'>('checking')
  const [retry, setRetry] = useState(0)
  const enabled = intake === 'ready'
  const [kind, setKind] = useState<'community' | 'result'>('community')
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null)
  const file = photo?.file
  const preview = photo?.url
  const [review, setReview] = useState<Review | null>(null)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<{ report: Report; code: string; saved: boolean } | null>(null)
  const detailsHeading = useRef<HTMLHeadingElement>(null)
  const reviewHeading = useRef<HTMLHeadingElement>(null)
  const reviewing = useRef(false)
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

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  useEffect(() => {
    if (!file || receipt) return
    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = true
    }
    function confirmLeave(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!link || link.target || link.hasAttribute('download') || link.pathname === '/camera') return
      if (!window.confirm('Leave this report? Your selected photo and unsent edits will be cleared.')) event.preventDefault()
    }
    window.addEventListener('beforeunload', beforeUnload)
    document.addEventListener('click', confirmLeave, true)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
      document.removeEventListener('click', confirmLeave, true)
    }
  }, [file, receipt])
  useEffect(() => {
    if (receipt) {
      resultHeading.current?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
    }
  }, [receipt])
  useEffect(() => { if (error) errorBox.current?.focus() }, [error])
  useEffect(() => {
    if (review) reviewHeading.current?.focus()
    else if (reviewing.current) detailsHeading.current?.focus()
    reviewing.current = Boolean(review)
  }, [review])

  function choosePhoto(next?: File) {
    setDragging(false)
    if (!next) return
    if (!fileTypes.includes(next.type) || !next.size || next.size > maxBytes) {
      setError('Choose a JPG, PNG or WebP photo up to 8 MB.')
      return
    }
    setPhoto({ file: next, url: URL.createObjectURL(next) })
    setPreviewFailed(false)
    setConsent(false)
    setError('')
  }

  function chooseKind(value: typeof kind) {
    if (value !== kind) {
      setKind(value)
      setConsent(false)
      setError('')
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (uploadLock.current) return
    if (!file) return setError('Add a photo to continue.')
    if (previewFailed) return setError('This photo could not be previewed. Choose another photo.')
    const form = new FormData(event.currentTarget)
    if (!review) {
      const category = kind === 'result' ? 'Public result sheet' : String(form.get('category') ?? '')
      const description = String(form.get('description') ?? '').trim()
      const location = String(form.get('location') ?? '').trim()
      if (kind === 'community' && description.length < 12) return setError('Describe what you saw in at least 12 characters.')
      if (kind === 'result' && location.length < 3) return setError('Enter the polling-unit name or code shown on the sheet.')
      setError('')
      setReview({ category, description, location })
      return
    }
    if (!online || !enabled) return setError('Photo intake is unavailable right now. Your photo has not been sent.')
    if (!consent) return setError('Confirm the photo is safe to share.')
    form.delete('reportType')
    form.set('photo', file)
    form.set('kind', kind)
    form.set('description', review.description)
    form.set('location', review.location)
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
      setPhoto(null)
      setConsent(false)
      pendingCode.current = ''
    } catch (error) {
      if (error instanceof ReceiptRequestError && [400, 413, 415].includes(error.status)) {
        // Intake checks for an existing receipt before validating the draft.
        // These responses mean the draft did not make it into storage.
        pendingCode.current = ''
        setAwaitingConfirmation(false)
        setReview(null)
        setConsent(false)
        forget(code)
        setError(error.message)
      } else {
        setAwaitingConfirmation(true)
        setError(`${(error as Error).message} You can retry here with the same receipt.${locallySaved ? ' If you leave, check My Actions for the pending receipt.' : ' Keep this tab open to retry.'}`)
      }
    } finally {
      uploadLock.current = false
      setBusy(false)
    }
  }

  function reset() {
    setReceipt(null)
    setAwaitingConfirmation(false)
    setReview(null)
    setPreviewFailed(false)
    setKind('community')
    setPhoto(null)
    setConsent(false)
    setError('')
    pendingCode.current = ''
  }

  if (receipt) return <section className="wrap standard-page receipt-page">
    <header className="receipt-header">
      <span className="success-icon"><Check size={25} /></span>
      <p className="eyebrow">Civic Camera · Private receipt</p>
      <h1 ref={resultHeading} tabIndex={-1}>Received by MataLens</h1>
      <p>Only MataLens receives this report. Use your private receipt to check its status.</p>
    </header>
    <div className="receipt-card panel">
      <ReportDetails report={receipt.report} />
      <ReceiptTools code={receipt.code} report={receipt.report} />
      <p className="field-help">{receipt.saved ? 'Also saved in this browser under My Actions.' : 'This browser couldn’t save the receipt. Download it before leaving.'}</p>
      <div className="button-row"><ActionLink href="/actions" secondary>Open My Actions</ActionLink><button className="link-button" onClick={reset}>Make another report <ArrowRight size={15} /></button></div>
    </div>
  </section>

  return <section className="wrap standard-page camera-page">
    {review ? <div className="task-heading"><Camera size={19} /><h1>Civic Camera</h1></div> :
      <PageTitle eyebrow="PRIVATE CIVIC REPORTS" title="Civic Camera" icon={Camera}>Document a community issue or publicly posted result sheet. Receive a private receipt.</PageTitle>}
    <ol className="camera-progress" aria-label="Report progress">
      <li data-done={Boolean(review)} aria-current={!review ? 'step' : undefined}><span>{review ? <Check size={14} /> : '1'}</span> Photo and context</li>
      <li aria-current={review ? 'step' : undefined}><span>2</span> Review and send</li>
      <li><span>3</span> Private receipt</li>
    </ol>
    <div className="page-grid camera-grid">
      <form className="camera-form" onSubmit={submit}>
        {(!online || !enabled) && <div className="availability-block">
          <p className="inline-notice availability" role="status"><CircleAlert size={18} />{!online ? 'You’re offline. Reconnect to submit this photo.' : intake === 'disabled' ? 'Photo intake is unavailable on this copy of MataLens.' : intake === 'unreachable' ? 'MataLens couldn’t check photo intake. Try again when your connection returns.' : 'Checking photo intake…'}</p>
          {online && intake === 'unreachable' && <button className="link-button" type="button" onClick={() => setRetry(retry + 1)}>Check again</button>}
        </div>}
        <div hidden={Boolean(review)}>
          <section className="form-section camera-stage">
            <h2 ref={detailsHeading} tabIndex={-1}>What are you documenting?</h2>
            <fieldset className="type-picker">
              <legend className="sr-only">Report type</legend>
              <label className={kind === 'community' ? 'chosen' : ''}><input type="radio" name="reportType" checked={kind === 'community'} onChange={() => chooseKind('community')} /><MapPin size={20} /><span><strong>Community issue</strong><small>Roads, drainage and public facilities</small></span></label>
              <label className={kind === 'result' ? 'chosen' : ''}><input type="radio" name="reportType" checked={kind === 'result'} onChange={() => chooseKind('result')} /><Landmark size={20} /><span><strong>Public result sheet</strong><small>Posted polling-unit results</small></span></label>
            </fieldset>
          </section>
          <section className="form-section camera-stage">
            <h2>Add one photo</h2>
            {kind === 'result' ? <p className="inline-notice"><CircleAlert size={17} />Only photograph a publicly posted result sheet where it’s lawful and safe. Keep marked ballots and private documents out of the frame.</p> : <p>Photograph the issue safely. Keep faces, number plates and private details out of the frame.</p>}
            {file ? <figure className="photo-preview">
              {preview && !previewFailed && <img src={preview} alt="Preview of your selected photo" onError={() => { setPreviewFailed(true); setError('This photo could not be previewed. Choose another photo.') }} />}
              <figcaption><FileImage size={18} /><span>{file.name}</span><label className="link-button replace-photo"><input className="sr-only" type="file" accept={fileTypes.join(',')} onChange={event => { choosePhoto(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} />Replace</label><button type="button" className="icon-button" onClick={() => { setPhoto(null); setConsent(false); setPreviewFailed(false); setError('') }} aria-label="Remove photo"><X size={18} /></button></figcaption>
            </figure> : <div className={`drop-zone${dragging ? ' dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => {
              event.preventDefault()
              if (event.dataTransfer.files.length > 1) { setDragging(false); return setError('Add one photo at a time.') }
              choosePhoto(event.dataTransfer.files[0])
            }}>
              <Upload className="upload-icon" size={24} />
              <div className="drop-copy"><strong>Add a photo to your report</strong><span>JPG, PNG or WebP · 8 MB and 25 MP max</span></div>
              <div className="button-row">
                <label className="button button-secondary"><input aria-label="Choose a photo" className="sr-only" type="file" accept={fileTypes.join(',')} onChange={event => { choosePhoto(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} /><FileImage size={16} /> Choose a photo</label>
                <label className="button button-secondary"><input aria-label="Take a photo" className="sr-only" type="file" accept="image/*" capture="environment" onChange={event => { choosePhoto(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} /><Camera size={16} /> Take a photo</label>
              </div>
            </div>}
          </section>
          <section className="form-section camera-stage">
            <h2>Add context</h2>
            <div className="field-stack" key={kind}>
              {kind === 'community' && <label>Category<select defaultValue="" name="category" required><option value="" disabled>Choose a category</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label>}
              <label>{kind === 'community' ? 'What did you see?' : 'Extra context (optional)'}<textarea name="description" required={kind === 'community'} minLength={kind === 'community' ? 12 : undefined} maxLength={600} rows={3} placeholder={kind === 'community' ? 'Describe what you saw and where it happened' : 'Add any factual context that helps explain the photo'} /></label>
              <label>{kind === 'community' ? 'Public location (optional)' : 'Polling-unit name or code'}<input name="location" maxLength={140} minLength={kind === 'result' ? 3 : undefined} required={kind === 'result'} placeholder={kind === 'community' ? 'e.g. Near the market entrance, Surulere' : 'Use the details shown on the sheet'} /></label>
            </div>
          </section>
        </div>
        <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        {review && <fieldset className="report-review" disabled={busy}>
          <legend className="sr-only">Review your report</legend>
          <div className="section-head"><h2 ref={reviewHeading} tabIndex={-1}>Review your report</h2>
            {!awaitingConfirmation && <button type="button" className="link-button" onClick={() => { setReview(null); setConsent(false); setError('') }}><ArrowLeft size={15} /> Edit details</button>}
          </div>
          <figure className="photo-preview"><img src={preview} alt="Photo you’re about to submit" /></figure>
          <dl className="review-details"><div><dt>Report type</dt><dd>{kind === 'result' ? 'Public result sheet' : 'Community issue'}</dd></div>
            {kind === 'community' && <div><dt>Category</dt><dd>{review.category}</dd></div>}
            <div><dt>{kind === 'result' ? 'Polling-unit name or code' : 'Public location'}</dt><dd>{review.location || 'Location not supplied'}</dd></div>
            {review.description && <div><dt>Description</dt><dd>{review.description}</dd></div>}
          </dl>
          <p className="review-privacy"><LockKeyhole size={17} /> MataLens keeps the original photo, including any camera metadata, in private storage for up to 30 days.</p>
          <CheckRow checked={consent} onChange={() => setConsent(!consent)}>{kind === 'result' ? 'This shows a publicly posted result sheet. It contains no marked ballot or personal documents.' : 'This photo is safe to share. I’ve kept out personal information and identifiable people.'}</CheckRow>
        </fieldset>}
        {error && <p className="inline-notice error" tabIndex={-1} ref={errorBox} role="alert"><CircleAlert size={18} />{error}</p>}
        <div className="form-actions button-row">
          {review ? <button className="button" disabled={busy || !enabled || !online} type="submit">{busy ? 'Uploading photo…' : 'Submit to MataLens'} {busy ? <span className="spinner" /> : <ArrowRight size={17} />}</button> : <button className="button" type="submit">Review report <ArrowRight size={17} /></button>}
          <a className="text-link" href="/actions">Find a receipt</a>
        </div>
      </form>
      <aside className="side-column camera-guide" aria-label="Civic Camera guidance">
        <section className="rail-section privacy-rail">
          <div className="rail-heading"><LockKeyhole size={19} /><h2>Private by design</h2></div>
          <p>Your photo goes to MataLens for review. An original may contain location metadata, so remove it before uploading if you want to keep it private.</p>
          <a className="text-link" href="/privacy">Photo privacy <ArrowRight size={15} /></a>
        </section>
        <section className="rail-section">
          <div className="rail-heading"><FileCheck2 size={19} /><h2>Your private receipt</h2></div>
          <p>Keep a copy after you submit. You can use it to check the status or withdraw your report for up to 30 days.</p>
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
      <button className="button" onClick={save}><Download size={17} /> Download receipt</button>
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
    <PageTitle eyebrow="SAVED ON THIS DEVICE" title="My Actions" icon={ClipboardList}>Open your private Civic Camera receipts or pick up your election preparation.</PageTitle>
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
        <PreparationPanel plan={plan} />
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
