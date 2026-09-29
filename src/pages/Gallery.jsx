import { useState } from 'react'
import { ImageIcon, PlayCircle } from 'lucide-react'
import Reveal from '../components/Reveal'
import { PageHero, CtaBand, Lightbox, usePageMeta } from '../components/Sections'
import { useCollection, useContent } from '../lib/ContentContext'

export default function Gallery() {
  const pg = useContent('gallery_page')
  const items = useCollection('gallery')
  const cats = useCollection('gallery_categories')
  const [cat, setCat] = useState('all')
  const [lb, setLb] = useState(-1)
  usePageMeta('Gallery', pg.hero_text)
  const list = items.filter((g) => cat === 'all' || g.category === cat)
  const usedCats = cats.filter((c) => items.some((g) => g.category === c.slug))
  return (
    <>
      <PageHero data={pg} crumbs={[{ label: 'Gallery' }]} />
      <section className="bg-white">
        <div className="container-x py-12">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {[{ slug: 'all', name: 'All' }, ...usedCats].map((c) => <button key={c.slug} onClick={() => setCat(c.slug)} className={cat === c.slug ? 'chip-on' : 'chip-off'}>{c.name}</button>)}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((g, i) => (
              <Reveal key={g.id} delay={(i % 5) * 50}>
                <button onClick={() => setLb(i)} className="group block w-full overflow-hidden rounded-xl bg-white text-left shadow-card ring-1 ring-black/5">
                  <div className="img-zoom relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
                    {g.video_url && <PlayCircle className="absolute inset-0 m-auto h-12 w-12 text-white drop-shadow-lg" />}
                    <div className="absolute inset-0 bg-brand-900/0 transition group-hover:bg-brand-900/25" />
                  </div>
                  <p className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-semibold"><ImageIcon className="h-4 w-4 shrink-0 text-gray-500" /><span className="line-clamp-1">{g.title}</span></p>
                </button>
              </Reveal>
            ))}
          </div>
          {!list.length && <p className="py-16 text-center text-gray-500">No images yet.</p>}
        </div>
      </section>
      {lb >= 0 && <Lightbox items={list} index={lb} onIndex={setLb} onClose={() => setLb(-1)} />}
      <CtaBand title={pg.cta_title} text={pg.cta_text} button={pg.cta_button} icon="Image" />
    </>
  )
}
