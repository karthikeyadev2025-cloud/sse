import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { X, PhoneCall } from 'lucide-react'
import EnquiryForm from './EnquiryForm'
import { useSettings } from '../lib/ContentContext'
import { telLink } from '../lib/utils'

const Ctx = createContext({ open: () => {} })
export const useQuote = () => useContext(Ctx)

export function QuoteProvider({ children }) {
  const [state, setState] = useState(null)
  const open = useCallback((opts = {}) => setState({ key: Date.now(), ...opts }), [])
  const close = () => setState(null)
  const s = useSettings()

  useEffect(() => {
    if (!state) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [state])

  // open quote modal from any link with href="#quote"
  useEffect(() => {
    const h = (e) => {
      const a = e.target.closest && e.target.closest('a[href="#quote"]')
      if (a) { e.preventDefault(); open() }
    }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [open])

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {state && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={close}>
          <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl animate-fadeUp sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative overflow-hidden bg-brand-900 px-6 py-6 text-white grain-bg">
              <button onClick={close} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Close"><X className="h-4 w-4" /></button>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-300">{state.product ? 'Product Enquiry' : 'Request a Quote'}</p>
              <h3 className="mt-1 text-2xl font-bold">{state.product || state.title || "Let's discuss your requirement"}</h3>
              <p className="mt-1 text-sm text-white/70">Share your details — our team will get back to you quickly.</p>
              <a href={telLink(s.phone)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold-300"><PhoneCall className="h-4 w-4" /> Or call {s.phone}</a>
            </div>
            <div className="p-6">
              <EnquiryForm key={state.key} product={state.product || ''} source={state.source || 'quote-popup'} defaultType={state.product ? 'Product Enquiry' : 'Request a Quote'} compact onDone={close} />
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}
