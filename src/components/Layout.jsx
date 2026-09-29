import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MapPin, Mail, Phone, Search, Menu, X, ArrowRight, ArrowUp, Linkedin, Youtube, Facebook, Instagram, MessageCircle, PhoneCall, Download, Clock } from 'lucide-react'
import { useSettings, useSite } from '../lib/ContentContext'
import { useQuote } from './QuoteModal'
import { telLink, waLink, cx } from '../lib/utils'

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/projects', label: 'Projects' },
  { to: '/clients', label: 'Clients' },
  { to: '/industries', label: 'Industries' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export function Logo({ light = false, size = 'md' }) {
  const s = useSettings()
  const [first, ...rest] = String(s.company_name || '').split(' ')
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={s.company_name}>
      <img src={s.logo} alt={s.company_name} className={size === 'lg' ? 'h-16 w-auto' : 'h-12 w-auto sm:h-14'} />
      <span className="leading-none">
        <span className={cx('block font-display text-lg font-extrabold tracking-tight sm:text-xl', light ? 'text-white' : 'text-ink')}>
          {first?.toUpperCase()} <span className={light ? 'text-gold-300' : 'text-brand-700'}>{rest.join(' ').toUpperCase()}</span>
        </span>
        <span className={cx('mt-1 block text-[9px] font-semibold uppercase tracking-[.28em]', light ? 'text-white/60' : 'text-gray-500')}>{s.tagline}</span>
      </span>
    </Link>
  )
}

const Social = ({ s, className = '' }) => (
  <div className={cx('flex items-center gap-2', className)}>
    {[['linkedin', Linkedin], ['youtube', Youtube], ['facebook', Facebook], ['instagram', Instagram]].map(([k, I]) => s[k] ? (
      <a key={k} href={s[k]} target="_blank" rel="noreferrer" aria-label={k} className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-white transition hover:bg-gold-400 hover:text-ink"><I className="h-4 w-4" /></a>
    ) : null)}
  </div>
)

function TopBar() {
  const s = useSettings()
  const { open } = useQuote()
  return (
    <div className="hidden bg-brand-900 text-white lg:block">
      <div className="container-x flex h-11 items-center justify-between gap-6 text-xs">
        <span className="flex max-w-sm items-center gap-2 text-white/85"><MapPin className="h-4 w-4 shrink-0 text-gold-300" /><span className="line-clamp-1">{s.address}</span></span>
        <a href={`mailto:${s.email}`} className="flex items-center gap-2 text-white/85 hover:text-gold-300"><Mail className="h-4 w-4 text-gold-300" />{s.email}</a>
        <a href={telLink(s.phone)} className="flex items-center gap-2 text-sm font-bold hover:text-gold-300"><Phone className="h-4 w-4 text-gold-300" />{s.phone}</a>
        <Social s={s} />
        <button onClick={() => open()} className="btn-gold btn-sm">{s.header_cta_text || 'Enquire Now'} <ArrowRight className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  )
}

function SearchOverlay({ onClose }) {
  const { collections } = useSite()
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const ref = useRef()
  useEffect(() => { ref.current?.focus() }, [])
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (t.length < 2) return []
    const m = (x) => [x.title, x.short_desc, x.location, x.description].join(' ').toLowerCase().includes(t)
    return [
      ...collections.products.filter(m).map((x) => ({ type: 'Product', title: x.title, to: `/products/${x.slug}`, image: x.image })),
      ...collections.services.filter(m).map((x) => ({ type: 'Service', title: x.title, to: `/services/${x.slug}`, image: x.image })),
      ...collections.projects.filter(m).map((x) => ({ type: 'Project', title: x.title, to: `/projects/${x.slug}`, image: x.image })),
      ...collections.industries.filter(m).map((x) => ({ type: 'Industry', title: x.title, to: `/industries#${x.slug}`, image: x.image })),
    ].slice(0, 10)
  }, [q, collections])
  return (
    <div className="fixed inset-0 z-[80] bg-ink/70 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto mt-20 max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl animate-fadeUp">
          <div className="flex items-center gap-3 border-b px-5">
            <Search className="h-5 w-5 text-gray-400" />
            <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && onClose()} placeholder="Search products, services, projects…" className="h-16 flex-1 bg-transparent text-base outline-none" />
            <button onClick={onClose} className="rounded-md p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {q.trim().length < 2 && <p className="p-4 text-sm text-gray-500">Type at least 2 letters to search…</p>}
            {q.trim().length >= 2 && !results.length && <p className="p-4 text-sm text-gray-500">No results for “{q}”.</p>}
            {results.map((r) => (
              <button key={r.to + r.title} onClick={() => { nav(r.to); onClose() }} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-brand-50">
                <img src={r.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <span className="flex-1"><span className="block text-sm font-semibold">{r.title}</span><span className="text-xs text-brand-700">{r.type}</span></span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const s = useSettings()
  const { open } = useQuote()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => { setMenu(false) }, [loc.pathname])
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : '' }, [menu])
  return (
    <>
      <header className={cx('sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow', scrolled && 'shadow-[0_6px_24px_-12px_rgba(0,0,0,.25)]')}>
        <div className="container-x flex h-[72px] items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx('relative px-2 py-2 text-[13.5px] font-semibold transition hover:text-brand-700 xl:px-3 xl:text-[14px]', isActive ? 'text-brand-800 after:absolute after:inset-x-2 xl:after:inset-x-3 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-gold-400' : 'text-gray-700')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setSearch(true)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-gray-100" aria-label="Search"><Search className="h-5 w-5" /></button>
            <button onClick={() => open()} className="btn-gold btn-sm hidden sm:inline-flex lg:hidden">Get a Quote</button>
            <button onClick={() => setMenu(true)} className="grid h-10 w-10 place-items-center rounded-full bg-brand-800 text-white lg:hidden" aria-label="Menu"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
        {s.announcement && <div className="bg-gold-400 py-1.5 text-center text-xs font-semibold text-ink">{s.announcement}</div>}
      </header>

      {menu && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setMenu(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-brand-900 text-white shadow-2xl animate-fadeUp">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <Logo light />
              <button onClick={() => setMenu(false)} className="rounded-full bg-white/10 p-2"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx('flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold', isActive ? 'bg-gold-400 text-ink' : 'text-white/90 hover:bg-white/5')}>
                  {n.label} <ArrowRight className="h-4 w-4 opacity-60" />
                </NavLink>
              ))}
            </nav>
            <div className="space-y-3 border-t border-white/10 p-4 text-sm">
              <button onClick={() => { setMenu(false); open() }} className="btn-gold w-full">Get a Quote <ArrowRight className="h-4 w-4" /></button>
              <div className="grid grid-cols-2 gap-2">
                <a href={telLink(s.phone)} className="btn bg-white/10 text-white"><PhoneCall className="h-4 w-4" /> Call</a>
                <a href={waLink(s.whatsapp, s.whatsapp_default_message)} target="_blank" rel="noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
              <Social s={s} className="justify-center pt-1" />
            </div>
          </aside>
        </div>
      )}
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  )
}

