import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, MessageCircle, PhoneCall, FileText, ArrowRight, Tag } from 'lucide-react'
import { Breadcrumb, CtaBand, Lightbox, VideoPlayer, usePageMeta } from '../components/Sections'
import { ProductCard } from '../components/Cards'
import EnquiryForm from '../components/EnquiryForm'
import { useCollection, useSettings, useSite } from '../lib/ContentContext'
import { useQuote } from '../components/QuoteModal'
import { waLink, telLink, cx } from '../lib/utils'
import NotFound from './NotFound'

export function ImageGallery({ images, title }) {
  const [active, setActive] = useState(0)
  const [lb, setLb] = useState(-1)
  const items = images.filter(Boolean).map((image) => ({ image, title }))
  if (!items.length) return null
  return (
    <div>
      <button onClick={() => setLb(active)} className="img-zoom block w-full overflow-hidden rounded-2xl bg-gray-100 shadow-card">
        <img src={items[active]?.image} alt={title} className="aspect-[4/3] w-full object-cover" />
      </button>
      {items.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
          {items.map((it, i) => (
            <button key={i} onClick={() => setActive(i)} className={cx('h-20 w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition', i === active ? 'ring-gold-400' : 'ring-transparent opacity-70 hover:opacity-100')}>
              <img src={it.image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {lb >= 0 && <Lightbox items={items} index={lb} onIndex={setLb} onClose={() => setLb(-1)} />}
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { loading } = useSite()
  const products = useCollection('products')
  const cats = useCollection('product_categories')
  const s = useSettings()
  const { open } = useQuote()
  const p = products.find((x) => x.slug === slug)
  usePageMeta(p?.title, p?.short_desc)
  if (!p) return loading ? <div className="min-h-[60vh]" /> : <NotFound />
  const cat = cats.find((c) => c.slug === p.category)
  const related = products.filter((x) => x.id !== p.id && x.category === p.category).concat(products.filter((x) => x.id !== p.id && x.category !== p.category)).slice(0, 4)

  return (
    <>
      <section className="bg-gradient-to-b from-[#f3f8f4] to-white">
        <div className="container-x py-8">
          <Breadcrumb items={[{ label: 'Products', to: '/products' }, { label: p.title }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <ImageGallery images={[p.image, ...(p.images || [])]} title={p.title} />
            <div>
              {cat && <Link to={`/products?category=${cat.slug}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"><Tag className="h-3.5 w-3.5" />{cat.name}</Link>}
              <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{p.title}</h1>
              <p className="mt-3 text-lg text-gray-700">{p.short_desc}</p>
              {p.description && <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">{p.description}</p>}
              {p.features?.length > 0 && (
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {p.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />{f}</li>)}
                </ul>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => open({ product: p.title, source: 'product-detail' })} className="btn-gold">Get a Quote <ArrowRight className="h-4 w-4" /></button>
                <a href={waLink(s.whatsapp, `Hello, I am interested in *${p.title}*. Please share details and price.\n${window.location.href}`)} target="_blank" rel="noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" /> WhatsApp Enquiry</a>
                <a href={telLink(s.phone)} className="btn-outline"><PhoneCall className="h-4 w-4" /> Call Now</a>
                {p.brochure && <a href={p.brochure} target="_blank" rel="noreferrer" className="btn-outline"><FileText className="h-4 w-4" /> Brochure</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {p.specs?.length > 0 && (<>
              <h2 className="text-2xl font-bold underline-gold">Specifications</h2>
              <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-gray-200">
                <table className="w-full text-sm">
                  <tbody>
                    {p.specs.map((r, i) => (
                      <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                        <th className="w-2/5 px-5 py-3.5 text-left font-semibold text-gray-700">{r.label}</th>
                        <td className="px-5 py-3.5 text-gray-700">{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>)}
            {p.video_url && (<><h2 className="mt-10 text-2xl font-bold underline-gold">Product Video</h2><div className="mt-6 aspect-video overflow-hidden rounded-2xl"><VideoPlayer url={p.video_url} title={p.title} autoPlay={false} /></div></>)}
          </div>
          <div className="card h-fit p-6">
            <h3 className="text-xl font-bold">Enquire about this product</h3>
            <p className="mb-5 mt-1 text-sm text-gray-500">Get price, specifications and delivery details.</p>
            <EnquiryForm product={p.title} source="product-detail" compact />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-[#f7f9f7]">
          <div className="container-x py-14">
            <h2 className="text-2xl font-bold underline-gold">Related Products</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  )
}
