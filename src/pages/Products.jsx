import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Headphones, ArrowRight, SlidersHorizontal, PackageX } from 'lucide-react'
import { ProductCard } from '../components/Cards'
import Reveal from '../components/Reveal'
import { PageHero, CtaBand, usePageMeta } from '../components/Sections'
import { useCollection, useContent } from '../lib/ContentContext'
import { useQuote } from '../components/QuoteModal'
import { cx } from '../lib/utils'

export default function Products() {
  const pg = useContent('products_page')
  const products = useCollection('products')
  const cats = useCollection('product_categories')
  const { open } = useQuote()
  const [params, setParams] = useSearchParams()
  const cat = params.get('category') || 'all'
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('default')
  usePageMeta('Products', pg.hero_text)

  const list = useMemo(() => {
    let l = products.filter((p) => cat === 'all' || p.category === cat)
    const t = q.trim().toLowerCase()
    if (t) l = l.filter((p) => `${p.title} ${p.short_desc}`.toLowerCase().includes(t))
    if (sort === 'az') l = [...l].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'za') l = [...l].sort((a, b) => b.title.localeCompare(a.title))
    if (sort === 'featured') l = [...l].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return l
  }, [products, cat, q, sort])

  const setCat = (c) => { c === 'all' ? params.delete('category') : params.set('category', c); setParams(params, { replace: true }) }
  const count = (slug) => products.filter((p) => p.category === slug).length

  return (
    <>
      <PageHero data={pg} crumbs={[{ label: 'Products' }]} />
      <section className="bg-[#f7f9f7]">
        <div className="container-x grid gap-8 py-12 lg:grid-cols-[270px_1fr]">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card hidden overflow-hidden lg:block">
              <h3 className="bg-brand-800 px-5 py-3.5 text-base font-bold text-white">Product Categories</h3>
              <ul className="p-2">
                {[{ slug: 'all', name: 'All Products' }, ...cats].map((c) => (
                  <li key={c.slug}>
                    <button onClick={() => setCat(c.slug)} className={cx('flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition', cat === c.slug ? 'bg-gold-300 font-bold text-ink' : 'text-gray-700 hover:bg-gray-50')}>
                      {c.name}<span className="text-xs text-gray-500">{c.slug === 'all' ? products.length : count(c.slug)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card hidden p-5 lg:block">
              <div className="flex items-start gap-3"><Headphones className="h-8 w-8 shrink-0 text-brand-800" /><h4 className="font-bold leading-snug">{pg.help_title}</h4></div>
              <p className="mt-3 text-sm text-gray-600">{pg.help_text}</p>
              <button onClick={() => open({ title: 'Get Expert Advice', source: 'products-sidebar' })} className="btn-green mt-4 w-full">Get Expert Advice <ArrowRight className="h-4 w-4" /></button>
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold underline-gold">{cat === 'all' ? 'All Products' : cats.find((c) => c.slug === cat)?.name || 'Products'}</h2>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="input pl-9" />
                </div>
                <div className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto pl-9">
                    <option value="default">Default</option><option value="featured">Popular first</option><option value="az">Name A–Z</option><option value="za">Name Z–A</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 lg:hidden">
              {[{ slug: 'all', name: 'All' }, ...cats].map((c) => <button key={c.slug} onClick={() => setCat(c.slug)} className={cat === c.slug ? 'chip-on' : 'chip-off'}>{c.name}</button>)}
            </div>
            {list.length ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {list.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 70}><ProductCard p={p} /></Reveal>)}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed bg-white p-12 text-center text-gray-500"><PackageX className="mx-auto h-10 w-10 text-gray-300" /><p className="mt-3">No products found.</p></div>
            )}
          </div>
        </div>
      </section>
      <CtaBand title={pg.cta_title} text={pg.cta_text} button="Request a Quote" icon="Settings" />
    </>
  )
}
