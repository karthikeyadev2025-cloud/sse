import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Eye, Users, CheckCircle2, XCircle, MapPin, PhoneCall, ChevronRight, Droplets, ZoomIn } from 'lucide-react'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import { PageHero, StatsBar, WhyChoose, CtaBand, Testimonials, Lightbox, usePageMeta } from '../components/Sections'
import { useQuote } from '../components/QuoteModal'
import { useContent, useSettings, useCollection } from '../lib/ContentContext'
import TeamCard from '../components/TeamCard'
import { cx, telLink } from '../lib/utils'

const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean)

const SUBNAV = [
  ['overview', 'Overview'],
  ['process', 'Drying Process'],
  ['technologies', 'Technologies'],
  ['specifications', 'Specifications'],
  ['benefits', 'Benefits'],
]

function Head({ eyebrow, title, text, light = false, center = false }) {
  return (
    <div className={cx('mb-10 max-w-3xl', center && 'mx-auto text-center')}>
      {eyebrow && <p className={cx('eyebrow', light && 'text-gold-300', center && 'justify-center')}>{eyebrow}</p>}
      <h2 className={cx('h2 mt-2', light && 'text-white')}>{title}</h2>
      {text && <p className={cx('mt-3 text-lg leading-relaxed', light ? 'text-white/70' : 'text-gray-600')}>{text}</p>}
    </div>
  )
}

