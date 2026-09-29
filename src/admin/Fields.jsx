import { useRef, useState } from 'react'
import { Upload, X, Loader2, Link2, Plus, Trash2, ArrowUp, ArrowDown, FileText, GripVertical, ImagePlus, Film } from 'lucide-react'
import Icon, { ICONS } from '../components/Icon'
import { uploadFile } from '../lib/api'
import { useToast } from '../components/Toast'
import { slugify, cx, isVideoFile } from '../lib/utils'

export function Switch({ checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <button type="button" onClick={() => onChange(!checked)} className={cx('relative h-6 w-11 rounded-full transition', checked ? 'bg-brand-600' : 'bg-gray-300')}>
        <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
  )
}

export function useUploader() {
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const upload = async (files) => {
    setBusy(true)
    const out = []
    try {
      for (const f of files) {
        const max = f.type.startsWith('video/') ? 50 : 20
        if (f.size > max * 1024 * 1024) { toast(`${f.name} is larger than ${max} MB. Compress it or upload to YouTube and paste the link.`, 'error'); continue }
        out.push(await uploadFile(f))
      }
    } catch (e) { toast(e.message || 'Upload failed', 'error') }
    setBusy(false)
    return out
  }
  return { upload, busy }
}

export function ImageField({ value, onChange, accept = 'image/*', file = false }) {
  const ref = useRef()
  const { upload, busy } = useUploader()
  const [url, setUrl] = useState(false)
  const [drag, setDrag] = useState(false)
  const handle = async (files) => { const [u] = await upload([...files].slice(0, 1)); if (u) onChange(u) }
  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files) }}
        className={cx('flex items-center gap-4 rounded-xl border-2 border-dashed p-3 transition', drag ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-gray-50/60')}>
        <div className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-gray-200">
          {value ? (file ? <FileText className="h-8 w-8 text-brand-700" /> : <img src={value} alt="" className="h-full w-full object-cover" />) : <ImagePlus className="h-7 w-7 text-gray-300" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => ref.current.click()} className="btn-green btn-sm" disabled={busy}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} {value ? 'Replace' : 'Upload'}
            </button>
            <button type="button" onClick={() => setUrl(!url)} className="btn btn-sm border bg-white"><Link2 className="h-3.5 w-3.5" /> URL</button>
            {value && <button type="button" onClick={() => onChange('')} className="btn btn-sm border bg-white text-red-600"><X className="h-3.5 w-3.5" /> Remove</button>}
          </div>
          {url && <input className="input" placeholder="https://…" value={value || ''} onChange={(e) => onChange(e.target.value)} />}
          <p className="truncate text-[11px] text-gray-400">{value && !value.startsWith('data:') ? value : 'Drag & drop or click Upload · auto-optimized'}</p>
        </div>
        <input ref={ref} type="file" accept={accept} hidden onChange={(e) => { handle(e.target.files); e.target.value = '' }} />
      </div>
    </div>
  )
}

export function VideoField({ value, onChange, uploadOnly = false }) {
  const ref = useRef()
  const { upload, busy } = useUploader()
  const handle = async (files) => { const [u] = await upload([...files].slice(0, 1)); if (u) onChange(u) }
  const file = isVideoFile(value)
  return (
    <div className="space-y-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-3" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files) }}>
      {value && file && <video src={value} controls className="aspect-video w-full max-w-md rounded-lg bg-black" />}
      {value && !file && <p className="flex items-center gap-2 text-sm text-gray-700"><Film className="h-4 w-4 text-red-600" /> YouTube video linked</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => ref.current.click()} className="btn-green btn-sm" disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} {busy ? 'Uploading video…' : value ? 'Replace video' : 'Upload video (MP4)'}
        </button>
        {value && <button type="button" onClick={() => onChange('')} className="btn btn-sm border bg-white text-red-600"><X className="h-3.5 w-3.5" /> Remove</button>}
      </div>
      {!uploadOnly && <input className="input" placeholder="…or paste a YouTube link (https://youtu.be/…)" value={value && !value.startsWith('data:') && !file ? value : ''} onChange={(e) => onChange(e.target.value)} />}
      <p className="text-[11px] text-gray-400">MP4 up to 50 MB. For longer videos, upload to YouTube and paste the link.</p>
      <input ref={ref} type="file" accept="video/mp4,video/webm,video/quicktime" hidden onChange={(e) => { handle(e.target.files); e.target.value = '' }} />
    </div>
  )
}

export function ImagesField({ value = [], onChange }) {
  const ref = useRef()
  const { upload, busy } = useUploader()
  const list = Array.isArray(value) ? value : []
  const add = async (files) => { const urls = await upload([...files]); if (urls.length) onChange([...list, ...urls]) }
  const move = (i, d) => { const l = [...list]; const j = i + d; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; onChange(l) }
  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {list.map((u, i) => (
          <div key={u + i} className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-gray-200">
            <img src={u} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="rounded bg-white/90 p-1"><ArrowUp className="h-3 w-3 -rotate-90" /></button>
                <button type="button" onClick={() => move(i, 1)} className="rounded bg-white/90 p-1"><ArrowDown className="h-3 w-3 -rotate-90" /></button>
              </div>
              <button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} className="rounded bg-red-600 p-1 text-white"><Trash2 className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => ref.current.click()} disabled={busy} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files) }}
          className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-brand-500 hover:text-brand-700">
          {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <span className="text-center text-xs font-semibold"><Plus className="mx-auto h-6 w-6" />Add images</span>}
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = '' }} />
    </div>
  )
}

