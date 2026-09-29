import { IndustryCard } from '../components/Cards'
import Reveal from '../components/Reveal'
import { PageHero, SectionHead, CtaBand, usePageMeta } from '../components/Sections'
import { useCollection, useContent } from '../lib/ContentContext'

export default function Industries() {
  const pg = useContent('industries_page')
  const list = useCollection('industries')
  usePageMeta('Industries', pg.hero_text)
  return (
    <>
      <PageHero data={pg} crumbs={[{ label: 'Industries' }]} />
      <section className="bg-white">
        <div className="container-x py-14">
          <SectionHead eyebrow={pg.section_eyebrow} title={pg.section_title} action={<p className="max-w-md text-sm text-gray-600">{pg.section_text}</p>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {list.map((it, i) => <Reveal key={it.id} delay={(i % 5) * 60}><IndustryCard it={it} small /></Reveal>)}
          </div>
        </div>
      </section>
      <CtaBand title={pg.cta_title} text={pg.cta_text} button={pg.cta_button} />
    </>
  )
}
