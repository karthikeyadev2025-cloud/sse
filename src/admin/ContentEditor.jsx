import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Save, Loader2, RotateCcw, ExternalLink, Info } from 'lucide-react'
import { saveContent } from '../lib/api'
import { useSite } from '../lib/ContentContext'
import { useToast } from '../components/Toast'
import { defaultContent } from '../data/defaults'
import { CONTENT_SCHEMAS } from './schemas'
import { FieldInput, FieldRow } from './Fields'
import { PageTitle } from './AdminApp'
import { siteHref } from '../lib/utils'

const PAGE_URL = { home: '/', about: '/about', products_page: '/products', projects_page: '/projects', industries_page: '/industries', services_page: '/services', gallery_page: '/gallery', clients_page: '/clients', team_page: '/team', contact_page: '/contact', common: '/', settings: '/' }

export default function ContentEditor() {
  const { key } = useParams()
  const schema = CONTENT_SCHEMAS[key]
  const { content, refresh } = useSite()
  const toast = useToast()
  const [v, setV] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => { setV(JSON.parse(JSON.stringify(content[key] || {}))); setDirty(false) }, [key]) // eslint-disable-line
  useEffect(() => {
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])

  const save = async () => {
    setBusy(true)
    try { await saveContent(key, v); await refresh(); setDirty(false); toast('Changes published') } catch (e) { toast(e.message || 'Save failed', 'error') }
    setBusy(false)
  }
  useEffect(() => {
    const k = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save() } }
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  })

  if (!schema) return <Navigate to="/admin" replace />
  if (!v) return null
  const set = (name, val) => { setV((o) => ({ ...o, [name]: val })); setDirty(true) }
  const reset = () => { if (confirm('Restore the original default content for this page? (You still need to click Save.)')) { setV(JSON.parse(JSON.stringify(defaultContent[key]))); setDirty(true) } }

  return (
    <>
      <PageTitle title={schema.label} sub="Edit text & images, then click Save to publish.">
        <a href={siteHref(PAGE_URL[key])} target="_blank" rel="noreferrer" className="btn btn-sm border bg-white"><ExternalLink className="h-4 w-4" /> Preview</a>
        <button onClick={reset} className="btn btn-sm border bg-white"><RotateCcw className="h-4 w-4" /> Defaults</button>
        <button onClick={save} disabled={busy} className="btn-green btn-sm">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes</button>
      </PageTitle>
      {schema.note && <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800"><Info className="h-4 w-4 shrink-0" />{schema.note}</div>}
      <div className="space-y-5">
        {schema.sections.map((sec) => (
          <section key={sec.title} className="card p-5">
            <h2 className="mb-4 border-b pb-3 font-bold">{sec.title}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {sec.fields.map((f) => <FieldRow key={f.name} field={f}><FieldInput field={f} value={v[f.name]} values={v} onChange={(val) => set(f.name, val)} /></FieldRow>)}
            </div>
          </section>
        ))}
      </div>
      {dirty && (
        <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-between gap-3 rounded-2xl bg-brand-950 px-5 py-3 text-white shadow-lift">
          <span className="text-sm">You have unsaved changes</span>
          <button onClick={save} disabled={busy} className="btn-gold btn-sm">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save & publish</button>
        </div>
      )}
    </>
  )
}
