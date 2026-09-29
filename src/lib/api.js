// Data layer: one API, two backends.
//  • Supabase (production) — when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set.
//  • Demo mode — everything stored in this browser's localStorage (for local preview).
import { createClient } from '@supabase/supabase-js'
import { defaultContent, defaultCollections } from '../data/defaults'

const URL_ = import.meta.env.VITE_SUPABASE_URL
const KEY_ = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabase = Boolean(URL_ && KEY_)
export const supabase = isSupabase ? createClient(URL_, KEY_) : null
export const BUCKET = 'media'

const clone = (o) => JSON.parse(JSON.stringify(o))
const META = ['id', 'sort_order', 'is_active', 'created_at', 'updated_at', 'collection']
const rowToItem = (r) => ({ ...(r.data || {}), id: r.id, sort_order: r.sort_order, is_active: r.is_active, created_at: r.created_at })
const itemToRow = (collection, item) => {
  const data = {}
  Object.keys(item).forEach((k) => { if (!META.includes(k)) data[k] = item[k] })
  return { collection, data, sort_order: Number(item.sort_order) || 0, is_active: item.is_active !== false }
}
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36))

/* ---------------- demo (localStorage) store ---------------- */
const LS = 'sse_cms_demo_v1'
function demoDb() {
  let db = null
  try { db = JSON.parse(localStorage.getItem(LS) || 'null') } catch { db = null }
  if (!db) db = { content: clone(defaultContent), items: clone(defaultCollections), enquiries: [], admins: [{ email: 'demo@admin', role: 'super_admin' }] }
  // add any sections/collections introduced after this browser first saved demo data
  Object.keys(defaultCollections).forEach((k) => { if (!db.items[k]) db.items[k] = clone(defaultCollections[k]) })
  Object.keys(defaultContent).forEach((k) => { if (!db.content[k]) db.content[k] = clone(defaultContent[k]) })
  return db
}
function demoSave(db) {
  try { localStorage.setItem(LS, JSON.stringify(db)) } catch (e) {
    throw new Error('Browser storage is full (demo mode). Connect Supabase for unlimited storage.')
  }
}
export function resetDemo() { try { localStorage.removeItem(LS) } catch { /* ignore */ } }

