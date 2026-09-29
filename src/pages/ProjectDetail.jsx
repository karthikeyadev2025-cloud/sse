import { Link, useParams } from 'react-router-dom'
import { MapPin, Tag, ArrowRight, MessageCircle, Calendar, Gauge, Building2 } from 'lucide-react'
import { Breadcrumb, CtaBand, VideoPlayer, usePageMeta } from '../components/Sections'
import { ProjectCard } from '../components/Cards'
import { ImageGallery } from './ProductDetail'
import { useCollection, useSettings, useSite } from '../lib/ContentContext'
import { useQuote } from '../components/QuoteModal'
import { waLink } from '../lib/utils'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { loading } = useSite()
  const projects = useCollection('projects')
  const cats = useCollection('project_categories')
  const s = useSettings()
  const { open } = useQuote()
  const p = projects.find((x) => x.slug === slug)
  usePageMeta(p?.title, p?.short_desc)
  if (!p) return loading ? <div className="min-h-[60vh]" /> : <NotFound />
  const cat = cats.find((c) => c.slug === p.category)
  const related = projects.filter((x) => x.id !== p.id).slice(0, 4)
  const facts = [[MapPin, 'Location', p.location], [Tag, 'Category', cat?.name], [Gauge, 'Capacity', p.capacity], [Building2, 'Client', p.client], [Calendar, 'Year', p.year]].filter((f) => f[2])
  return (
    <>
      <section className="bg-gradient-to-b from-[#f3f8f4] to-white">
        <div className="container-x py-8">
          <Breadcrumb items={[{ label: 'Projects', to: '/projects' }, { label: p.title }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <ImageGallery images={[p.image, ...(p.images || [])]} title={p.title} />
            <div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{p.title}</h1>
              <p className="mt-3 text-lg text-gray-700">{p.short_desc}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {facts.map(([I, l, v]) => (
                  <div key={l} className="rounded-xl bg-white p-4 ring-1 ring-gray-200">
                    <I className="h-5 w-5 text-brand-700" /><p className="mt-2 text-xs text-gray-500">{l}</p><p className="text-sm font-bold">{v}</p>
                  </div>
                ))}
              </div>
              {p.description && <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-600">{p.description}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => open({ title: `A project like "${p.title}"`, source: 'project-detail' })} className="btn-gold">Start a Similar Project <ArrowRight className="h-4 w-4" /></button>
                <a href={waLink(s.whatsapp, `Hello, I saw your project "${p.title}" and want a similar solution.`)} target="_blank" rel="noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {p.video_url && (
        <section className="bg-white"><div className="container-x pb-14"><h2 className="text-2xl font-bold underline-gold">Project Video</h2><div className="mt-6 aspect-video max-w-4xl overflow-hidden rounded-2xl"><VideoPlayer url={p.video_url} title={p.title} autoPlay={false} /></div></div></section>
      )}
      {related.length > 0 && (
        <section className="bg-[#f7f9f7]">
          <div className="container-x py-14">
            <div className="flex items-end justify-between"><h2 className="text-2xl font-bold underline-gold">More Projects</h2><Link to="/projects" className="text-sm font-bold text-brand-700">View all →</Link></div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <ProjectCard key={r.id} p={r} />)}</div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  )
}
