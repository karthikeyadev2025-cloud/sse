import { Users } from 'lucide-react'
import Reveal from '../components/Reveal'
import TeamCard from '../components/TeamCard'
import { PageHero, SectionHead, CtaBand, usePageMeta } from '../components/Sections'
import { useCollection, useContent } from '../lib/ContentContext'

export default function Team() {
  const pg = useContent('team_page')
  const team = useCollection('team')
  usePageMeta('Our Team', pg.hero_text)

  const groups = []
  if (pg.group_by_department) {
    team.forEach((m) => {
      const d = m.department || 'Team'
      let g = groups.find((x) => x.name === d)
      if (!g) groups.push((g = { name: d, list: [] }))
      g.list.push(m)
    })
  } else groups.push({ name: '', list: team })

  return (
    <>
      <PageHero data={pg} crumbs={[{ label: 'Team' }]} />
      <section className="bg-[#f5f8f5]">
        <div className="container-x py-16 lg:py-20">
          <SectionHead eyebrow={pg.section_eyebrow} title={pg.section_title} text={pg.section_text} center />
          {team.length === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border border-dashed border-brand-200 bg-white p-12 text-center">
              <Users className="mx-auto h-10 w-10 text-brand-300" />
              <p className="mt-3 text-gray-600">{pg.empty_text}</p>
            </div>
          ) : (
            <div className="space-y-14">
              {groups.map((g) => (
                <div key={g.name || 'all'}>
                  {g.name && groups.length > 1 && (
                    <div className="mb-6 flex items-center gap-4">
                      <h3 className="font-display text-xl font-bold text-brand-900">{g.name}</h3>
                      <span className="h-px flex-1 bg-brand-200" />
                      <span className="text-sm font-semibold text-gray-500">{g.list.length}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {g.list.map((m, i) => <Reveal key={m.id} delay={(i % 4) * 70} className="w-[calc(50%-8px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"><TeamCard m={m} /></Reveal>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <CtaBand title={pg.cta_title} text={pg.cta_text} button={pg.cta_button} icon="Users" />
    </>
  )
}
