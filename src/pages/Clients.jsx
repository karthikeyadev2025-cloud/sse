import { useState } from 'react'
import { Quote, Play, Send, Loader2, MapPin, CheckCircle2, Star } from 'lucide-react'
import Reveal from '../components/Reveal'
import { PageHero, SectionHead, StatsBar, CtaBand, ClientBadge, Stars, VideoModal, tSub, usePageMeta } from '../components/Sections'
import { useCollection, useContent } from '../lib/ContentContext'
import { submitTestimonial } from '../lib/api'
import { useToast } from '../components/Toast'
import { cx } from '../lib/utils'

function FeedbackForm({ title, text }) {
  const toast = useToast()
  const [f, setF] = useState({ name: '', company: '', designation: '', location: '', phone: '', rating: 5, message: '' })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    if (!f.name.trim() || f.message.trim().length < 10) return toast('Please enter your name and a message of at least 10 characters', 'error')
    setBusy(true)
    try { await submitTestimonial(f); setDone(true) } catch (ex) { toast(ex.message || 'Could not submit. Please try again.', 'error') }
    setBusy(false)
  }
  return (
    <div className="card p-6 sm:p-8">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{text}</p>
      {done ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-brand-50 p-5 text-brand-900">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-600" />
          <div><p className="font-bold">Thank you for your feedback!</p><p className="text-sm">It will appear on this page once our team has reviewed it.</p></div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <input className="input" placeholder="Your Name *" value={f.name} onChange={set('name')} />
            <input className="input" placeholder="Company / Rice Mill Name" value={f.company} onChange={set('company')} />
            <input className="input" placeholder="Designation (e.g. Owner)" value={f.designation} onChange={set('designation')} />
            <input className="input" placeholder="City / State" value={f.location} onChange={set('location')} />
          </div>
          <input className="input" type="tel" placeholder="Phone (not published)" value={f.phone} onChange={set('phone')} />
          <div>
            <p className="label">Your rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setF({ ...f, rating: n })} aria-label={`${n} star`}>
                  <Star className={cx('h-7 w-7 transition', n <= f.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-300')} />
                </button>
              ))}
            </div>
          </div>
          <textarea className="input min-h-[120px]" maxLength={1500} placeholder="Your experience working with us *" value={f.message} onChange={set('message')} />
          <button disabled={busy} className="btn-gold">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit Feedback</button>
        </form>
      )}
    </div>
  )
}

export default function Clients() {
  const pg = useContent('clients_page')
  const clients = useCollection('clients')
  const testimonials = useCollection('testimonials')
  const [video, setVideo] = useState(null)
  usePageMeta('Our Clients', pg.hero_text)

  return (
    <>
      <PageHero data={pg} crumbs={[{ label: 'Clients' }]} />

      {clients.length > 0 && (
        <section className="bg-white">
          <div className="container-x py-14">
            <SectionHead eyebrow={pg.clients_eyebrow} title={pg.clients_title} text={pg.clients_text} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {clients.map((c, i) => (
                <Reveal key={c.id} delay={(i % 4) * 60} className="card flex flex-col p-4">
                  <ClientBadge c={c} large />
                  <div className="mt-3 px-1">
                    {c.logo && <p className="font-bold">{c.name}</p>}
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      {c.logo && c.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-brand-700" />{c.location}</span>}
                      {c.industry && <span>{c.industry}</span>}
                    </p>
                    {c.project && <p className="mt-2 text-[13px] text-gray-700"><span className="font-semibold">Project:</span> {c.project}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <StatsBar />

      <section className="bg-[#f5f8f5]">
        <div className="container-x py-16">
          <SectionHead eyebrow={pg.testimonials_eyebrow} title={pg.testimonials_title} text={pg.testimonials_text} />
          {testimonials.length ? (
            <div className="columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
              {testimonials.map((t) => (
                <Reveal key={t.id} className="card break-inside-avoid p-6">
                  <div className="flex items-center justify-between">
                    <Stars n={t.rating} />
                    <Quote className="h-7 w-7 text-gold-300" />
                  </div>
                  <p className="mt-4 leading-relaxed text-gray-700">“{t.message}”</p>
                  {t.video_url && <button onClick={() => setVideo(t)} className="btn-green btn-sm mt-4"><Play className="h-3.5 w-3.5 fill-current" /> Watch video</button>}
                  <div className="mt-5 flex items-center gap-3 border-t pt-4">
                    {t.photo ? <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full object-cover" /> : <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-800 font-bold text-white">{(t.name || '?')[0]}</span>}
                    <div className="min-w-0"><p className="font-bold">{t.name}</p><p className="text-xs text-gray-500">{tSub(t)}</p>{t.project && <p className="text-xs font-medium text-brand-700">{t.project}</p>}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : <p className="py-10 text-center text-gray-500">Client stories coming soon.</p>}
        </div>
      </section>

      {pg.feedback_enabled && (
        <section className="bg-white">
          <div className="container-x max-w-3xl py-16"><FeedbackForm title={pg.feedback_title} text={pg.feedback_text} /></div>
        </section>
      )}

      <CtaBand title={pg.cta_title} text={pg.cta_text} button={pg.cta_button} icon="ThumbsUp" />
      {video && <VideoModal url={video.video_url} title={video.name} onClose={() => setVideo(null)} />}
    </>
  )
}