export function ListField({ value = [], onChange, placeholder = 'Add item…' }) {
  const list = Array.isArray(value) ? value : []
  const [v, setV] = useState('')
  const add = () => { if (v.trim()) { onChange([...list, v.trim()]); setV('') } }
  return (
    <div className="space-y-2">
      {list.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input className="input" value={it} onChange={(e) => onChange(list.map((x, k) => (k === i ? e.target.value : x)))} />
          <button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} className="rounded-lg border px-3 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <div className="flex gap-2">
        <input className="input" value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
        <button type="button" onClick={add} className="btn-green btn-sm"><Plus className="h-4 w-4" /> Add</button>
      </div>
    </div>
  )
}

export function SpecsField({ value = [], onChange }) {
  const list = Array.isArray(value) ? value : []
  const upd = (i, k, v) => onChange(list.map((r, j) => (j === i ? { ...r, [k]: v } : r)))
  return (
    <div className="space-y-2">
      {list.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input className="input w-2/5" placeholder="Label" value={r.label || ''} onChange={(e) => upd(i, 'label', e.target.value)} />
          <input className="input" placeholder="Value" value={r.value || ''} onChange={(e) => upd(i, 'value', e.target.value)} />
          <button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} className="rounded-lg border px-3 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, { label: '', value: '' }])} className="btn btn-sm border bg-white"><Plus className="h-4 w-4" /> Add row</button>
    </div>
  )
}

export function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="input flex items-center gap-2 text-left">
        <Icon name={value} className="h-4 w-4 text-brand-700" /><span className="flex-1 truncate">{value || 'Choose icon'}</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 grid max-h-60 w-72 grid-cols-6 gap-1 overflow-y-auto rounded-xl border bg-white p-2 shadow-xl">
          {ICONS.map((n) => (
            <button type="button" key={n} title={n} onClick={() => { onChange(n); setOpen(false) }} className={cx('grid h-10 place-items-center rounded-lg hover:bg-brand-50', value === n && 'bg-brand-100')}>
              <Icon name={n} className="h-5 w-5" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function RepeaterField({ value = [], onChange, fields, ctx }) {
  const list = Array.isArray(value) ? value : []
  const upd = (i, k, v) => onChange(list.map((r, j) => (j === i ? { ...r, [k]: v } : r)))
  const move = (i, d) => { const l = [...list]; const j = i + d; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; onChange(l) }
  return (
    <div className="space-y-2">
      {list.map((row, i) => (
        <div key={i} className="flex items-start gap-2 rounded-xl border bg-gray-50/60 p-3">
          <GripVertical className="mt-2.5 h-4 w-4 shrink-0 text-gray-300" />
          <div className={cx('grid flex-1 gap-2', fields.length >= 3 ? 'sm:grid-cols-[160px_1fr_1.4fr]' : 'sm:grid-cols-[180px_1fr]')}>
            {fields.map((f) => <div key={f.name}><FieldInput field={f} value={row[f.name]} onChange={(v) => upd(i, f.name, v)} ctx={ctx} compact /></div>)}
          </div>
          <div className="flex flex-col gap-1">
            <button type="button" onClick={() => move(i, -1)} className="rounded border bg-white p-1"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => move(i, 1)} className="rounded border bg-white p-1"><ArrowDown className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} className="rounded border bg-white p-1 text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, {}])} className="btn btn-sm border bg-white"><Plus className="h-4 w-4" /> Add item</button>
    </div>
  )
}

export function FieldInput({ field: f, value, onChange, ctx = {}, compact = false, values = {} }) {
  switch (f.type) {
    case 'textarea': return <textarea className="input resize-y" rows={f.rows || 4} value={value || ''} placeholder={compact ? f.label : ''} onChange={(e) => onChange(e.target.value)} />
    case 'number': return <input type="number" className="input" min={f.min} max={f.max} value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
    case 'switch': return <Switch checked={!!value} onChange={onChange} label={compact ? '' : undefined} />
    case 'image': return <ImageField value={value} onChange={onChange} />
    case 'file': return <ImageField value={value} onChange={onChange} accept={f.accept} file />
    case 'images': return <ImagesField value={value} onChange={onChange} />
    case 'video': return <VideoField value={value} onChange={onChange} uploadOnly={f.uploadOnly} />
    case 'list': return <ListField value={value} onChange={onChange} />
    case 'specs': return <SpecsField value={value} onChange={onChange} />
    case 'icon': return <IconPicker value={value} onChange={onChange} />
    case 'repeater': return <RepeaterField value={value} onChange={onChange} fields={f.fields} ctx={ctx} />
    case 'select': {
      const opts = f.optionsFrom ? (ctx[f.optionsFrom] || []).map((c) => ({ value: c.slug, label: c.name })) : (f.options || []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
      return (
        <select className="input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">— Select —</option>
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    }
    case 'slug': return (
      <div className="flex gap-2">
        <input className="input font-mono text-xs" value={value || ''} onChange={(e) => onChange(slugify(e.target.value))} />
        <button type="button" onClick={() => onChange(slugify(values[f.from]))} className="btn btn-sm border bg-white whitespace-nowrap">Auto</button>
      </div>
    )
    default: return <input className="input" value={value || ''} placeholder={compact ? f.label : ''} onChange={(e) => onChange(e.target.value)} />
  }
}

export function FieldRow({ field, children }) {
  return (
    <div className={field.half ? '' : 'sm:col-span-2'}>
      {field.type !== 'switch' ? <label className="label">{field.label}{field.required && <span className="text-red-500"> *</span>}</label> : null}
      {field.type === 'switch' ? <div className="flex items-center justify-between rounded-xl border bg-gray-50/60 px-4 py-3"><span className="text-sm font-medium text-gray-700">{field.label}</span>{children}</div> : children}
      {field.hint && <p className="mt-1 text-[11px] text-gray-400">{field.hint}</p>}
    </div>
  )
}
