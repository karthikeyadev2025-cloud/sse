import { useEffect, useRef, useState } from 'react'
import { Upload, Copy, Trash2, Loader2, UserPlus, Download, RotateCcw, ShieldCheck, FileJson, Database } from 'lucide-react'
import { listMedia, deleteMedia, listAdmins, addAdmin, removeAdmin, exportBackup, importBackup, resetDemo, updatePassword, isSupabase } from '../lib/api'
import { useSite } from '../lib/ContentContext'
import { useToast } from '../components/Toast'
import { useUploader } from './Fields'
import { PageTitle, useAdmin } from './AdminApp'
import { fmtDate } from '../lib/utils'

export function MediaLibrary() {
  const [list, setList] = useState(null)
  const ref = useRef()
  const toast = useToast()
  const { upload, busy } = useUploader()
  const load = () => listMedia().then(setList).catch((e) => { toast(e.message, 'error'); setList([]) })
  useEffect(() => { load() }, [])
  const add = async (files) => { const u = await upload([...files]); if (u.length) { toast(`${u.length} file(s) uploaded`); load() } }
  const copy = (u) => { navigator.clipboard?.writeText(u); toast('Link copied') }
  const del = async (m) => { if (!confirm('Delete this file? Pages using it will show a broken image.')) return; try { await deleteMedia(m.path); load() } catch (e) { toast(e.message, 'error') } }
  if (!isSupabase) return (<><PageTitle title="Media Library" /><div className="card p-10 text-center text-sm text-gray-600"><Database className="mx-auto mb-3 h-8 w-8 text-gray-300" />The media library lists files stored in Supabase Storage. In demo mode images are uploaded directly inside each field.</div></>)
  return (
    <>
      <PageTitle title="Media Library" sub="All uploaded images & files. Images are auto-compressed to WebP.">
        <button onClick={() => ref.current.click()} className="btn-gold btn-sm" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload</button>
        <input ref={ref} type="file" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = '' }} />
      </PageTitle>
      {!list ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((m) => (
            <div key={m.path} className="card group overflow-hidden">
              <div className="aspect-square bg-gray-100">{/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(m.name) ? <img src={m.url} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs font-bold uppercase text-gray-400">{m.name.split('.').pop()}</div>}</div>
              <div className="flex items-center gap-1 p-2">
                <span className="flex-1 truncate text-[11px] text-gray-500">{fmtDate(m.created_at)}</span>
                <button onClick={() => copy(m.url)} className="rounded p-1.5 hover:bg-gray-100" title="Copy link"><Copy className="h-3.5 w-3.5" /></button>
                <button onClick={() => del(m)} className="rounded p-1.5 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
          {!list.length && <p className="col-span-full py-10 text-center text-sm text-gray-500">No files uploaded yet.</p>}
        </div>
      )}
    </>
  )
}

export function AdminUsers() {
  const [list, setList] = useState([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const { admin } = useAdmin()
  const toast = useToast()
  const load = () => listAdmins().then(setList).catch((e) => toast(e.message, 'error'))
  useEffect(() => { load() }, [])
  const add = async (e) => {
    e.preventDefault()
    try { await addAdmin(email, role); setEmail(''); toast('Admin added'); load() } catch (ex) { toast(ex.message, 'error') }
  }
  const del = async (em) => { if (em === admin.email) return toast('You cannot remove yourself', 'error'); if (!confirm(`Remove ${em}?`)) return; try { await removeAdmin(em); load() } catch (e) { toast(e.message, 'error') } }
  return (
    <>
      <PageTitle title="Admin Users" sub="Who can log in to this panel. Super admins can manage users; editors can manage all content." />
      <form onSubmit={add} className="card mb-5 grid gap-3 p-4 sm:grid-cols-[1fr_180px_auto]">
        <input required type="email" className="input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}><option value="editor">Editor</option><option value="super_admin">Super Admin</option></select>
        <button className="btn-green"><UserPlus className="h-4 w-4" /> Add</button>
      </form>
      {isSupabase && <p className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">After adding an email here, create the login in Supabase → Authentication → Users → “Add user” (or send an invite) with the same email.</p>}
      <div className="card divide-y">
        {list.map((a) => (
          <div key={a.email} className="flex items-center gap-3 px-4 py-3">
            <ShieldCheck className={a.role === 'super_admin' ? 'h-5 w-5 text-gold-500' : 'h-5 w-5 text-gray-400'} />
            <span className="flex-1 text-sm font-medium">{a.email}</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold">{a.role === 'super_admin' ? 'Super Admin' : 'Editor'}</span>
            <button onClick={() => del(a.email)} className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </>
  )
}

export function Backup() {
  const ref = useRef()
  const toast = useToast()
  const { refresh } = useSite()
  const [busy, setBusy] = useState(false)
  const exp = async () => {
    const data = await exportBackup()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = `sse-website-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }
  const imp = async (file) => {
    if (!file || !confirm('Restore this backup? All current content will be replaced (enquiries are not affected).')) return
    setBusy(true)
    try { await importBackup(JSON.parse(await file.text())); await refresh(); toast('Backup restored') } catch (e) { toast(e.message, 'error') }
    setBusy(false)
  }
  return (
    <>
      <PageTitle title="Backup & Restore" sub="Download all website content as a file, or restore from a previous backup." />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="card p-6"><Download className="h-8 w-8 text-brand-700" /><h3 className="mt-3 font-bold">Download backup</h3><p className="mt-1 text-sm text-gray-600">All pages, products, projects, gallery and settings as JSON.</p><button onClick={exp} className="btn-green mt-4"><FileJson className="h-4 w-4" /> Download</button></div>
        <div className="card p-6"><Upload className="h-8 w-8 text-brand-700" /><h3 className="mt-3 font-bold">Restore backup</h3><p className="mt-1 text-sm text-gray-600">Upload a backup file downloaded earlier.</p><button onClick={() => ref.current.click()} disabled={busy} className="btn-gold mt-4">{busy && <Loader2 className="h-4 w-4 animate-spin" />}Choose file</button><input ref={ref} type="file" accept="application/json" hidden onChange={(e) => { imp(e.target.files[0]); e.target.value = '' }} /></div>
        {!isSupabase && <div className="card p-6 md:col-span-2"><RotateCcw className="h-8 w-8 text-amber-600" /><h3 className="mt-3 font-bold">Reset demo data</h3><p className="mt-1 text-sm text-gray-600">Clears everything stored in this browser and restores the original content.</p><button onClick={async () => { if (confirm('Reset all demo data?')) { resetDemo(); await refresh(); toast('Demo data reset') } }} className="btn mt-4 border border-amber-300 text-amber-700">Reset</button></div>}
      </div>
    </>
  )
}

export function Account() {
  const { admin } = useAdmin()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const toast = useToast()
  const save = async (e) => {
    e.preventDefault()
    if (pw.length < 8) return toast('Use at least 8 characters', 'error')
    if (pw !== pw2) return toast('Passwords do not match', 'error')
    try { await updatePassword(pw); setPw(''); setPw2(''); toast('Password changed') } catch (ex) { toast(ex.message, 'error') }
  }
  return (
    <>
      <PageTitle title="My Account" sub={admin.email} />
      <form onSubmit={save} className="card max-w-md space-y-4 p-6">
        <h3 className="font-bold">Change password</h3>
        <input type="password" className="input" placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <input type="password" className="input" placeholder="Confirm new password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        <button className="btn-green">Update password</button>
      </form>
    </>
  )
}
