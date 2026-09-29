import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight, ChevronLeft, Quote, Star, Plus, Minus, Play, X, MessageCircle } from 'lucide-react'
import Icon from './Icon'
import Reveal from './Reveal'
import CountUp from './CountUp'
import { useContent, useSettings, useCollection } from '../lib/ContentContext'
import { useQuote } from './QuoteModal'
import { cx, nl2br, waLink, youtubeEmbed, setMeta, isVideoFile } from '../lib/utils'

export function usePageMeta(title, description) {
  const s = useSettings()
  useEffect(() => { setMeta(title ? `${title} | ${s.company_name}` : s.seo_title, description || s.seo_description) }, [title, description, s])
}

export function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-600">
      <Link to="/" className="font-medium hover:text-brand-700">Home</Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          {it.to ? <Link to={it.to} className="font-medium hover:text-brand-700">{it.label}</Link> : <span className="font-semibold text-ink">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

/** Diagonal green panel with side text, used on hero images */
export function HeroCorner({ text }) {
  if (!text) return null
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block">
      <div className="hero-diag absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-950 opacity-95" />
      <div className="absolute bottom-8 right-6 max-w-[240px] text-right lg:right-10">
        <p className="font-display text-base font-bold uppercase leading-snug tracking-wide text-white lg:text-lg">
          {nl2br(text).map((l, i) => <span key={i} className="block">{l}</span>)}
        </p>
        <span className="ml-auto mt-3 block h-[3px] w-12 rounded-full bg-gold-400" />
      </div>
    </div>
  )
}

export function HeroBadges({ badges, dark = false }) {
  if (!badges?.length) return null
  return (
    <div className={cx('mt-7 grid gap-x-4 gap-y-4', badges.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3')}>
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-800 text-white"><Icon name={b.icon} className="h-5 w-5" /></span>
          <span className={cx('text-[12.5px] font-semibold leading-tight', dark ? 'text-white' : 'text-gray-800')}>{b.label}</span>
        </div>
      ))}
    </div>
  )
}

