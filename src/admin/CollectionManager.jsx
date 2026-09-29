import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams, Navigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Copy, ArrowUp, ArrowDown, X, Loader2, Save, Upload, Eye, EyeOff, GripVertical, ExternalLink, Star } from 'lucide-react'
import { listItems, saveItem, deleteItem, reorderItems } from '../lib/api'
import { useSite } from '../lib/ContentContext'
import { useToast } from '../components/Toast'
import { COLLECTION_SCHEMAS } from './schemas'
import { FieldInput, FieldRow, Switch, useUploader } from './Fields'
import { PageTitle } from './AdminApp'
import { slugify, cx, siteHref } from '../lib/utils'

const PUBLIC_PATH = { products: '/products/', projects: '/projects/', services: '/services/' }

function Editor({ schema, collection, item, ctx, allItems, onClose, onSaved }) {
  const [v, setV] = useState(() => ({ is_active: true, ...item }))
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const set = (k, val) => setV((o) => {
    const n = { ...o, [k]: val }
    // auto-fill slug while creating
    schema.fields.forEach((f) => { if (f.type === 'slug' && f.from === k && !item?.id && (!o[f.name] || o[f.name] === slugify(o[k]))) n[f.name] = slugify(val) })
    return n
  })
  const save = async () => {
    for (const f of schema.fields) {
      const val = v[f.name]
      if (f.required && (val === undefined || val === null || String(val).trim() === '')) return toast(`${f.label} is required`, 'error')
      if (f.type === 'slug') {
        if (!val) v[f.name] = slugify(v[f.from])
        if (allItems.some((x) => x.id !== v.id && x[f.name] === v[f.name])) return toast('This URL slug is already used by another item', 'error')
      }
    }
    setBusy(true)
    try {
      await saveItem(collection, { ...v, sort_order: v.sort_order ?? allItems.length + 1 })
      toast(`${schema.singular} saved`)
      onSaved()
    } catch (e) { toast(e.message || 'Save failed', 'error') }
    setBusy(false)
  }
  useEffect(() => {
    const k = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save() } }
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  })
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl animate-fadeUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-bold">{item?.id ? `Edit ${schema.singular}` : `New ${schema.singular}`}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {schema.fields.map((f) => (
              <FieldRow key={f.name} field={f}>
                <FieldInput field={f} value={v[f.name]} values={v} onChange={(val) => set(f.name, val)} ctx={ctx} />
              </FieldRow>
            ))}
            <div className="sm:col-span-2 flex items-center justify-between rounded-xl border bg-gray-50/60 px-4 py-3">
              <span className="text-sm font-medium text-gray-700">Visible on website</span>
              <Switch checked={v.is_active !== false} onChange={(val) => set('is_active', val)} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t bg-gray-50 px-5 py-3">
          <span className="mr-auto hidden text-xs text-gray-400 sm:block">Tip: Ctrl + S to save</span>
          <button onClick={onClose} className="btn border bg-white">Cancel</button>
          <button onClick={save} disabled={busy} className="btn-green">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save</button>
        </div>
      </div>
    </div>
  )
}