export default function About() {
  const a = useContent('about')
  const s = useSettings()
  const { open } = useQuote()
  const [lb, setLb] = useState(-1)
  usePageMeta('About Us', a.hero_text)
  const sheets = (a.datasheets || []).filter((d) => d.image)
  const tp = useContent('team_page')
  const teamAll = useCollection('team')
  const team = (teamAll.some((m) => m.featured) ? teamAll.filter((m) => m.featured) : teamAll).slice(0, 4)

  return (
    <>
      <PageHero data={a} crumbs={[{ label: 'About Us' }]}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/products" className="btn-gold">Our Products <ArrowRight className="h-4 w-4" /></Link>
          <button onClick={() => open({ source: 'about-hero' })} className="btn-outline">Talk to an Engineer</button>
        </div>
      </PageHero>

      {/* sticky in-page navigation */}
      <nav className="sticky top-[72px] z-30 border-b bg-white/95 backdrop-blur">
        <div className="container-x no-scrollbar flex gap-1 overflow-x-auto py-2">
          {SUBNAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-brand-50 hover:text-brand-800">{label}</a>
          ))}
        </div>
      </nav>

      {/* WHO WE ARE */}
      <section id="overview" className="scroll-mt-32 bg-white">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <Reveal className="relative">
            <img src={a.story_image} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-brand-900 p-5 text-white shadow-lift sm:left-auto sm:w-80">
              <p className="font-display text-lg font-bold">{s.company_name}</p>
              <p className="text-sm text-gold-300">{a.legal_name}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-white/70"><MapPin className="h-3.5 w-3.5" />{a.location}</p>
              <a href={telLink(s.phone)} className="mt-1 flex items-center gap-1.5 text-xs text-white/80 hover:text-gold-300"><PhoneCall className="h-3.5 w-3.5" />{[s.phone, s.phone_alt].filter(Boolean).join('  |  ')}</a>
            </div>
          </Reveal>
          <Reveal delay={100} className="pt-6 lg:pt-0">
            <p className="eyebrow">{a.legal_name}</p>
            <h2 className="h2 mt-2">{a.story_title}</h2>
            <p className="mt-4 leading-relaxed text-gray-600">{a.story_text}</p>
            <p className="mt-3 leading-relaxed text-gray-600">{a.story_text2}</p>
            {a.capabilities?.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {a.capabilities.map((c, i) => (
                  <span key={c} className="flex items-center gap-2">
                    <span className="rounded-lg bg-brand-800 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white">{c}</span>
                    {i < a.capabilities.length - 1 && <ChevronRight className="h-4 w-4 text-gold-500" />}
                  </span>
                ))}
              </div>
            )}
            {a.product_lines?.length > 0 && (
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {a.product_lines.map((p) => <li key={p} className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />{p}</li>)}
              </ul>
            )}
            {a.tagline && <p className="mt-6 border-l-4 border-gold-400 pl-4 font-display text-lg font-semibold italic text-brand-900">“{a.tagline}”</p>}
          </Reveal>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="bg-[#f5f8f5]">
        <div className="container-x grid gap-5 py-14 md:grid-cols-3">
          {[[Target, 'Our Mission', a.mission], [Eye, 'Our Vision', a.vision]].map(([I, t, txt], i) => (
            <Reveal key={t} delay={i * 80} className="card p-7">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-800 text-white"><I className="h-6 w-6" /></span>
              <h3 className="mt-5 text-xl font-bold">{t}</h3>
              <p className="mt-2 leading-relaxed text-gray-600">{txt}</p>
            </Reveal>
          ))}
          <Reveal delay={160} className="card p-7">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-400 text-ink"><Users className="h-6 w-6" /></span>
            <h3 className="mt-5 text-xl font-bold">Our Values</h3>
            <ul className="mt-3 space-y-2">{(a.values || []).map((v) => <li key={v} className="flex items-start gap-2 text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />{v}</li>)}</ul>
          </Reveal>
        </div>
      </section>

      <StatsBar />

      {/* WHY DRYING MATTERS */}
      <section id="process" className="scroll-mt-32 bg-white">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
          <Reveal>
            <Head eyebrow="Why It Matters" title={a.why_drying_title} text={a.why_drying_text} />
            <ul className="-mt-4 space-y-3">
              {(a.why_drying_points || []).map((p, i) => (
                <li key={i} className="flex gap-3 rounded-xl bg-brand-50/60 p-4 text-[15px] leading-relaxed text-ink">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-800 text-xs font-bold text-white">{i + 1}</span>{p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="relative">
            <img src={a.why_drying_image} alt="" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift" />
            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl bg-white/95 p-4 shadow-lift backdrop-blur">
              <div className="text-center"><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">After parboiling</p><p className="font-display text-2xl font-extrabold text-red-600">{a.moisture_from}</p></div>
              <div className="flex flex-1 items-center justify-center gap-1 px-2 text-gold-500"><Droplets className="h-4 w-4" /><span className="h-[2px] flex-1 bg-gradient-to-r from-red-400 via-gold-400 to-brand-500" /><ArrowRight className="h-4 w-4 text-brand-600" /></div>
              <div className="text-center"><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Mill-ready</p><p className="font-display text-2xl font-extrabold text-brand-700">{a.moisture_to}</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROCESS FLOW */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div className="pointer-events-none absolute inset-0 grain-bg opacity-60" />
        <div className="container-x relative py-16 lg:py-20">
          <Head eyebrow="Process Flow" title={a.process_title} text={a.process_text} light center />
          <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="absolute left-[8%] right-[8%] top-10 hidden h-[2px] bg-[repeating-linear-gradient(90deg,#f8bd12_0_10px,transparent_10px_18px)] lg:block" />
            {(a.process_steps || []).map((st, i) => (
              <Reveal key={i} delay={i * 80} className="relative text-center">
                <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-brand-800 text-gold-300 ring-8 ring-brand-950">
                  <Icon name={st.icon} className="h-8 w-8" />
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-xs font-extrabold text-ink">{i + 1}</span>
                </span>
                <p className="mt-4 text-sm font-bold leading-snug">{st.title}</p>
              </Reveal>
            ))}
          </div>
          {a.process_note && <p className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white/5 p-5 text-center text-sm leading-relaxed text-white/75 ring-1 ring-white/10">{a.process_note}</p>}
        </div>
      </section>

      {/* MANUAL VS MECHANICAL */}
      <section className="bg-white">
        <div className="container-x py-16 lg:py-20">
          <Head eyebrow="Comparison" title={a.compare_title} text={a.compare_text} center />
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            <Reveal className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
              <h3 className="text-lg font-bold uppercase tracking-wide text-gray-500">{a.manual_title}</h3>
              <ul className="mt-5 space-y-3">{(a.manual_points || []).map((p) => <li key={p} className="flex items-start gap-3 text-gray-600"><XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />{p}</li>)}</ul>
            </Reveal>
            <Reveal delay={100} className="rounded-3xl bg-brand-800 p-7 text-white shadow-lift">
              <h3 className="text-lg font-bold uppercase tracking-wide text-gold-300">{a.mechanical_title}</h3>
              <ul className="mt-5 space-y-3">{(a.mechanical_points || []).map((p) => <li key={p} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />{p}</li>)}</ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section id="technologies" className="scroll-mt-32 bg-[#f5f8f5]">
        <div className="container-x py-16 lg:py-20">
          <Head eyebrow="What We Build" title={a.tech_title} text={a.tech_text} />
          <div className="grid gap-5 lg:grid-cols-3">
            {(a.technologies || []).map((t, i) => (
              <Reveal key={i} delay={i * 90} className="card flex flex-col overflow-hidden">
                {t.image && <img src={t.image} alt={t.title} className="aspect-[16/9] w-full object-cover" />}
                <div className="flex flex-1 flex-col p-7">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-800 text-gold-300"><Icon name={t.icon} className="h-7 w-7" /></span>
                  <h3 className="mt-5 text-xl font-bold">{t.title}</h3>
                  <p className="mt-2 text-sm font-medium text-brand-700">{t.tagline}</p>
                  <ul className="mb-6 mt-5 space-y-2.5 border-t pt-5">{lines(t.points).map((p, k) => <li key={k} className="flex items-start gap-2.5 text-sm text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />{p}</li>)}</ul>
                  <button onClick={() => open({ product: t.title, source: 'about-technology' })} className="btn-outline-gold btn-sm mt-auto self-start">Enquire <ArrowRight className="h-3.5 w-3.5" /></button>
                </div>
              </Reveal>
            ))}
          </div>

          {/* comparison table */}
          {a.table_rows?.length > 0 && (
            <Reveal className="mt-14">
              <h3 className="text-2xl font-bold">{a.table_title}</h3>
              <p className="mt-1 text-gray-600">{a.table_text}</p>
              <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-black/5">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead><tr className="bg-brand-900 text-white">{(a.table_headers || []).map((h, i) => <th key={i} className={cx('px-5 py-4 font-display text-[15px] font-semibold', i === 0 && 'w-44 text-gold-300')}>{h}</th>)}</tr></thead>
                  <tbody>
                    {a.table_rows.map((r, i) => (
                      <tr key={i} className={i % 2 ? 'bg-white' : 'bg-brand-50/40'}>
                        <th className="px-5 py-4 font-semibold text-ink">{r.c1}</th>
                        <td className="px-5 py-4 text-gray-700">{r.c2}</td>
                        <td className="px-5 py-4 text-gray-700">{r.c3}</td>
                        <td className="px-5 py-4 text-gray-700">{r.c4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* AUTOMATION */}
      <section className="bg-white">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-[.9fr_1.4fr] lg:items-center lg:py-20">
          <Reveal>
            <Head eyebrow="Smart Control" title={a.automation_title} text={a.automation_text} />
            <button onClick={() => open({ title: 'PLC dryer automation', source: 'about-automation' })} className="btn-green -mt-4">Ask About Automation <ArrowRight className="h-4 w-4" /></button>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(a.automation || []).map((f, i) => (
              <Reveal key={i} delay={i * 60} className="group rounded-2xl border border-gray-200 p-5 transition hover:border-brand-600 hover:shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-800 transition group-hover:bg-brand-800 group-hover:text-gold-300"><Icon name={f.icon} className="h-5 w-5" /></span>
                <h4 className="mt-4 font-bold">{f.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAPACITY */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="pointer-events-none absolute inset-0 grain-bg opacity-60" />
        <div className="container-x relative py-16 lg:py-20">
          <Head eyebrow="Capacity" title={a.capacity_title} text={a.capacity_text} light center />
          <div className="grid gap-5 md:grid-cols-3">
            {(a.capacities || []).map((c, i) => (
              <Reveal key={i} delay={i * 90} className={cx('rounded-3xl p-7 ring-1', i === 1 ? 'bg-gold-400 text-ink ring-gold-300' : 'bg-white/5 ring-white/15')}>
                <p className={cx('text-xs font-bold uppercase tracking-[.2em]', i === 1 ? 'text-ink/70' : 'text-gold-300')}>{c.label}</p>
                <p className="mt-2 font-display text-4xl font-extrabold tabular-nums">{c.range}</p>
                <p className={cx('mt-3 text-sm leading-relaxed', i === 1 ? 'text-ink/80' : 'text-white/75')}>{c.text}</p>
              </Reveal>
            ))}
          </div>
          {a.capacity_note && <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-white/60">{a.capacity_note}</p>}
        </div>
      </section>

      {/* SPECIFICATIONS + DATASHEETS */}
      <section id="specifications" className="scroll-mt-32 bg-white">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <Head eyebrow="Engineering" title={a.spec_title} text={a.spec_text} />
            <div className="-mt-4 overflow-hidden rounded-2xl ring-1 ring-gray-200">
              <table className="w-full text-sm">
                <tbody>
                  {(a.specs || []).map((r, i) => (
                    <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                      <th className="w-2/5 px-5 py-3.5 text-left font-semibold text-gray-700">{r.label}</th>
                      <td className="px-5 py-3.5 text-gray-700">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Head eyebrow="How It Works" title={a.principle_title} text={a.principle_text} />
            <ol className="-mt-4 space-y-3">
              {(a.principle_points || []).map((p, i) => (
                <li key={i} className="flex gap-3 text-[15px] text-gray-700"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-400 text-xs font-extrabold text-ink">{i + 1}</span><span className="pt-0.5">{p}</span></li>
              ))}
            </ol>
            {sheets.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {sheets.map((d, i) => (
                  <button key={i} onClick={() => setLb(i)} className="group overflow-hidden rounded-2xl bg-white text-left shadow-card ring-1 ring-black/5">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img src={d.image} alt={d.title} loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 grid place-items-center bg-brand-950/0 opacity-0 transition group-hover:bg-brand-950/40 group-hover:opacity-100"><ZoomIn className="h-9 w-9 text-white" /></span>
                    </div>
                    <p className="px-4 py-3 text-sm font-semibold">{d.title}</p>
                  </button>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="scroll-mt-32 bg-[#f5f8f5]">
        <div className="container-x py-16 lg:py-20">
          <Head eyebrow="Why Invest" title={a.benefits_title} text={a.benefits_text} center />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(a.benefits || []).map((b, i) => (
              <Reveal key={i} delay={(i % 3) * 80} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-800 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-ink"><Icon name={b.icon} className="h-6 w-6" /></span>
                <h4 className="mt-4 text-lg font-bold">{b.title}</h4>
                <p className="mt-1.5 text-gray-600">{b.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO SELECT */}
      <section className="bg-white">
        <div className="container-x py-16 lg:py-20">
          <div className="grid gap-10 overflow-hidden rounded-3xl bg-brand-900 p-8 text-white sm:p-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="eyebrow text-gold-300">Buying Guide</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{a.select_title}</h2>
              <p className="mt-3 text-white/70">{a.select_text}</p>
              <button onClick={() => open({ title: a.select_cta, source: 'about-select' })} className="btn-gold mt-8">{a.select_cta} <ArrowRight className="h-4 w-4" /></button>
            </div>
            <ul className="space-y-3">
              {(a.select_points || []).map((p, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-white/5 p-4 text-sm ring-1 ring-white/10"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="bg-[#f5f8f5]">
          <div className="container-x py-16 lg:py-20">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div><p className="eyebrow">Our People</p><h2 className="h2 mt-2">{tp.about_strip_title}</h2></div>
              <Link to="/team" className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-brand-800 transition hover:bg-brand-800 hover:text-white md:self-auto">View Full Team <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">{team.map((m, i) => <Reveal key={m.id} delay={i * 70} className="w-[calc(50%-8px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"><TeamCard m={m} compact /></Reveal>)}</div>
          </div>
        </section>
      )}

      <WhyChoose title={`Why Choose ${s.company_name}?`} videoImage={a.video_image} videoUrl={a.video_url} videoTitle={a.video_title} videoSub={a.video_sub} />
      <Testimonials />
      <CtaBand />
      {lb >= 0 && <Lightbox items={sheets} index={lb} onIndex={setLb} onClose={() => setLb(-1)} />}
    </>
  )
}