export function PageHero({ data, crumbs, children }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f3f8f4] to-[#e9f2ec]">
      <div className="absolute inset-y-0 right-0 hidden w-[56%] lg:block">
        <img src={data.hero_image} alt="" className="h-full w-full object-cover" style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 22%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 22%)' }} />
        <HeroCorner text={data.hero_side_text} />
      </div>
      <div className="relative lg:hidden">
        <img src={data.hero_image} alt="" className="h-56 w-full object-cover sm:h-72" />
        <HeroCorner text={data.hero_side_text} />
      </div>
      <div className="container-x relative py-10 lg:min-h-[440px] lg:py-14">
        <div className="max-w-xl lg:max-w-[45%]">
          <Breadcrumb items={crumbs} />
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-[3.4rem] animate-fadeUp">
            {data.hero_title} {data.hero_highlight && <span className="text-brand-700">{data.hero_highlight}</span>}
          </h1>
          {data.hero_subtitle && <p className="mt-3 text-lg font-semibold text-ink/90 sm:text-xl">{data.hero_subtitle}</p>}
          {data.hero_text && <p className="mt-4 leading-relaxed text-gray-600">{data.hero_text}</p>}
          <HeroBadges badges={data.hero_badges} />
          {children}
        </div>
      </div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, text, action, center = false, light = false }) {
  return (
    <div className={cx('mb-8 flex flex-col gap-4 sm:mb-10', center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between')}>
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className={cx('eyebrow', light && 'text-gold-300')}>{eyebrow}</p>}
        <h2 className={cx('h2 mt-2', light && 'text-white')}>{title}</h2>
        {text && <p className={cx('mt-3 leading-relaxed', light ? 'text-white/70' : 'text-gray-600')}>{text}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatsBar() {
  const c = useContent('common')
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      <div className="pointer-events-none absolute inset-0 grain-bg" />
      <div className="container-x relative grid grid-cols-2 gap-y-8 py-9 lg:grid-cols-4">
        {(c.stats || []).map((s, i) => (
          <Reveal key={i} delay={i * 90} className={cx('flex items-center gap-4 px-2 sm:px-6', i > 0 && 'lg:border-l lg:border-white/15')}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-300"><Icon name={s.icon} className="h-6 w-6" /></span>
            <span>
              <span className="block font-display text-2xl font-extrabold sm:text-3xl"><CountUp value={s.value} /></span>
              <span className="text-xs text-white/70 sm:text-sm">{s.label}</span>
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function CtaBand({ title, text, button, icon = 'Handshake', onClick }) {
  const c = useContent('common')
  const s = useSettings()
  const { open } = useQuote()
  return (
    <section className="relative overflow-hidden bg-brand-800">
      <img src={c.cta_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/90 to-brand-800/60" />
      <div className="container-x relative flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-5">
          <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold-300 sm:grid"><Icon name={icon} className="h-7 w-7" /></span>
          <div>
            <h3 className="text-2xl font-bold text-white sm:text-[1.7rem]">{title || c.cta_title}</h3>
            <p className="mt-1.5 max-w-2xl text-white/75">{text || c.cta_text}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={onClick || (() => open())} className="btn-gold">{button || c.cta_button} <ArrowRight className="h-4 w-4" /></button>
          <a href={waLink(s.whatsapp, s.whatsapp_default_message)} target="_blank" rel="noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
        </div>
      </div>
    </section>
  )
}

export function VideoPlayer({ url, title, autoPlay = true, className = '' }) {
  if (!url) return null
  return isVideoFile(url)
    ? <video src={url} controls autoPlay={autoPlay} playsInline className={cx('h-full w-full rounded-xl bg-black', className)} />
    : <iframe src={youtubeEmbed(url).replace('autoplay=1', autoPlay ? 'autoplay=1' : 'autoplay=0')} title={title || 'Video'} className={cx('h-full w-full rounded-xl', className)} allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
}

export function VideoBlock({ image, url, title, sub, className = '' }) {
  const [play, setPlay] = useState(false)
  return (
    <>
      <button type="button" onClick={() => url && setPlay(true)} className={cx('group relative block w-full overflow-hidden rounded-2xl text-left', className)}>
        <img src={image} alt="" className="h-full min-h-[240px] w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gold-400 text-ink shadow-lift">
            {url && <span className="absolute inset-0 rounded-full bg-gold-400 animate-pulseRing" />}
            <Play className="relative ml-1 h-7 w-7 fill-current" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-center text-white">
          <p className="font-display text-xl font-bold">{title}</p>
          <p className="text-sm text-white/75">{url ? sub : sub}</p>
        </div>
      </button>
      {play && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/90 p-4" onClick={() => setPlay(false)}>
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"><X className="h-6 w-6" /></button>
          <div className="aspect-video w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <VideoPlayer url={url} title={title} />
          </div>
        </div>
      )}
    </>
  )
}

export function WhyChoose({ title, videoImage, videoUrl, videoTitle, videoSub }) {
  const c = useContent('common')
  return (
    <section className="bg-white">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[1.45fr_1fr] lg:items-center">
        <div>
          <h2 className="h2 underline-gold">{title}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {(c.why || []).map((w, i) => (
              <Reveal key={i} delay={i * 80} className="text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-800 text-white shadow-lift ring-4 ring-brand-100"><Icon name={w.icon} className="h-7 w-7" /></span>
                <h4 className="mt-3 text-[15px] font-bold">{w.title}</h4>
                <p className="mt-1 text-[13px] leading-snug text-gray-600">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal><VideoBlock image={videoImage} url={videoUrl} title={videoTitle} sub={videoSub} className="aspect-[16/10]" /></Reveal>
      </div>
    </section>
  )
}

export const tSub = (t) => [t.designation, t.company, t.location].filter(Boolean).join(' · ')

export function Stars({ n = 5, className = 'h-4 w-4' }) {
  return <div className="flex gap-0.5">{Array.from({ length: Math.min(5, Number(n) || 5) }).map((_, k) => <Star key={k} className={cx(className, 'fill-gold-400 text-gold-400')} />)}</div>
}

export function Testimonials({ title = 'Client Testimonials', showAll = true }) {
  const all = useCollection('testimonials')
  const list = all.some((t) => t.featured) ? all.filter((t) => t.featured) : all
  const [i, setI] = useState(0)
  const [video, setVideo] = useState(null)
  useEffect(() => {
    if (list.length < 2) return
    const t = setInterval(() => setI((x) => (x + 1) % list.length), 6000)
    return () => clearInterval(t)
  }, [list.length])
  if (!list.length) return null
  const t = list[i % list.length]
  return (
    <section className="bg-[#f5f8f5]">
      <div className="container-x py-16">
        <SectionHead eyebrow="Testimonials" title={title} center />
        <div className="relative mx-auto max-w-3xl">
          <div key={i} className="card relative px-6 py-10 text-center animate-fadeUp sm:px-12">
            <Quote className="absolute left-6 top-6 h-10 w-10 text-gold-300" />
            <div className="flex justify-center"><Stars n={t.rating} /></div>
            <p className="mt-5 font-display text-lg leading-relaxed text-ink sm:text-xl">“{t.message}”</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {t.photo ? <img src={t.photo} alt={t.name} className="h-12 w-12 rounded-full object-cover" /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-800 font-bold text-white">{(t.name || '?')[0]}</span>}
              <div className="text-left"><p className="font-bold">{t.name}</p><p className="text-sm text-gray-500">{tSub(t)}</p></div>
            </div>
            {t.video_url && <button onClick={() => setVideo(t)} className="btn-green btn-sm mt-5"><Play className="h-3.5 w-3.5 fill-current" /> Watch video testimonial</button>}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {list.length > 1 && <>
              <button onClick={() => setI((i - 1 + list.length) % list.length)} className="grid h-10 w-10 place-items-center rounded-full border bg-white hover:border-brand-600" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
              <div className="flex gap-2">{list.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} className={cx('h-2.5 rounded-full transition-all', k === i % list.length ? 'w-7 bg-brand-700' : 'w-2.5 bg-gray-300')} />)}</div>
              <button onClick={() => setI((i + 1) % list.length)} className="grid h-10 w-10 place-items-center rounded-full border bg-white hover:border-brand-600" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
            </>}
            {showAll && <Link to="/clients" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:gap-2.5 sm:ml-4">All client stories <ArrowRight className="h-4 w-4" /></Link>}
          </div>
        </div>
      </div>
      {video && <VideoModal url={video.video_url} title={video.name} onClose={() => setVideo(null)} />}
    </section>
  )
}

export function VideoModal({ url, title, onClose }) {
  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-black/90 p-4" onClick={onClose}>
      <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white" aria-label="Close"><X className="h-6 w-6" /></button>
      <div className="aspect-video w-full max-w-5xl" onClick={(e) => e.stopPropagation()}><VideoPlayer url={url} title={title} /></div>
    </div>
  )
}

export function ClientLogos({ title, dark = false }) {
  const clients = useCollection('clients')
  if (!clients.length) return null
  const row = clients.length < 6 ? [...clients, ...clients, ...clients] : clients
  return (
    <section className={dark ? 'bg-brand-900' : 'border-y border-gray-100 bg-white'}>
      <div className="container-x py-10">
        {title && <p className={cx('mb-6 text-center text-xs font-bold uppercase tracking-[.22em]', dark ? 'text-gold-300' : 'text-gray-500')}>{title}</p>}
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
            {[...row, ...row].map((c, k) => <ClientBadge key={k} c={c} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ClientBadge({ c, large = false }) {
  const inner = c.logo
    ? <img src={c.logo} alt={c.name} className={cx('w-auto object-contain', large ? 'max-h-16' : 'max-h-10')} loading="lazy" />
    : <span className="flex items-center gap-2.5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-800 font-display text-sm font-bold text-white">{initials(c.name)}</span><span className="text-left"><span className="block text-sm font-bold leading-tight text-ink">{c.name}</span>{c.location && <span className="text-[11px] text-gray-500">{c.location}</span>}</span></span>
  const cls = cx('flex shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-gray-200 transition hover:ring-brand-500', large ? 'h-28 px-6' : 'h-16 min-w-[180px] px-5')
  return c.website ? <a href={c.website} target="_blank" rel="noreferrer" className={cls} title={c.name}>{inner}</a> : <div className={cls} title={c.name}>{inner}</div>
}
const initials = (n) => String(n || '?').split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?'

export function Faq({ title = 'Frequently Asked Questions' }) {
  const list = useCollection('faqs')
  const [open, setOpen] = useState(0)
  if (!list.length) return null
  return (
    <section className="bg-white">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="h2 mt-2">{title}</h2>
          <p className="mt-3 text-gray-600">Can’t find what you’re looking for? Reach out and our team will help you.</p>
          <Link to="/contact" className="btn-green mt-6">Contact Us <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="space-y-3">
          {list.map((f, i) => (
            <div key={f.id} className={cx('rounded-xl border transition', open === i ? 'border-brand-600 bg-brand-50/50' : 'border-gray-200 bg-white')}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="font-semibold">{f.question}</span>
                <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full', open === i ? 'bg-brand-800 text-white' : 'bg-gray-100')}>{open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
              </button>
              {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600 animate-fadeUp">{f.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Lightbox({ items, index, onClose, onIndex }) {
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [index, items.length, onClose, onIndex])
  const it = items[index]
  if (!it) return null
  const isVideo = it.video_url
  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-black/95" onClick={onClose}>
      <div className="flex items-center justify-between p-4 text-white">
        <span className="text-sm text-white/70">{index + 1} / {items.length}</span>
        <button className="rounded-full bg-white/10 p-2"><X className="h-6 w-6" /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <div className="aspect-video w-full max-w-5xl"><VideoPlayer url={it.video_url} title={it.title} /></div>
        ) : (
          <img key={it.image} src={it.image} alt={it.title} className="max-h-[78vh] max-w-full rounded-lg object-contain animate-fadeUp" />
        )}
        {items.length > 1 && <>
          <button onClick={() => onIndex((index - 1 + items.length) % items.length)} className="absolute left-2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"><ChevronLeft className="h-7 w-7" /></button>
          <button onClick={() => onIndex((index + 1) % items.length)} className="absolute right-2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"><ChevronRight className="h-7 w-7" /></button>
        </>}
      </div>
      {it.title && <p className="pb-6 text-center font-display text-lg font-semibold text-white">{it.title}</p>}
    </div>
  )
}
