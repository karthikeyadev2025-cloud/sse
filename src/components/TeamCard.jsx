import { Linkedin, Mail, Phone } from 'lucide-react'
import { cx, telLink } from '../lib/utils'

const POS = { top: '50% 18%', center: '50% 50%', bottom: '50% 85%' }
const initials = (n) => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')

// Uniform portrait card: every photo is cropped to the same 4:5 frame, focused on the face
export default function TeamCard({ m, compact = false }) {
  const links = [
    m.phone && { href: telLink(m.phone), icon: Phone, label: 'Call' },
    m.email && { href: `mailto:${m.email}`, icon: Mail, label: 'Email' },
    m.linkedin && { href: m.linkedin, icon: Linkedin, label: 'LinkedIn', ext: true },
  ].filter(Boolean)
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-gold-50">
        {m.photo
          ? <img src={m.photo} alt={m.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" style={{ objectPosition: POS[m.photo_position] || POS.top }} />
          : <span className="absolute inset-0 grid place-items-center"><span className="grid h-24 w-24 place-items-center rounded-full bg-brand-800 font-display text-3xl font-bold text-white ring-8 ring-white/70">{initials(m.name)}</span></span>}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-950/60 to-transparent opacity-0 transition group-hover:opacity-100" />
        {links.length > 0 && (
          <div className="absolute inset-x-0 bottom-3 flex translate-y-3 justify-center gap-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            {links.map((l) => <a key={l.label} href={l.href} {...(l.ext ? { target: '_blank', rel: 'noreferrer' } : {})} aria-label={l.label} className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-800 shadow hover:bg-gold-400 hover:text-ink"><l.icon className="h-4 w-4" /></a>)}
          </div>
        )}
      </div>
      <div className={cx('flex-1 text-center', compact ? 'px-3 py-4' : 'px-4 py-5')}>
        <h3 className={cx('font-display font-bold leading-tight text-ink', compact ? 'text-base' : 'text-lg')}>{m.name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-700">{m.designation}</p>
        {!compact && m.bio && <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-gray-600">{m.bio}</p>}
      </div>
    </article>
  )
}
