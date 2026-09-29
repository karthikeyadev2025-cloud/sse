import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'

const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }) {
  const [list, setList] = useState([])
  const push = useCallback((msg, type = 'success') => {
    const id = Math.random()
    setList((l) => [...l, { id, msg, type }])
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3800)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {list.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lift animate-fadeUp ${t.type === 'error' ? 'bg-red-600' : 'bg-brand-800'}`}>
            {t.type === 'error' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />}
            <span className="flex-1">{t.msg}</span>
            <button onClick={() => setList((l) => l.filter((x) => x.id !== t.id))}><X className="h-4 w-4 opacity-70" /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