/* ---------------- public reads ---------------- */
export async function loadAll({ includeInactive = false } = {}) {
  if (!isSupabase) {
    const db = demoDb()
    const items = {}
    Object.keys(defaultCollections).forEach((c) => {
      const list = (db.items[c] || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      items[c] = includeInactive ? list : list.filter((i) => i.is_active !== false)
    })
    return { content: db.content, collections: items, seeded: true }
  }
  let q = supabase.from('items').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
  if (!includeInactive) q = q.eq('is_active', true)
  const [{ data: rows, error: e1 }, { data: content, error: e2 }] = await Promise.all([q, supabase.from('site_content').select('*')])
  if (e1) throw e1
  if (e2) throw e2
  const collections = {}
  Object.keys(defaultCollections).forEach((c) => (collections[c] = []))
  ;(rows || []).forEach((r) => { (collections[r.collection] ||= []).push(rowToItem(r)) })
  const c = {}
  ;(content || []).forEach((r) => (c[r.key] = r.value))
  return { content: c, collections, seeded: (rows || []).length > 0 || (content || []).length > 0 }
}

/* ---------------- collections (admin) ---------------- */
export async function listItems(collection) {
  if (!isSupabase) {
    return (demoDb().items[collection] || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }
  const { data, error } = await supabase.from('items').select('*').eq('collection', collection).order('sort_order').order('created_at')
  if (error) throw error
  return data.map(rowToItem)
}

export async function saveItem(collection, item) {
  if (!isSupabase) {
    const db = demoDb()
    const list = db.items[collection] || (db.items[collection] = [])
    if (item.id) {
      const i = list.findIndex((x) => x.id === item.id)
      if (i >= 0) list[i] = { ...list[i], ...item }
      else list.push(item)
    } else {
      list.push({ ...item, id: uid(), sort_order: item.sort_order ?? list.length + 1, is_active: item.is_active !== false, created_at: new Date().toISOString() })
    }
    demoSave(db)
    return true
  }
  const row = itemToRow(collection, item)
  if (item.id) {
    const { error } = await supabase.from('items').update({ ...row, updated_at: new Date().toISOString() }).eq('id', item.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('items').insert(row)
    if (error) throw error
  }
  return true
}

export async function deleteItem(collection, id) {
  if (!isSupabase) {
    const db = demoDb()
    db.items[collection] = (db.items[collection] || []).filter((x) => x.id !== id)
    demoSave(db)
    return true
  }
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function reorderItems(collection, orderedIds) {
  if (!isSupabase) {
    const db = demoDb()
    const list = db.items[collection] || []
    orderedIds.forEach((id, idx) => { const it = list.find((x) => x.id === id); if (it) it.sort_order = idx + 1 })
    demoSave(db)
    return true
  }
  await Promise.all(orderedIds.map((id, idx) => supabase.from('items').update({ sort_order: idx + 1 }).eq('id', id)))
  return true
}

/* ---------------- page content ---------------- */
export async function saveContent(key, value) {
  if (!isSupabase) {
    const db = demoDb()
    db.content[key] = value
    demoSave(db)
    return true
  }
  const { error } = await supabase.from('site_content').upsert({ key, value, updated_at: new Date().toISOString() })
  if (error) throw error
  return true
}

/* ---------------- public testimonial submission (published after admin approval) ---------------- */
export async function submitTestimonial(t) {
  const data = {
    name: String(t.name || '').slice(0, 120), company: String(t.company || '').slice(0, 160), designation: String(t.designation || '').slice(0, 120),
    location: String(t.location || '').slice(0, 120), message: String(t.message || '').slice(0, 1500), rating: Math.min(5, Math.max(1, Number(t.rating) || 5)),
    phone: String(t.phone || '').slice(0, 30), photo: '', video_url: '', featured: false, submitted: true, submitted_at: new Date().toISOString(),
  }
  if (!isSupabase) {
    const db = demoDb()
    const list = db.items.testimonials || (db.items.testimonials = [])
    list.push({ ...data, id: uid(), sort_order: list.length + 1, is_active: false, created_at: new Date().toISOString() })
    demoSave(db)
    return true
  }
  const { error } = await supabase.from('items').insert({ collection: 'testimonials', data, sort_order: 999, is_active: false })
  if (error) throw error
  return true
}

/* ---------------- enquiries ---------------- */
export async function createEnquiry(e) {
  const payload = {
    name: e.name || '', company: e.company || '', email: e.email || '', phone: e.phone || '',
    enquiry_type: e.enquiry_type || '', product: e.product || '', message: e.message || '',
    source: e.source || 'website', page_url: typeof window !== 'undefined' ? window.location.pathname : '',
  }
  if (!isSupabase) {
    const db = demoDb()
    db.enquiries.unshift({ ...payload, id: uid(), status: 'new', notes: '', created_at: new Date().toISOString() })
    demoSave(db)
    return true
  }
  const { error } = await supabase.from('enquiries').insert(payload)
  if (error) throw error
  return true
}
export async function listEnquiries() {
  if (!isSupabase) return demoDb().enquiries
  const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(2000)
  if (error) throw error
  return data
}
export async function updateEnquiry(id, patch) {
  if (!isSupabase) {
    const db = demoDb()
    const e = db.enquiries.find((x) => x.id === id)
    if (e) Object.assign(e, patch)
    demoSave(db)
    return true
  }
  const { error } = await supabase.from('enquiries').update(patch).eq('id', id)
  if (error) throw error
  return true
}
export async function deleteEnquiry(id) {
  if (!isSupabase) {
    const db = demoDb()
    db.enquiries = db.enquiries.filter((x) => x.id !== id)
    demoSave(db)
    return true
  }
  const { error } = await supabase.from('enquiries').delete().eq('id', id)
  if (error) throw error
  return true
}

/* ---------------- media upload ---------------- */
function compressImage(file, maxSize = 1920, quality = 0.85, type = 'image/webp') {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return resolve(file)
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      let { width: w, height: h } = img
      const s = Math.min(1, maxSize / Math.max(w, h))
      w = Math.round(w * s); h = Math.round(h * s)
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      const ctx = c.getContext('2d')
      if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h) }
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      c.toBlob((b) => resolve(b && b.size < file.size ? b : file), type, quality)
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

export async function uploadFile(file) {
  if (!isSupabase) {
    const blob = file.type.startsWith('image/') ? await compressImage(file, 1400, 0.8, 'image/jpeg') : file
    if (blob.size > 2.5 * 1024 * 1024) throw new Error('File too large for demo mode (max ~2.5 MB). Connect Supabase for real uploads.')
    return await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob) })
  }
  const isImg = file.type.startsWith('image/')
  const blob = isImg ? await compressImage(file) : file
  const ext = blob.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'bin').toLowerCase()
  const d = new Date()
  const path = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${uid()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type || file.type, cacheControl: '31536000', upsert: false })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

