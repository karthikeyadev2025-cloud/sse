import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadAll } from './api'
import { defaultContent, defaultCollections } from '../data/defaults'

const Ctx = createContext(null)

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
export function deepMerge(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over
  const out = { ...base }
  Object.keys(over).forEach((k) => {
    const v = over[k]
    if (v === undefined || v === null) return
    out[k] = isObj(base[k]) && isObj(v) ? deepMerge(base[k], v) : v
  })
  return out
}

export function ContentProvider({ children }) {
  const [state, setState] = useState({ content: defaultContent, collections: defaultCollections, loading: true, error: null })

  const refresh = useCallback(async () => {
    try {
      const r = await loadAll()
      const content = deepMerge(defaultContent, r.content || {})
      const collections = r.seeded ? { ...Object.fromEntries(Object.keys(defaultCollections).map((k) => [k, []])), ...r.collections } : defaultCollections
      setState({ content, collections, loading: false, error: null })
    } catch (e) {
      console.error('Content load failed, using defaults', e)
      setState((s) => ({ ...s, loading: false, error: e }))
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])
  useEffect(() => {
    const fav = state.content.settings?.favicon
    if (!fav) return
    let l = document.querySelector('link[rel="icon"]')
    if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l) }
    l.href = fav
  }, [state.content.settings?.favicon])

  const value = useMemo(() => ({ ...state, refresh }), [state, refresh])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
export const useContent = (key) => useContext(Ctx).content[key] || {}
export const useSettings = () => useContext(Ctx).content.settings
export const useCollection = (name) => useContext(Ctx).collections[name] || []
