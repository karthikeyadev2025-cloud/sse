import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, CheckCircle2, MapPin, PhoneCall, MessageCircle, Sparkles } from 'lucide-react'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import { ProductCard } from '../components/Cards'
import { HeroBadges, HeroCorner, SectionHead, CtaBand, WhyChoose, Testimonials, Faq, ClientLogos, usePageMeta } from '../components/Sections'
import { useQuote } from '../components/QuoteModal'
import { useCollection, useContent, useSettings } from '../lib/ContentContext'
import { cx, nl2br, telLink, waLink } from '../lib/utils'

const SLIDE_MS = 7000
const MASK = { WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 18%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 18%)' }

function HeroButton({ text, link, primary }) {
  if (!text) return null
  const cls = primary ? 'btn-gold px-7 py-3.5' : 'btn-outline px-7 py-3.5'
  const inner = <>{text} {primary && <ArrowRight className="h-4 w-4" />}</>
  if (!link || link.startsWith('#') || link.startsWith('http')) {
    return <a href={link || '#quote'} className={cls} {...(link?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{inner}</a>
  }
  return <Link to={link} className={cls}>{inner}</Link>
}

function Hero() {
  const slides = useCollection('hero_slides')
  const h = useContent('home')
  const c = useContent('common')
  const s0 = useSettings()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length
  useEffect(() => {
    if (n < 2 || paused) return
    const t = setTimeout(() => setI((x) => (x + 1) % n), SLIDE_MS)
    return () => clearTimeout(t)
  }, [n, i, paused])
  if (!n) return null
  const cur = i % n
  const s = slides[cur]
  const stat = c.stats?.[0]
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f3f8f4] to-[#e4efe7]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* soft rice-field glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-gold-200/30 blur-3xl" />
      <div className="relative h-64 overflow-hidden sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[62%]">
        {slides.map((sl, k) => (
          <div key={sl.id} className={cx('absolute inset-0 transition-opacity duration-[1200ms]', k === cur ? 'opacity-100' : 'opacity-0')} style={MASK}>
            {sl.video
              ? <video src={sl.video} poster={sl.image} autoPlay muted loop playsInline className="h-full w-full object-cover" />
              : <img src={sl.image} alt="" className={cx('h-full w-full object-cover', k === cur && 'animate-kenburns')} key={k === cur ? `a${i}` : 'b'} />}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent lg:hidden" />
        <HeroCorner text={h.hero_corner_text} />
        {h.hero_side_title && (
          <div className="absolute right-5 top-6 hidden max-w-[250px] rounded-2xl bg-white/85 p-4 shadow-lift ring-1 ring-white backdrop-blur-md xl:block">
            <p className="font-display text-sm font-bold uppercase tracking-[.14em] text-brand-900">{nl2br(h.hero_side_title).map((l, k) => <span key={k} className="block">{l}</span>)}</p>
            <span className="mt-2 block h-[3px] w-10 rounded-full bg-gold-400" />
            <p className="mt-2 text-xs leading-snug text-gray-700">{h.hero_side_text}</p>
          </div>
        )}
        {stat && (
          <div className="absolute bottom-8 left-[16%] hidden items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lift ring-1 ring-black/5 animate-floaty lg:flex">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-800 text-gold-300"><Icon name={stat.icon} className="h-5 w-5" /></span>
            <span><span className="block font-display text-xl font-extrabold leading-none text-ink"><CountUp value={stat.value} /></span><span className="text-[11px] font-medium text-gray-500">{stat.label}</span></span>
          </div>
        )}
      </div>

      <div className="container-x relative py-10 lg:flex lg:min-h-[620px] lg:items-center lg:py-16">
        <div key={s.id} className="max-w-xl lg:max-w-[46%]">
          <p className="eyebrow animate-fadeUp">{s.eyebrow}</p>
          <h1 className="mt-4 text-[2.35rem] font-extrabold uppercase leading-[1.02] tracking-tight text-ink animate-fadeUp [animation-delay:80ms] sm:text-5xl xl:text-[3.65rem]">
            {s.title} <span className="block bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">{s.highlight}</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-snug text-gray-700 animate-fadeUp [animation-delay:160ms]">{s.subtitle}</p>
          <div className="animate-fadeUp [animation-delay:220ms]"><HeroBadges badges={h.hero_badges} /></div>
          <div className="mt-8 flex flex-wrap gap-3 animate-fadeUp [animation-delay:280ms]">
            <HeroButton text={s.btn1_text} link={s.btn1_link} primary />
            <HeroButton text={s.btn2_text} link={s.btn2_link} />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 animate-fadeUp [animation-delay:340ms]">
            <a href={telLink(s0.phone)} className="inline-flex items-center gap-2 font-semibold hover:text-brand-700"><PhoneCall className="h-4 w-4 text-brand-700" />{s0.phone}</a>
            <a href={waLink(s0.whatsapp, s0.whatsapp_default_message)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold hover:text-[#128C4B]"><MessageCircle className="h-4 w-4 text-[#25D366]" />WhatsApp us</a>
          </div>
          {n > 1 && (
            <div className="mt-8 flex items-center gap-3">
              <button onClick={() => setI((cur - 1 + n) % n)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-300 bg-white/80 transition hover:border-brand-700 hover:bg-white" aria-label="Previous slide"><ChevronLeft className="h-4 w-4" /></button>
              <div className="flex gap-2">
                {slides.map((sl, k) => (
                  <button key={sl.id} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} className={cx('relative h-2.5 overflow-hidden rounded-full bg-gray-300 transition-all', k === cur ? 'w-12' : 'w-2.5 hover:bg-gray-400')}>
                    {k === cur && <span key={`p${i}${paused}`} className="absolute inset-y-0 left-0 rounded-full bg-brand-700" style={{ animation: paused ? 'none' : `progress ${SLIDE_MS}ms linear forwards`, width: paused ? '100%' : undefined }} />}
                  </button>
                ))}
              </div>
              <button onClick={() => setI((cur + 1) % n)} className="grid h-9 w-9 place-items-center rounded-full border border-gray-300 bg-white/80 transition hover:border-brand-700 hover:bg-white" aria-label="Next slide"><ChevronRight className="h-4 w-4" /></button>
              <span className="ml-2 font-display text-sm font-semibold tabular-nums text-gray-500">{String(cur + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Strip() {
  const h = useContent('home')
  return (
    <section className="relative bg-brand-900 text-white">
      <div className="pointer-events-none absolute inset-0 grain-bg opacity-60" />
      <div className="container-x relative grid grid-cols-2 gap-y-6 py-7 lg:grid-cols-4">
        {(h.strip || []).map((s, i) => (
          <div key={i} className={cx('group flex items-center gap-3.5 px-2 sm:px-5', i > 0 && 'lg:border-l lg:border-white/15')}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-ink"><Icon name={s.icon} className="h-6 w-6" /></span>
            <div><p className="text-sm font-bold sm:text-[15px]">{s.title}</p><p className="text-xs text-white/65">{s.text}</p></div>
          </div>
        ))}
      </div>
    </section>
  )
}

const ViewAll = ({ to, children }) => (
  <Link to={to} className="group inline-flex shrink-0 self-start items-center gap-2 rounded-full border border-brand-200 md:self-auto bg-white px-4 py-2 text-sm font-bold text-brand-800 transition hover:border-brand-700 hover:bg-brand-800 hover:text-white">
    {children} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
  </Link>
)

function ImageTile({ to, onClick, image, title, text, meta, className = '', big = false }) {
  const Tag = to ? Link : 'button'
  return (
    <Tag to={to} onClick={onClick} className={cx('group relative block overflow-hidden rounded-2xl bg-brand-900 text-left shadow-card', className)}>
      <img src={image} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/35 to-transparent" />
      <div className={cx('absolute inset-x-0 bottom-0', big ? 'p-6 sm:p-8' : 'p-5')}>
        {meta && <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">{meta}</p>}
        <h3 className={cx('font-display font-bold leading-tight text-white', big ? 'text-2xl sm:text-3xl' : 'text-lg')}>{title}</h3>
        {text && <p className={cx('mt-1.5 text-white/75', big ? 'max-w-md text-sm sm:text-base' : 'line-clamp-2 text-[13px]')}>{text}</p>}
      </div>
      <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-gold-400 text-ink opacity-0 shadow-lift transition group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="h-5 w-5" /></span>
    </Tag>
  )
}

export default function Home() {
  usePageMeta('')
  const h = useContent('home')
  const c = useContent('common')
  const { open } = useQuote()
  const products = useCollection('products')
  const cats = useCollection('product_categories')
  const industries = useCollection('industries')
  const projects = useCollection('projects')
  const featuredProducts = (products.filter((p) => p.featured).length >= 4 ? products.filter((p) => p.featured) : products).slice(0, 8)
  const featuredIndustries = (industries.filter((p) => p.featured).length ? industries.filter((p) => p.featured) : industries).slice(0, 4)
  const featuredProjects = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 4)
  const usedCats = cats.filter((ct) => products.some((p) => p.category === ct.slug))

  return (
    <>
      <Hero />
      <Strip />

      {/* Products */}
      <section className="bg-white">
        <div className="container-x py-16 lg:py-20">
          <SectionHead eyebrow={h.products_eyebrow} title={h.products_title} action={<ViewAll to="/products">View All Products</ViewAll>} />
          {usedCats.length > 0 && (
            <div className="no-scrollbar -mx-4 -mt-2 mb-8 flex gap-2 overflow-x-auto px-4">
              {usedCats.map((ct) => (
                <Link key={ct.id} to={`/products?category=${ct.slug}`} className="whitespace-nowrap rounded-full border border-gray-200 px-4 py-1.5 text-[13px] font-semibold text-gray-700 transition hover:border-brand-700 hover:bg-brand-50 hover:text-brand-800">{ct.name}</Link>
              ))}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 80}><ProductCard p={p} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative overflow-hidden bg-[#f5f8f5]">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          <Reveal className="relative pb-10 pr-10 sm:pb-14 sm:pr-14">
            <img src={h.about_image} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
            {h.about_image2 && <img src={h.about_image2} alt="" className="absolute bottom-0 right-0 w-[46%] rounded-2xl border-[6px] border-[#f5f8f5] object-cover shadow-lift aspect-[4/3]" />}
            {c.stats?.[2] && (
              <div className="absolute -left-2 top-6 rounded-2xl bg-gold-400 px-5 py-4 shadow-lift sm:-left-5">
                <p className="font-display text-3xl font-extrabold leading-none text-ink"><CountUp value={c.stats[2].value} /></p>
                <p className="mt-1 text-xs font-semibold text-ink/80">{c.stats[2].label}</p>
              </div>
            )}
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">{h.about_eyebrow}</p>
            <h2 className="h2 mt-2">{h.about_title}</h2>
            <p className="mt-4 leading-relaxed text-gray-600">{h.about_text}</p>
            {h.about_points?.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {h.about_points.map((pt, k) => <li key={k} className="flex items-start gap-2.5 text-[15px] font-medium text-ink"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />{pt}</li>)}
              </ul>
            )}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(c.stats || []).map((s, k) => (
                <div key={k} className="rounded-2xl bg-white p-4 text-center shadow-card">
                  <p className="font-display text-lg font-extrabold text-brand-800 sm:text-xl"><CountUp value={s.value} /></p>
                  <p className="mt-0.5 text-[11px] leading-tight text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-gold mt-8">{h.about_button} <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white">
        <div className="container-x py-16 lg:py-20">
          <SectionHead eyebrow={h.process_eyebrow} title={h.process_title} center />
          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <div className="absolute left-[10%] right-[10%] top-[52px] hidden h-[2px] bg-[repeating-linear-gradient(90deg,#f8bd12_0_10px,transparent_10px_18px)] lg:block" />
            {(h.process || []).map((p, i) => (
              <Reveal key={i} delay={i * 100} className="group relative rounded-2xl p-5 pt-6 text-center transition hover:bg-brand-50/60">
                <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-800 font-display text-xl font-extrabold text-white ring-8 ring-white transition group-hover:bg-gold-400 group-hover:text-ink group-hover:ring-brand-50">{i + 1}</span>
                <h4 className="mt-4 font-bold">{p.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width image band */}
      {h.band_title && (
        <section className="relative overflow-hidden">
          <img src={h.band_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/80 to-brand-900/40" />
          <div className="container-x relative py-16 text-white lg:py-24">
            <Reveal className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-gold-300 backdrop-blur"><Sparkles className="h-3.5 w-3.5" />{h.band_eyebrow}</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.8rem]">{h.band_title}</h2>
              <p className="mt-4 max-w-xl text-lg text-white/75">{h.band_text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => open({ source: 'home-band' })} className="btn-gold px-7 py-3.5">{h.band_button} <ArrowRight className="h-4 w-4" /></button>
                <Link to="/projects" className="btn border-2 border-white/40 px-7 py-3.5 text-white hover:bg-white hover:text-ink">See Our Projects</Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Industries */}
      <section className="bg-[#f5f8f5]">
        <div className="container-x py-16 lg:py-20">
          <SectionHead eyebrow={h.industries_eyebrow} title={h.industries_title} action={<ViewAll to="/industries">View All Industries</ViewAll>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredIndustries.map((it, i) => (
              <Reveal key={it.id} delay={i * 80}>
                <ImageTile to={`/industries#${it.slug}`} image={it.image} title={it.title} text={it.short_desc} className="aspect-[4/3] w-full sm:aspect-[5/4]" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects — bento */}
      {featuredProjects.length > 0 && (
        <section className="bg-white">
          <div className="container-x py-16 lg:py-20">
            <SectionHead eyebrow={h.projects_eyebrow} title={h.projects_title} action={<ViewAll to="/projects">View All Projects</ViewAll>} />
            <div className="grid gap-5 lg:grid-cols-4 lg:grid-rows-2">
              {featuredProjects.map((p, i) => (
                <Reveal key={p.id} delay={i * 80} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : i === 1 ? 'lg:col-span-2' : ''}>
                  <ImageTile to={`/projects/${p.slug}`} image={p.image} title={p.title} text={p.short_desc} big={i === 0}
                    meta={p.location && <><MapPin className="h-3 w-3" />{p.location}</>}
                    className={cx('w-full', i === 0 ? 'aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]' : 'aspect-[16/10] lg:aspect-auto lg:h-[250px]')} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <ClientLogos title={h.clients_strip_title} />
      <WhyChoose title={h.why_title} videoImage={h.video_image} videoUrl={h.video_url} videoTitle={h.video_title} videoSub={h.video_sub} />
      <Testimonials title={h.testimonials_title} />
      <Faq title={h.faq_title} />
      <CtaBand />
    </>
  )
}
