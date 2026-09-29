import { Link } from 'react-router-dom'
import { ArrowRight, Target, Eye, Users, CheckCircle2 } from 'lucide-react'
import Reveal from '../components/Reveal'
import { PageHero, StatsBar, WhyChoose, CtaBand, Testimonials, usePageMeta } from '../components/Sections'
import { useContent, useSettings } from '../lib/ContentContext'

export default function About() {
  const a = useContent('about')
  const s = useSettings()
  usePageMeta('About Us', a.hero_text)
  return (
    <>
      <PageHero data={a} crumbs={[{ label: 'About Us' }]}>
        <Link to="/products" className="btn-gold mt-8">Our Products <ArrowRight className="h-4 w-4" /></Link>
      </PageHero>

      <section className="bg-white">
        <div className="container-x grid gap-8 py-16 md:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1fr_1fr_1.2fr]">
          <Reveal className="xl:border-r xl:pr-6">
            <h2 className="text-2xl font-bold underline-gold">{a.story_title}</h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{a.story_text}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{a.story_text2}</p>
          </Reveal>
          {[[Target, 'Our Mission', a.mission], [Eye, 'Our Vision', a.vision]].map(([I, t, txt], i) => (
            <Reveal key={t} delay={(i + 1) * 90} className="xl:border-r xl:pr-6">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-800 text-white ring-4 ring-brand-100"><I className="h-7 w-7" /></span>
              <h3 className="mt-4 text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{txt}</p>
            </Reveal>
          ))}
          <Reveal delay={270}>
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-800 text-white ring-4 ring-brand-100"><Users className="h-7 w-7" /></span>
            <h3 className="mt-4 text-lg font-bold">Our Values</h3>
            <ul className="mt-3 space-y-2">
              {(a.values || []).map((v) => <li key={v} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />{v}</li>)}
            </ul>
          </Reveal>
          <Reveal delay={340} className="relative min-h-[240px] overflow-hidden rounded-2xl md:col-span-2 xl:col-span-1">
            <img src={a.banner_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <p className="max-w-[210px] font-display text-lg font-bold uppercase leading-snug tracking-wide text-ink">{a.banner_text}</p>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[.25em] text-gray-600">{s.tagline}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <StatsBar />
      <WhyChoose title={`Why Choose ${s.company_name}?`} videoImage={a.video_image} videoUrl={a.video_url} videoTitle={a.video_title} videoSub={a.video_sub} />
      <Testimonials />
      <CtaBand />
    </>
  )
}