export default function CollectionManager() {
  const { collection } = useParams()
  const schema = COLLECTION_SCHEMAS[collection]
  const [params, setParams] = useSearchParams()
  const { refresh } = useSite()
  const toast = useToast()
  const [list, setList] = useState(null)
  const [ctx, setCtx] = useState({})
  const [edit, setEdit] = useState(null)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [dragId, setDragId] = useState(null)
  const bulkRef = useRef()
  const { upload, busy: uploading } = useUploader()

  const load = async () => {
    try {
      setList(await listItems(collection))
      const deps = [...new Set(schema.fields.filter((f) => f.optionsFrom).map((f) => f.optionsFrom))]
      const c = {}
      for (const d of deps) c[d] = await listItems(d)
      setCtx(c)
    } catch (e) { toast(e.message, 'error'); setList([]) }
  }
  useEffect(() => { if (schema) { setList(null); setQ(''); setCat('all'); load() } }, [collection])
  useEffect(() => { if (params.get('new') && list) { setEdit({}); params.delete('new'); setParams(params, { replace: true }) } }, [params, list])

  const filtered = useMemo(() => {
    let l = list || []
    if (cat !== 'all') l = l.filter((x) => x.category === cat)
    const t = q.trim().toLowerCase()
    if (t) l = l.filter((x) => JSON.stringify(x).toLowerCase().includes(t))
    return l
  }, [list, q, cat])

  if (!schema) return <Navigate to="/admin" replace />
  const catList = schema.categoryCollection ? ctx[schema.categoryCollection] || [] : []
  const catName = (slug) => catList.find((c) => c.slug === slug)?.name || slug

  const after = async () => { await load(); refresh() }
  const remove = async (it) => {
    if (!confirm(`Delete "${it[schema.titleField] || 'this item'}"? This cannot be undone.`)) return
    try { await deleteItem(collection, it.id); toast('Deleted'); after() } catch (e) { toast(e.message, 'error') }
  }
  const toggle = async (it) => { try { await saveItem(collection, { ...it, is_active: it.is_active === false }); after() } catch (e) { toast(e.message, 'error') } }
  const toggleFeatured = async (it) => { try { await saveItem(collection, { ...it, featured: !it.featured }); after() } catch (e) { toast(e.message, 'error') } }
  const duplicate = (it) => {
    const { id, created_at, ...rest } = it
    const copy = { ...rest, [schema.titleField]: `${it[schema.titleField]} (copy)` }
    schema.fields.filter((f) => f.type === 'slug').forEach((f) => (copy[f.name] = `${it[f.name]}-copy`))
    setEdit(copy)
  }
  const reorder = async (ids) => {
    const map = Object.fromEntries((list || []).map((x) => [x.id, x]))
    setList(ids.map((id, i) => ({ ...map[id], sort_order: i + 1 })))
    try { await reorderItems(collection, ids); refresh() } catch (e) { toast(e.message, 'error'); load() }
  }
  const move = (idx, d) => {
    const ids = list.map((x) => x.id)
    const j = idx + d
    if (j < 0 || j >= ids.length) return
    ;[ids[idx], ids[j]] = [ids[j], ids[idx]]
    reorder(ids)
  }
  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) return
    const ids = list.map((x) => x.id).filter((id) => id !== dragId)
    ids.splice(ids.indexOf(targetId), 0, dragId)
    setDragId(null)
    reorder(ids)
  }
  const bulk = async (files) => {
    const urls = await upload([...files])
    let n = list.length
    for (const u of urls) {
      await saveItem(collection, { image: u, title: '', category: cat !== 'all' ? cat : '', sort_order: ++n, is_active: true })
    }
    if (urls.length) { toast(`${urls.length} photo(s) added`); after() }
  }
  const canReorder = !q && cat === 'all'
  const hasFeatured = schema.fields.some((f) => f.name === 'featured')

  return (
    <>
      <PageTitle title={schema.label} sub={`${list?.length ?? '…'} items · drag to reorder · changes go live instantly`}>
        {schema.bulkUpload && (
          <>
            <button onClick={() => bulkRef.current.click()} disabled={uploading} className="btn btn-sm border bg-white">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Bulk upload photos</button>
            <input ref={bulkRef} type="file" multiple accept="image/*" hidden onChange={(e) => { bulk(e.target.files); e.target.value = '' }} />
          </>
        )}
        <button onClick={() => setEdit({})} className="btn-gold btn-sm"><Plus className="h-4 w-4" /> Add {schema.singular}</button>
      </PageTitle>

      {schema.note && <div className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{schema.note}</div>}
      <div className="card mb-4 flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input className="input pl-9" placeholder={`Search ${schema.label.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {catList.length > 0 && (
          <select className="input sm:w-60" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">All categories</option>
            {catList.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        )}
      </div>

      {!list ? <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-brand-700" /></div> : schema.grid ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((it) => (
            <div key={it.id} draggable={canReorder} onDragStart={() => setDragId(it.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(it.id)}
              className={cx('card group overflow-hidden', it.is_active === false && 'opacity-50', dragId === it.id && 'ring-2 ring-gold-400')}>
              <div className={cx('relative bg-gray-100', collection === 'team' ? 'aspect-[4/5]' : 'aspect-[4/3]')}>
                {it[schema.imageField] ? <img src={it[schema.imageField]} alt="" className="h-full w-full object-cover object-top" /> : <div className="grid h-full place-items-center text-3xl font-bold text-gray-300">{String(it[schema.titleField] || '?')[0]}</div>}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => setEdit(it)} className="rounded-lg bg-white p-2"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => toggle(it)} className="rounded-lg bg-white p-2">{it.is_active === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                  <button onClick={() => remove(it)} className="rounded-lg bg-white p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="px-3 py-2"><p className="truncate text-sm font-semibold">{it[schema.titleField] || <span className="text-gray-400">No caption</span>}</p><p className="truncate text-xs text-gray-500">{(schema.subField === 'category' ? catName(it.category) : it[schema.subField]) || '—'}{it.is_active === false && ' · Hidden'}</p></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card divide-y overflow-hidden">
          {filtered.map((it, idx) => (
            <div key={it.id} draggable={canReorder} onDragStart={() => setDragId(it.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(it.id)}
              className={cx('flex items-center gap-3 px-3 py-3 sm:px-4', it.is_active === false && 'bg-gray-50 opacity-60', dragId === it.id && 'bg-gold-50')}>
              {canReorder && <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-gray-300 sm:block" />}
              {schema.imageField && (it[schema.imageField] ? <img src={it[schema.imageField]} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" /> : <div className="h-12 w-16 shrink-0 rounded-lg bg-gray-100" />)}
              <button onClick={() => setEdit(it)} className="min-w-0 flex-1 text-left">
                <p className="truncate font-semibold">{it[schema.titleField]} {it.featured && <Star className="ml-1 inline h-3.5 w-3.5 fill-gold-400 text-gold-400" />}</p>
                <p className="truncate text-xs text-gray-500">{schema.subField === 'category' ? catName(it.category) : it[schema.subField]}</p>
              </button>
              {it.submitted && it.is_active === false
                ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pending approval</span>
                : <span className={cx('hidden rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline', it.is_active === false ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700')}>{it.is_active === false ? 'Hidden' : 'Live'}</span>}
              <div className="flex shrink-0 items-center">
                {canReorder && <><button onClick={() => move(idx, -1)} className="rounded p-1.5 hover:bg-gray-100" title="Move up"><ArrowUp className="h-4 w-4" /></button><button onClick={() => move(idx, 1)} className="rounded p-1.5 hover:bg-gray-100" title="Move down"><ArrowDown className="h-4 w-4" /></button></>}
                {hasFeatured && <button onClick={() => toggleFeatured(it)} className="hidden rounded p-1.5 hover:bg-gray-100 sm:block" title="Toggle featured"><Star className={cx('h-4 w-4', it.featured ? 'fill-gold-400 text-gold-400' : 'text-gray-400')} /></button>}
                <button onClick={() => toggle(it)} className="rounded p-1.5 hover:bg-gray-100" title={it.is_active === false ? 'Show' : 'Hide'}>{it.is_active === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                {PUBLIC_PATH[collection] && it.slug && <a href={siteHref(PUBLIC_PATH[collection] + it.slug)} target="_blank" rel="noreferrer" className="hidden rounded p-1.5 hover:bg-gray-100 sm:block" title="View"><ExternalLink className="h-4 w-4" /></a>}
                <button onClick={() => duplicate(it)} className="hidden rounded p-1.5 hover:bg-gray-100 sm:block" title="Duplicate"><Copy className="h-4 w-4" /></button>
                <button onClick={() => setEdit(it)} className="rounded p-1.5 text-brand-700 hover:bg-brand-50" title="Edit"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(it)} className="rounded p-1.5 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {!filtered.length && <p className="px-4 py-16 text-center text-sm text-gray-500">Nothing here yet. Click “Add {schema.singular}”.</p>}
        </div>
      )}

      {edit && <Editor schema={schema} collection={collection} item={edit} ctx={ctx} allItems={list || []} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); after() }} />}
    </>
  )
}