function Footer() {
  const s = useSettings()
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white">
      <div className="pointer-events-none absolute inset-0 grain-bg opacity-60" />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.4fr_1fr]">
        <div>
          <Logo light size="lg" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">{s.footer_about}</p>
          {s.brochure_url && <a href={s.brochure_url} target="_blank" rel="noreferrer" className="btn-gold btn-sm mt-5"><Download className="h-4 w-4" /> Download Brochure</a>}
        </div>
        <div>
          <h4 className="text-base font-bold">Quick Links</h4>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-white/70">
            {NAV.map((n) => <li key={n.to}><Link to={n.to} className="transition hover:text-gold-300">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-base font-bold">Contact Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li><a href={telLink(s.phone)} className="flex gap-3 hover:text-gold-300"><Phone className="h-4 w-4 shrink-0 text-gold-300" />{s.phone}{s.phone_alt && `, ${s.phone_alt}`}</a></li>
            <li><a href={`mailto:${s.email}`} className="flex gap-3 break-all hover:text-gold-300"><Mail className="h-4 w-4 shrink-0 text-gold-300" />{s.email}</a></li>
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />{s.address}</li>
            <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />{s.working_hours} {s.working_note}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-bold">Follow Us</h4>
          <Social s={s} className="mt-4" />
          <p className="mt-5 font-display text-lg italic leading-snug text-white/80">“{s.footer_quote}”</p>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 pb-24 text-xs text-white/55 sm:flex-row sm:pb-5 sm:pr-24 xl:pr-8">
          <span>{String(s.copyright || '').replace('{year}', year)}</span>
          <span className="hidden lg:inline">{s.footer_bottom}</span>
          {s.credit_text && (s.credit_url
            ? <a href={s.credit_url} target="_blank" rel="noreferrer" className="font-semibold text-white/75 transition hover:text-gold-300">{s.credit_text}</a>
            : <span className="font-semibold text-white/75">{s.credit_text}</span>)}
        </div>
      </div>
    </footer>
  )
}

function Floating() {
  const s = useSettings()
  const [top, setTop] = useState(false)
  useEffect(() => {
    const f = () => setTop(window.scrollY > 600)
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:right-6">
      {top && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="grid h-11 w-11 place-items-center rounded-full bg-white text-brand-800 shadow-lift ring-1 ring-black/5 animate-fadeUp" aria-label="Back to top"><ArrowUp className="h-5 w-5" /></button>}
      {s.show_call_float && <a href={telLink(s.phone)} className="grid h-12 w-12 place-items-center rounded-full bg-brand-800 text-white shadow-lift" aria-label="Call us"><PhoneCall className="h-5 w-5" /></a>}
      {s.show_whatsapp_float && (
        <a href={waLink(s.whatsapp, s.whatsapp_default_message)} target="_blank" rel="noreferrer" className="group relative flex items-center" aria-label="Chat on WhatsApp">
          <span className="mr-3 hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lift ring-1 ring-black/5 sm:group-hover:block">Chat with us</span>
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift">
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulseRing" />
            <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-current"><path d="M16.04 3C9 3 3.3 8.7 3.3 15.73c0 2.25.6 4.45 1.72 6.38L3.2 29l7.08-1.78a12.7 12.7 0 0 0 5.76 1.4h.01c7.03 0 12.74-5.7 12.74-12.74A12.74 12.74 0 0 0 16.04 3Zm0 23.3h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.2 1.06 1.12-4.1-.25-.42a10.56 10.56 0 1 1 9.13 5.17Zm5.8-7.9c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.56-1.58a9.6 9.6 0 0 1-1.77-2.2c-.19-.32 0-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .12.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" /></svg>
          </span>
        </a>
      )}
    </div>
  )
}

export default function Layout() {
  const s = useSettings()
  const loc = useLocation()
  useEffect(() => {
    if (loc.pathname === '/') document.title = s.seo_title
  }, [loc.pathname, s.seo_title])
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <Floating />
    </div>
  )
}
