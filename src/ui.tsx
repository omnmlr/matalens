import { ArrowDown, ArrowRight, ArrowUpRight, Aperture, Check, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function Brand() {
  return <a className="brand" href="/" aria-label="MataLens home">
    <span className="brand-mark"><Aperture size={22} strokeWidth={1.7} /></span>
    <span>Mata<span className="brand-lens">Lens</span></span>
  </a>
}

export function External({ href, children, className = 'text-link' }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
}

export function ActionLink({ href, children, secondary = false, down = false }: { href: string; children: ReactNode; secondary?: boolean; down?: boolean }) {
  return <a className={secondary ? 'button button-secondary' : 'button'} href={href}>{children}{down ? <ArrowDown size={17} /> : <ArrowRight size={17} />}</a>
}

export function PageTitle({ eyebrow, title, children, icon: Icon }: { eyebrow: string; title: string; children: ReactNode; icon: LucideIcon }) {
  return <div className="page-title">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{children}</p>
    </div>
    <span className="page-glyph" aria-hidden="true"><Icon size={37} strokeWidth={1.35} /></span>
  </div>
}

export function CheckRow({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: ReactNode }) {
  return <label className="check-row">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="check-mark" aria-hidden="true"><Check size={14} strokeWidth={2.7} /></span>
    <span>{children}</span>
  </label>
}
