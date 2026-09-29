import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { signIn, sendReset, updatePassword, isSupabase } from '../lib/api'
import { useSettings } from '../lib/ContentContext'
import { useToast } from '../components/Toast'

function Frame({ children }) {
  const s = useSettings()
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-950 lg:block">
        <img src={s.admin_bg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent" />
        <div className="absolute bottom-0 p-12 text-white">
          <img src={s.logo} alt="" className="h-20" />
          <h2 className="mt-6 font-display text-4xl font-bold">{s.company_name}</h2>
          <p className="mt-2 text-white/70">Manage every page, product, photo and enquiry from one place.</p>
        </div>
      </div>
      <div className="grid place-items-center bg-[#f4f6f5] p-6">
        <div className="w-full max-w-sm">
          <img src={s.logo} alt="" className="mx-auto mb-6 h-16 lg:hidden" />
          {children}
          <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-brand-700"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
          <p className="mt-8 text-center text-xs text-gray-400">Website by <a href="https://nikkitechnologies.com" target="_blank" rel="noreferrer" className="font-semibold text-gray-500 hover:text-brand-700">Nikki Technologies</a></p>
        </div>
      </div>
    </div>
  )
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [forgot, setForgot] = useState(false)
  const toast = useToast()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (forgot) { await sendReset(email); toast('Password reset link sent to your email'); setForgot(false) }
      else { await signIn(email, pw); await onLogin(); nav('/admin') }
    } catch (ex) {
      const m = String(ex?.message || '')
      toast(/failed to fetch|network|load failed/i.test(m)
        ? 'Cannot reach the database. Check your internet connection, disable ad-blockers for this site, or check the Supabase URL/key in the hosting settings.'
        : m === 'Invalid login credentials' ? 'Wrong email or password' : (m || 'Login failed'), 'error')
    }
    setBusy(false)
  }

  return (
    <Frame>
      <div className="card p-7">
        <h1 className="text-2xl font-bold">{forgot ? 'Reset password' : 'Super Admin Login'}</h1>
        <p className="mt-1 text-sm text-gray-500">{isSupabase ? (forgot ? 'We will email you a reset link.' : 'Sign in with your admin account.') : 'Demo mode — enter the demo password (default: admin123).'}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {isSupabase && (
            <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input required type="email" className="input pl-9" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          )}
          {!forgot && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input required type={show ? 'text' : 'password'} className="input px-9" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          )}
          <button disabled={busy} className="btn-green w-full py-3">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{forgot ? 'Send reset link' : 'Login'}</button>
        </form>
        {isSupabase && <button onClick={() => setForgot(!forgot)} className="mt-4 w-full text-center text-sm font-medium text-brand-700">{forgot ? 'Back to login' : 'Forgot password?'}</button>}
      </div>
    </Frame>
  )
}

export function ResetPassword() {
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const nav = useNavigate()
  const submit = async (e) => {
    e.preventDefault()
    if (pw.length < 8) return toast('Use at least 8 characters', 'error')
    setBusy(true)
    try { await updatePassword(pw); toast('Password updated'); nav('/admin') } catch (ex) { toast(ex.message, 'error') }
    setBusy(false)
  }
  return (
    <Frame>
      <div className="card p-7">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input type="password" className="input" placeholder="New password (min 8 characters)" value={pw} onChange={(e) => setPw(e.target.value)} />
          <button disabled={busy} className="btn-green w-full py-3">{busy && <Loader2 className="h-4 w-4 animate-spin" />}Update password</button>
        </form>
      </div>
    </Frame>
  )
}
