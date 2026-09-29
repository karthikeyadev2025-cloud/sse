import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '../components/Cards'
import Reveal from '../components/Reveal'
import { PageHero, StatsBar, Testimonials, usePageMeta } from '../components/Sections'
import { useCollection, useContent } from '../lib/ContentContext'
import { useQuote } from '../components/QuoteModal'

export default function Projects() {
  const pg = useContent('projects_page')
  const projects = useCollection('projects')
  const cats = useCollection('project_categories')
  const { open } = useQuote()
  const [cat, setCat] = useState('all')
  usePageMeta('Projects', pg.hero_text)
  const list = projects.filter((p) => cat === 'all' || p.category === cat)
  return (
    <>
      <PageHero data={pg} crumbs={[{ label: 'Projects' }]} />
      <section className="bg-white">
        <div className="container-x py-12">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {[{ slug: 'all', name: 'All Projects' }, ...cats].map((c) => <button key={c.slug} onClick={() => setCat(c.slug)} className={cat === c.slug ? 'chip-on' : 'chip-off'}>{c.name}</button>)}
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 70}><ProjectCard p={p} /></Reveal>)}
          </div>
          {!list.length && <p className="py-16 text-center text-gray-500">No projects in this category yet.</p>}
        </div>
      </section>
      <StatsBar />
      <Testimonials />
      <section className="bg-white pb-16">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-10 text-white sm:px-12">
            <img src={projects[0]?.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div><h3 className="text-3xl font-bold">{pg.cta_title}</h3><p className="mt-2 text-white/75">{pg.cta_text}</p></div>
              <button onClick={() => open()} className="btn-gold">Get a Quote <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