export async function listMedia() {
  if (!isSupabase) return []
  const out = []
  const walk = async (prefix) => {
    const { data } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } })
    for (const f of data || []) {
      const p = prefix ? `${prefix}/${f.name}` : f.name
      if (!f.id) await walk(p)
      else out.push({ path: p, name: f.name, size: f.metadata?.size, created_at: f.created_at, url: supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl })
    }
  }
  await walk('')
  return out.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
}
export async function deleteMedia(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}

/* ---------------- auth ---------------- */
const DEMO_PW = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'admin123'
const DEMO_KEY = 'sse_demo_admin'
const ss = {
  get: (k) => { try { return sessionStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { sessionStorage.setItem(k, v) } catch { /* ignore */ } },
  del: (k) => { try { sessionStorage.removeItem(k) } catch { /* ignore */ } },
}
let demoSession = false

export async function getAdmin() {
  if (!isSupabase) {
    return (demoSession || ss.get(DEMO_KEY)) ? { email: 'demo@admin', role: 'super_admin' } : null
  }
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const email = session.user.email
  const { data } = await supabase.from('admin_users').select('email, role').ilike('email', email).maybeSingle()
  if (!data) return { email, role: null }
  return { email, role: data.role }
}
export async function signIn(email, password) {
  if (!isSupabase) {
    if (password !== DEMO_PW) throw new Error('Invalid password')
    demoSession = true; ss.set(DEMO_KEY, '1')
    return true
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return true
}
export async function signOut() {
  if (!isSupabase) { demoSession = false; ss.del(DEMO_KEY); return }
  await supabase.auth.signOut()
}
export async function sendReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/reset` })
  if (error) throw error
}
export async function updatePassword(password) {
  if (!isSupabase) throw new Error('Password change is available when Supabase is connected. In demo mode set VITE_DEMO_ADMIN_PASSWORD in .env')
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

/* ---------------- admin users ---------------- */
export async function listAdmins() {
  if (!isSupabase) return demoDb().admins
  const { data, error } = await supabase.from('admin_users').select('*').order('created_at')
  if (error) throw error
  return data
}
export async function addAdmin(email, role) {
  if (!isSupabase) { const db = demoDb(); db.admins.push({ email, role }); demoSave(db); return }
  const { error } = await supabase.from('admin_users').insert({ email: email.toLowerCase().trim(), role })
  if (error) throw error
}
export async function removeAdmin(email) {
  if (!isSupabase) { const db = demoDb(); db.admins = db.admins.filter((a) => a.email !== email); demoSave(db); return }
  const { error } = await supabase.from('admin_users').delete().eq('email', email)
  if (error) throw error
}

/* ---------------- backup ---------------- */
export async function exportBackup() {
  const all = await loadAll({ includeInactive: true })
  return { exported_at: new Date().toISOString(), content: all.content, collections: all.collections }
}
export async function importBackup(backup) {
  if (!backup?.content || !backup?.collections) throw new Error('Invalid backup file')
  if (!isSupabase) {
    const db = demoDb()
    db.content = backup.content
    db.items = backup.collections
    demoSave(db)
    return
  }
  for (const [key, value] of Object.entries(backup.content)) await saveContent(key, value)
  for (const [collection, list] of Object.entries(backup.collections)) {
    await supabase.from('items').delete().eq('collection', collection)
    if (list.length) {
      const { error } = await supabase.from('items').insert(list.map((it) => itemToRow(collection, it)))
      if (error) throw error
    }
  }
}
