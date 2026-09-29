import { ServiceCard } from '../components/Cards'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import { PageHero, SectionHead, CtaBand, usePageMeta } from '../components/Sections'
import { useCollection, useContent } from '../lib/ContentContext'
import { cx } from '../lib/utils'

export default function Services() {
  const pg = useContent('services_page')
  const list = useCollection('services')
  usePageMeta('Services', pg.hero_text)
  return (
    <>
      <PageHero data={pg} crumbs={[{ label: 'Services' }]} />
      <section className="bg-white">
        <div className="container-x py-14">
          <SectionHead title={pg.section_title} action={<p className="max-w-md text-sm text-gray-600">{pg.section_text}</p>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {list.map((s, i) => <Reveal key={s.id} delay={(i % 6) * 60}><ServiceCard s={s} /></Reveal>)}
          </div>
        </div>
      </section>
      <section className="bg-[#f5f8f5]">
        <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {(pg.benefits || []).map((b, i) => (
            <div key={i} className={cx('flex items-start gap-4', i > 0 && 'lg:border-l lg:pl-6')}>
              <Icon name={b.icon} className="h-10 w-10 shrink-0 text-brand-800" />
              <div><h4 className="font-bold">{b.title}</h4><p className="mt-1 text-sm text-gray-600">{b.text}</p></div>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title={pg.cta_title} text={pg.cta_text} button={pg.cta_button} icon="Users" />
    </>
  )
}
