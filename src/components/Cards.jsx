import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, MessageCircle } from 'lucide-react'
import Icon from './Icon'
import { useQuote } from './QuoteModal'
import { useSettings } from '../lib/ContentContext'
import { waLink } from '../lib/utils'

export function ProductCard({ p, compact = false }) {
  const { open } = useQuote()
  const s = useSettings()
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/products/${p.slug}`} className="img-zoom relative block aspect-[4/3] overflow-hidden bg-gray-100">
        <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
        {p.featured && !compact && <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Popular</span>}
      </Link>
      {!compact && <a href={waLink(s.whatsapp, `Hello, I am interested in ${p.title}. Please share details.`)} target="_blank" rel="noreferrer" title="Enquire on WhatsApp" aria-label="WhatsApp enquiry" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-110"><MessageCircle className="h-4 w-4" /></a>}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold leading-snug"><Link to={`/products/${p.slug}`} className="hover:text-brand-700">{p.title}</Link></h3>
        <p className="mt-1.5 line-clamp-3 flex-1 text-[13px] leading-relaxed text-gray-600">{p.short_desc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/products/${p.slug}`} className="btn-gold btn-sm">View Details <ArrowRight className="h-3.5 w-3.5" /></Link>
          {!compact && <button onClick={() => open({ product: p.title, source: 'product-card' })} className="btn-outline-gold btn-sm"><Mail className="h-3.5 w-3.5" /> Enquire</button>}
        </div>
      </div>
    </article>
  )
}

export function ProjectCard({ p }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/projects/${p.slug}`} className="img-zoom block aspect-[16/10] overflow-hidden bg-gray-100">
        <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold"><Link to={`/projects/${p.slug}`} className="hover:text-brand-700">{p.title}</Link></h3>
        {p.location && <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="h-3.5 w-3.5 text-brand-700" />{p.location}</p>}
        <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-gray-600">{p.short_desc}</p>
        <Link to={`/projects/${p.slug}`} className="btn-outline-gold btn-sm mt-4 self-start">View Details <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
    </article>
  )
}

export function IndustryCard({ it, small = false }) {
  const { open } = useQuote()
  return (
    <article id={it.slug} className="card group flex h-full scroll-mt-28 flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <div className={`img-zoom overflow-hidden bg-gray-100 ${small ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
        <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <button onClick={() => open({ title: `Solutions for ${it.title}`, source: 'industry' })} className="flex flex-1 items-start gap-3 p-4 text-left">
        <span className="flex-1">
          <span className="block text-[15px] font-bold">{it.title}</span>
          <span className="mt-1 block text-[13px] leading-snug text-gray-600">{it.short_desc}</span>
        </span>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-700 transition group-hover:translate-x-1" />
      </button>
    </article>
  )
}

export function ServiceCard({ s }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/services/${s.slug}`} className="img-zoom block aspect-[16/10] overflow-hidden bg-gray-100">
        <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-800"><Icon name={s.icon} className="h-5 w-5" /></span>
          <h3 className="text-[15px] font-bold leading-tight">{s.title}</h3>
        </div>
        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-gray-600">{s.short_desc}</p>
        <Link to={`/services/${s.slug}`} className="btn-outline-gold btn-sm mt-4 w-full">Learn More <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
    </article>
  )
}
