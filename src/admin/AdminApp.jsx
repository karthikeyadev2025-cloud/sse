import { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route, Navigate, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Inbox, Home, Info, Package, FolderKanban, Factory, Wrench, Images, Phone, Layers, Settings, Users, DatabaseBackup,
  Handshake, LogOut, ExternalLink, Menu, KeyRound, Tags, MessageSquareQuote, HelpCircle, ImagePlay, FolderOpen, Loader2, ShieldAlert,
} from 'lucide-react'
import { getAdmin, signOut, isSupabase, supabase } from '../lib/api'
import { useSettings } from '../lib/ContentContext'
import { cx, siteHref } from '../lib/utils'
import Login, { ResetPassword } from './Login'
import Dashboard from './Dashboard'
import Enquiries from './Enquiries'
import CollectionManager from './CollectionManager'
import ContentEditor from './ContentEditor'
import { MediaLibrary, AdminUsers, Backup, Account } from './System'

const AdminCtx = createContext(null)
export const useAdmin = () => useContext(AdminCtx)

const MENU = [
  { group: 'Overview', items: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  ] },
  { group: 'Website Pages', items: [
    { to: '/admin/content/home', label: 'Home Page', icon: Home },
    { to: '/admin/content/about', label: 'About Page', icon: Info },
    { to: '/admin/content/products_page', label: 'Products Page', icon: Package },
    { to: '/admin/content/projects_page', label: 'Projects Page', icon: FolderKanban },
    { to: '/admin/content/industries_page', label: 'Industries Page', icon: Factory },
    { to: '/admin/content/services_page', label: 'Services Page', icon: Wrench },
    { to: '/admin/content/gallery_page', label: 'Gallery Page', icon: Images },
    { to: '/admin/content/clients_page', label: 'Clients Page', icon: Handshake },
    { to: '/admin/content/contact_page', label: 'Contact Page', icon: Phone },
    { to: '/admin/content/common', label: 'Common Sections', icon: Layers },
  ] },
  { group: 'Content', items: [
    { to: '/admin/c/hero_slides', label: 'Hero Slides', icon: ImagePlay },
    { to: '/admin/c/products', label: 'Products', icon: Package },
    { to: '/admin/c/product_categories', label: 'Product Categories', icon: Tags },
    { to: '/admin/c/projects', label: 'Projects', icon: FolderKanban },
    { to: '/admin/c/project_categories', label: 'Project Categories', icon: Tags },
    { to: '/admin/c/industries', label: 'Industries', icon: Factory },
    { to: '/admin/c/services', label: 'Services', icon: Wrench },
    { to: '/admin/c/gallery', label: 'Gallery', icon: Images },
    { to: '/admin/c/gallery_categories', label: 'Gallery Categories', icon: Tags },
    { to: '/admin/c/clients', label: 'Clients', icon: Handshake },
    { to: '/admin/c/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { to: '/admin/c/faqs', label: 'FAQs', icon: HelpCircle },
  ] },
  { group: 'System', items: [
    { to: '/admin/content/settings', label: 'Site Settings', icon: Settings },
    { to: '/admin/media', label: 'Media Library', icon: FolderOpen },
    { to: '/admin/users', label: 'Admin Users', icon: Users, superOnly: true },
    { to: '/admin/backup', label: 'Backup & Restore', icon: DatabaseBackup },
    { to: '/admin/account', label: 'My Account', icon: KeyRound },
  ] },
]

function Shell({ admin, children }) {
  const s = useSettings()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  const logout = async () => { await signOut(); nav('/admin/login') }
  const Side = (
    <div className="flex h-full flex-col bg-brand-950 text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <img src={s.logo} alt="" className="h-10 w-auto" />
        <div className="leading-tight"><p className="font-display font-bold">{s.company_name}</p><p className="text-[11px] text-gold-300">Super Admin</p></div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {MENU.map((g) => (
          <div key={g.group}>
            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-white/40">{g.group}</p>
            {g.items.filter((it) => !it.superOnly || admin.role === 'super_admin').map((it) => (
              <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => cx('flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition', isActive ? 'bg-gold-400 text-ink' : 'text-white/80 hover:bg-white/5 hover:text-white')}>
                <it.icon className="h-4 w-4" />{it.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <p className="truncate px-3 pb-2 text-xs text-white/50">{admin.email}</p>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"><LogOut className="h-4 w-4" /> Logout</button>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-[#f4f6f5]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{Side}</aside>
      {open && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-72">{Side}</div></div>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white/90 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"><Menu className="h-5 w-5" /></button>
          <div className="hidden text-sm text-gray-500 lg:block">{isSupabase ? <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Live · Supabase connected</span> : <span className="inline-flex items-center gap-2 font-semibold text-amber-700"><span className="h-2 w-2 rounded-full bg-amber-500" /> Demo mode · changes saved in this browser only</span>}</div>
          <a href={siteHref('/')} target="_blank" rel="noreferrer" className="btn btn-sm border bg-white"><ExternalLink className="h-4 w-4" /> View Website</a>
        </header>
        {!isSupabase && <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-800 lg:hidden">Demo mode — connect Supabase to publish changes for everyone.</div>}
        <main className="mx-auto max-w-6xl p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [admin, setAdmin] = useState(undefined)
  const loc = useLocation()

  const check = async () => { try { setAdmin(await getAdmin()) } catch { setAdmin(null) } }
  useEffect(() => {
    check()
    if (isSupabase) {
      const { data } = supabase.auth.onAuthStateChange(() => check())
      return () => data.subscription.unsubscribe()
    }
  }, [])
  useEffect(() => { document.title = 'Admin | S.S.E Industries' }, [loc.pathname])

  if (admin === undefined) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand-700" /></div>

  return (
    <AdminCtx.Provider value={{ admin, refreshAdmin: check }}>
      <Routes>
        <Route path="login" element={admin?.role ? <Navigate to="/admin" replace /> : <Login onLogin={check} />} />
        <Route path="reset" element={<ResetPassword />} />
        <Route path="*" element={
          !admin ? <Navigate to="/admin/login" replace /> :
          !admin.role ? <NoAccess email={admin.email} /> : (
            <Shell admin={admin}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="c/:collection" element={<CollectionManager />} />
                <Route path="content/:key" element={<ContentEditor />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="users" element={admin.role === 'super_admin' ? <AdminUsers /> : <Navigate to="/admin" />} />
                <Route path="backup" element={<Backup />} />
                <Route path="account" element={<Account />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </Shell>
          )
        } />
      </Routes>
    </AdminCtx.Provider>
  )
}

function NoAccess({ email }) {
  const nav = useNavigate()
  return (
    <div className="grid min-h-screen place-items-center bg-[#f4f6f5] p-4">
      <div className="card max-w-md p-8 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-4 text-xl font-bold">No admin access</h1>
        <p className="mt-2 text-sm text-gray-600"><b>{email}</b> is signed in but is not listed as an admin. Ask the super admin to add this email under Admin Users (or add it to the <code>admin_users</code> table in Supabase).</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={async () => { await signOut(); nav('/admin/login') }} className="btn-green">Sign out</button>
          <Link to="/" className="btn border">Website</Link>
        </div>
      </div>
    </div>
  )
}

export function PageTitle({ title, sub, children }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-bold text-ink">{title}</h1>{sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
