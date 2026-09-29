import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Package, FolderKanban, Images, Wrench, Factory, ArrowRight, Sparkles, MessageCircle, Phone, Database } from 'lucide-react'
import { listEnquiries, listItems, isSupabase } from '../lib/api'
import { useSite } from '../lib/ContentContext'
import { PageTitle, useAdmin } from './AdminApp'
import { ENQUIRY_STATUSES } from './schemas'
import { fmtDate, waLink, telLink, toWaNumber } from '../lib/utils'

export default function Dashboard() {
  const { collections } = useSite()
  const { admin } = useAdmin()
  const [enq, setEnq] = useState(null)
  const [pending, setPending] = useState(0)
  useEffect(() => {
    listEnquiries().then(setEnq).catch(() => setEnq([]))
    listItems('testimonials').then((l) => setPending(l.filter((t) => t.submitted && t.is_active === false).length)).catch(() => {})
  }, [])
  const week = Date.now() - 7 * 864e5
  const stats = [
    { label: 'New enquiries', value: enq ? enq.filter((e) => e.status === 'new').length : '…', icon: Inbox, to: '/admin/enquiries', hi: true },
    { label: 'Enquiries this week', value: enq ? enq.filter((e) => new Date(e.created_at) > week).length : '…', icon: Sparkles, to: '/admin/enquiries' },
    { label: 'Products', value: collections.products.length, icon: Package, to: '/admin/c/products' },
    { label: 'Projects', value: collections.projects.length, icon: FolderKanban, to: '/admin/c/projects' },
    { label: 'Gallery photos', value: collections.gallery.length, icon: Images, to: '/admin/c/gallery' },
    { label: 'Services', value: collections.services.length, icon: Wrench, to: '/admin/c/services' },
    { label: 'Clients', value: collections.clients.length, icon: Factory, to: '/admin/c/clients' },
    { label: 'Total enquiries', value: enq ? enq.length : '…', icon: Inbox, to: '/admin/enquiries' },
  ]
  const st = (v) => ENQUIRY_STATUSES.find((s) => s.value === v) || ENQUIRY_STATUSES[0]
  return (
    <>
      <PageTitle title="Dashboard" sub={`Welcome back, ${admin.email}`} />
      {!isSupabase && (
        <div className="mb-6 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <Database className="h-6 w-6 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-900">
            <p className="font-bold">You are in Demo mode</p>
            <p className="mt-1">All admin features work, but changes are stored only in this browser. To make changes live for all visitors, create a free Supabase project, run <code>supabase/schema.sql</code>, and add the keys to <code>.env</code> — see README.md.</p>
          </div>
        </div>
      )}
      {pending > 0 && <Link to="/admin/c/testimonials" className="mb-6 flex items-center justify-between rounded-2xl bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">{pending} new client testimonial{pending > 1 ? 's' : ''} waiting for your approval <ArrowRight className="h-4 w-4" /></Link>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className={`card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lift ${s.hi ? 'bg-brand-900 text-white' : ''}`}>
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.hi ? 'bg-gold-400 text-ink' : 'bg-brand-50 text-brand-700'}`}><s.icon className="h-5 w-5" /></span>
            <span><span className="block font-display text-2xl font-bold">{s.value}</span><span className={`text-xs ${s.hi ? 'text-white/70' : 'text-gray-500'}`}>{s.label}</span></span>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-4"><h2 className="font-bold">Latest enquiries</h2><Link to="/admin/enquiries" className="text-sm font-semibold text-brand-700">View all →</Link></div>
          <ul className="divide-y">
            {(enq || []).slice(0, 6).map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-800 text-sm font-bold text-white">{(e.name || '?')[0].toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{e.name} <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${st(e.status).cls}`}>{st(e.status).label}</span></p>
                  <p className="truncate text-xs text-gray-500">{e.product || e.enquiry_type} · {fmtDate(e.created_at)}</p>
                </div>
                <a href={waLink(toWaNumber(e.phone), `Hello ${e.name}, thank you for your enquiry with S.S.E Industries.`)} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-[#128C4B] hover:bg-green-50"><MessageCircle className="h-4 w-4" /></a>
                <a href={telLink(e.phone)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"><Phone className="h-4 w-4" /></a>
              </li>
            ))}
            {enq && !enq.length && <li className="px-5 py-10 text-center text-sm text-gray-500">No enquiries yet. They will appear here when visitors submit forms.</li>}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Quick actions</h2>
          <div className="mt-4 space-y-2">
            {[['Add a product', '/admin/c/products?new=1'], ['Upload gallery photos', '/admin/c/gallery'], ['Add a project', '/admin/c/projects?new=1'], ['Edit home page', '/admin/content/home'], ['Change hero slides', '/admin/c/hero_slides'], ['Update phone / WhatsApp', '/admin/content/settings']].map(([l, to]) => (
              <Link key={l} to={to} className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium hover:border-brand-500 hover:bg-brand-50">{l}<ArrowRight className="h-4 w-4 text-gray-400" /></Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
