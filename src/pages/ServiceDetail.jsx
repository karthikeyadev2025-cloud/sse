import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, ArrowRight, MessageCircle, PhoneCall } from 'lucide-react'
import Icon from '../components/Icon'
import { Breadcrumb, CtaBand, VideoPlayer, usePageMeta } from '../components/Sections'
import { useCollection, useSettings, useSite } from '../lib/ContentContext'
import { useQuote } from '../components/QuoteModal'
import { waLink, telLink, cx } from '../lib/utils'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const { slug } = useParams()
  const { loading } = useSite()
  const services = useCollection('services')
  const s = useSettings()
  const { open } = useQuote()
  const sv = services.find((x) => x.slug === slug)
  usePageMeta(sv?.title, sv?.short_desc)
  if (!sv) return loading ? <div className="min-h-[60vh]" /> : <NotFound />
  return (
    <>
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <img src={sv.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-transparent" />
        <div className="container-x relative py-16">
          <div className="[&_a]:text-white/80 [&_span]:text-white/90"><Breadcrumb items={[{ label: 'Services', to: '/services' }, { label: sv.title }]} /></div>
          <span className="mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-gold-400 text-ink"><Icon name={sv.icon} className="h-7 w-7" /></span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold sm:text-5xl">{sv.title}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">{sv.short_desc}</p>
        </div>
      </section>
      <section className="bg-white">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_340px]">
          <div>
            <img src={sv.image} alt={sv.title} className="aspect-[16/8] w-full rounded-2xl object-cover shadow-card" />
            {sv.video_url && <div className="mt-6 aspect-video overflow-hidden rounded-2xl"><VideoPlayer url={sv.video_url} title={sv.title} autoPlay={false} /></div>}
            <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-gray-700">{sv.description}</p>
            {sv.features?.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {sv.features.map((f, i) => <li key={i} className="flex items-start gap-2.5 rounded-xl bg-brand-50/60 p-4 text-sm font-medium"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />{f}</li>)}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => open({ title: sv.title, source: 'service-detail' })} className="btn-gold">Request this Service <ArrowRight className="h-4 w-4" /></button>
              <a href={waLink(s.whatsapp, `Hello, I need your "${sv.title}" service.`)} target="_blank" rel="noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              <a href={telLink(s.phone)} className="btn-outline"><PhoneCall className="h-4 w-4" /> Call</a>
            </div>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card overflow-hidden">
              <h3 className="bg-brand-800 px-5 py-3.5 font-bold text-white">All Services</h3>
              <ul className="p-2">
                {services.map((x) => (
                  <li key={x.id}><Link to={`/services/${x.slug}`} className={cx('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium', x.slug === slug ? 'bg-gold-300 font-bold' : 'hover:bg-gray-50')}><Icon name={x.icon} className="h-4 w-4 text-brand-700" />{x.title}</Link></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-brand-900 p-6 text-white">
              <p className="font-display text-xl font-bold">Need help right now?</p>
              <p className="mt-1 text-sm text-white/70">Talk to our experts directly.</p>
              <a href={telLink(s.phone)} className="mt-4 block font-display text-2xl font-extrabold text-gold-300">{s.phone}</a>
            </div>
          </aside>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
