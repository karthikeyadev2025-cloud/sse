import { useState } from 'react'
import { Send, MessageCircle, Loader2 } from 'lucide-react'
import { createEnquiry } from '../lib/api'
import { useContent, useSettings } from '../lib/ContentContext'
import { waLink } from '../lib/utils'
import { useToast } from './Toast'

export default function EnquiryForm({ product = '', source = 'contact-form', defaultType = '', compact = false, onDone }) {
  const s = useSettings()
  const cp = useContent('contact_page')
  const toast = useToast()
  const [f, setF] = useState({ name: '', company: '', email: '', phone: '', enquiry_type: defaultType || (product ? 'Product Enquiry' : ''), product, message: product ? `I am interested in ${product}. Please share details and quotation.` : '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState({})
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const validate = () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Please enter your name'
    const digits = f.phone.replace(/\D/g, '')
    if (digits.length < 10) e.phone = 'Enter a valid phone number'
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email'
    if (!f.enquiry_type) e.enquiry_type = 'Select an enquiry type'
    if (!f.message.trim()) e.message = 'Please enter your message'
    setErr(e)
    return !Object.keys(e).length
  }

  const waText = () => [
    `*New Enquiry – ${s.company_name}*`,
    `Name: ${f.name}`, f.company && `Company: ${f.company}`, `Phone: ${f.phone}`, f.email && `Email: ${f.email}`,
    f.enquiry_type && `Type: ${f.enquiry_type}`, f.product && `Product: ${f.product}`, `Message: ${f.message}`,
  ].filter(Boolean).join('\n')

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    let saved = false
    try { await createEnquiry({ ...f, source }); saved = true } catch (ex) { console.error(ex) }
    setBusy(false)
    if (s.whatsapp_after_form || !saved) window.open(waLink(s.whatsapp, waText()), '_blank')
    toast(saved ? 'Thank you! Your enquiry has been received. Our team will contact you shortly.' : 'Opening WhatsApp to send your enquiry…')
    setF({ ...f, message: '', company: '', email: '' })
    onDone && onDone()
  }

  const Err = ({ k }) => err[k] ? <p className="mt-1 text-xs text-red-600">{err[k]}</p> : null
  const types = cp.enquiry_types || []

  return (
    <form onSubmit={submit} noValidate className="space-y-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div><input className="input" placeholder="Your Name *" value={f.name} onChange={set('name')} /><Err k="name" /></div>
        <div><input className="input" placeholder="Your Company" value={f.company} onChange={set('company')} /></div>
        <div><input className="input" type="tel" inputMode="tel" placeholder="Phone Number *" value={f.phone} onChange={set('phone')} /><Err k="phone" /></div>
        <div><input className="input" type="email" placeholder="Email Address" value={f.email} onChange={set('email')} /><Err k="email" /></div>
      </div>
      <div>
        <select className="input" value={f.enquiry_type} onChange={set('enquiry_type')}>
          <option value="">Select Inquiry Type *</option>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
        <Err k="enquiry_type" />
      </div>
      {product && <input className="input bg-gray-50" value={f.product} onChange={set('product')} placeholder="Product" />}
      <div className="relative">
        <textarea className="input min-h-[120px] resize-y" maxLength={1000} placeholder="Your Message *" value={f.message} onChange={set('message')} rows={compact ? 3 : 5} />
        <span className="absolute bottom-2 right-3 text-[11px] text-gray-400">{f.message.length}/1000</span>
        <Err k="message" />
      </div>
      <div className="flex flex-wrap gap-3 pt-1">
        <button disabled={busy} className="btn-gold min-w-[170px]">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send Message
        </button>
        <a href={waLink(s.whatsapp, f.product ? `Hello, I am interested in ${f.product}. Please share details.` : s.whatsapp_default_message)} target="_blank" rel="noreferrer" className="btn-wa">
          <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
        </a>
      </div>
    </form>
  )
}
