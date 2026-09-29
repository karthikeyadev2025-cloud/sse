export const HASH = import.meta.env?.VITE_HASH_ROUTER === '1'
// Link to a public page from outside the router (e.g. admin "open in new tab")
export const siteHref = (path) => (HASH ? `#${path}` : path)

export const cx = (...a) => a.filter(Boolean).join(' ')

export function waLink(number, message = '') {
  const n = String(number || '').replace(/\D/g, '')
  return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
export const telLink = (p) => `tel:${String(p || '').replace(/[^\d+]/g, '')}`

export const slugify = (s) => String(s || '').toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const nl2br = (s) => String(s || '').split('\n')

export const isVideoFile = (url) => /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(String(url || '')) || String(url || '').startsWith('data:video')

export function youtubeEmbed(url) {
  if (!url) return ''
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` : url
}

export function setMeta(title, description) {
  if (title) document.title = title
  if (description) {
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = description
  }
}

export function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Normalise an Indian mobile number for wa.me links
export function toWaNumber(phone) {
  const d = String(phone || '').replace(/\D/g, '')
  if (d.length === 10) return '91' + d
  if (d.length === 11 && d.startsWith('0')) return '91' + d.slice(1)
  return d
}
