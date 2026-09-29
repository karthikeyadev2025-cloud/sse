import { useEffect, useMemo, useState } from 'react'
import { Search, Download, MessageCircle, Phone, Mail, Trash2, X, Loader2, RefreshCw, Inbox } from 'lucide-react'
import { listEnquiries, updateEnquiry, deleteEnquiry } from '../lib/api'
import { PageTitle } from './AdminApp'
import { ENQUIRY_STATUSES } from './schemas'
import { useToast } from '../components/Toast'
import { fmtDate, waLink, telLink, toWaNumber, cx } from '../lib/utils'
import { useSettings } from '../lib/ContentContext'

const Badge = ({ status }) => {
  const s = ENQUIRY_STATUSES.find((x) => x.value === status) || ENQUIRY_STATUSES[0]
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>{s.label}</span>
}

export default function Enquiries() {
  const [list, setList] = useState(null)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [sel, setSel] = useState(null)
  const toast = useToast()
  const settings = useSettings()

  const load = () => listEnquiries().then(setList).catch((e) => { toast(e.message, 'error'); setList([]) })
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let l = list || []
    if (status !== 'all') l = l.filter((e) => (e.status || 'new') === status)
    const t = q.trim().toLowerCase()
    if (t) l = l.filter((e) => [e.name, e.phone, e.email, e.company, e.product, e.message, e.enquiry_type].join(' ').toLowerCase().includes(t))
    return l
  }, [list, q, status])

  const patch = async (id, p) => {
    try { await updateEnquiry(id, p); setList((l) => l.map((e) => (e.id === id ? { ...e, ...p } : e))); setSel((s) => (s && s.id === id ? { ...s, ...p } : s)) } catch (e) { toast(e.message, 'error') }
  }
  const remove = async (id) => {
    if (!confirm('Delete this enquiry permanently?')) return
    try { await deleteEnquiry(id); setList((l) => l.filter((e) => e.id !== id)); setSel(null); toast('Enquiry deleted') } catch (e) { toast(e.message, 'error') }
  }
  const exportCsv = () => {
    const cols = ['created_at', 'name', 'company', 'phone', 'email', 'enquiry_type', 'product', 'message', 'status', 'notes', 'source', 'page_url']
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [cols.join(','), ...filtered.map((e) => cols.map((c) => esc(e[c])).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }))
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }
  const counts = (v) => (list || []).filter((e) => (e.status || 'new') === v).length

  return (
    <>
      <PageTitle title="Enquiries" sub="All form submissions from the website (contact form, quote popup, product enquiries).">
        <button onClick={load} className="btn btn-sm border bg-white"><RefreshCw className="h-4 w-4" /> Refresh</button>
        <button onClick={exportCsv} className="btn-green btn-sm"><Download className="h-4 w-4" /> Export CSV</button>
      </PageTitle>
      <div className="card mb-4 flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input className="input pl-9" placeholder="Search name, phone, product…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          <button onClick={() => setStatus('all')} className={cx('rounded-lg px-3 py-2 text-xs font-bold', status === 'all' ? 'bg-brand-800 text-white' : 'bg-gray-100')}>All ({list?.length || 0})</button>
          {ENQUIRY_STATUSES.map((s) => <button key={s.value} onClick={() => setStatus(s.value)} className={cx('whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold', status === s.value ? 'bg-brand-800 text-white' : 'bg-gray-100')}>{s.label} ({counts(s.value)})</button>)}
        </div>
      </div>

      {!list ? <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-brand-700" /></div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Enquiry</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((e) => (
                  <tr key={e.id} onClick={() => setSel(e)} className={cx('cursor-pointer hover:bg-brand-50/40', e.status === 'new' && 'bg-blue-50/30 font-medium')}>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">{fmtDate(e.created_at)}</td>
                    <td className="px-4 py-3"><p className="font-semibold">{e.name}</p><p className="text-xs text-gray-500">{e.company}</p></td>
                    <td className="px-4 py-3"><p>{e.phone}</p><p className="text-xs text-gray-500">{e.email}</p></td>
                    <td className="max-w-[260px] px-4 py-3"><p className="truncate">{e.product || e.enquiry_type}</p><p className="truncate text-xs text-gray-500">{e.message}</p></td>
                    <td className="px-4 py-3"><Badge status={e.status} /></td>
                    <td className="px-4 py-3" onClick={(ev) => ev.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <a href={waLink(toWaNumber(e.phone), `Hello ${e.name}, thank you for contacting ${settings.company_name}.`)} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-[#128C4B] hover:bg-green-50" title="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
                        <a href={telLink(e.phone)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50" title="Call"><Phone className="h-4 w-4" /></a>
                        <button onClick={() => remove(e.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <div className="py-16 text-center text-sm text-gray-500"><Inbox className="mx-auto mb-2 h-8 w-8 text-gray-300" />No enquiries found.</div>}
          </div>
        </div>
      )}

      {sel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSel(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl animate-fadeUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-5 py-4"><h3 className="font-bold">Enquiry details</h3><button onClick={() => setSel(null)} className="rounded-lg p-1.5 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
            <div className="space-y-5 p-5">
              <div>
                <p className="text-xl font-bold">{sel.name}</p>
                {sel.company && <p className="text-sm text-gray-500">{sel.company}</p>}
                <p className="mt-1 text-xs text-gray-400">{fmtDate(sel.created_at)} · via {sel.source}{sel.page_url && ` (${sel.page_url})`}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <a href={waLink(toWaNumber(sel.phone), `Hello ${sel.name}, thank you for contacting ${settings.company_name}.`)} target="_blank" rel="noreferrer" className="btn-wa btn-sm"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                <a href={telLink(sel.phone)} className="btn-green btn-sm"><Phone className="h-4 w-4" /> Call</a>
                {sel.email ? <a href={`mailto:${sel.email}?subject=${encodeURIComponent('Re: Your enquiry – ' + settings.company_name)}`} className="btn btn-sm border"><Mail className="h-4 w-4" /> Email</a> : <span />}
              </div>
              <dl className="space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
                {[['Phone', sel.phone], ['Email', sel.email], ['Type', sel.enquiry_type], ['Product', sel.product]].filter((r) => r[1]).map(([k, v]) => <div key={k} className="flex gap-3"><dt className="w-20 shrink-0 text-gray-500">{k}</dt><dd className="font-medium">{v}</dd></div>)}
              </dl>
              <div><p className="label">Message</p><p className="whitespace-pre-line rounded-xl border p-4 text-sm leading-relaxed">{sel.message}</p></div>
              <div>
                <p className="label">Status</p>
                <div className="flex flex-wrap gap-2">{ENQUIRY_STATUSES.map((s) => <button key={s.value} onClick={() => patch(sel.id, { status: s.value })} className={cx('rounded-lg border px-3 py-1.5 text-xs font-bold', (sel.status || 'new') === s.value ? 'border-brand-800 bg-brand-800 text-white' : 'bg-white')}>{s.label}</button>)}</div>
              </div>
              <div>
                <p className="label">Internal notes</p>
                <textarea className="input" rows={4} defaultValue={sel.notes || ''} onBlur={(e) => e.target.value !== (sel.notes || '') && patch(sel.id, { notes: e.target.value }).then(() => toast('Notes saved'))} placeholder="Follow-up notes, quotation details…" />
              </div>
              <button onClick={() => remove(sel.id)} className="btn btn-sm w-full border border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete enquiry</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
