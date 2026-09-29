import { MapPin, Phone, Mail, Clock, Navigation, ArrowRight, MessageCircle } from 'lucide-react'
import Icon from '../components/Icon'
import EnquiryForm from '../components/EnquiryForm'
import { PageHero, Faq, usePageMeta } from '../components/Sections'
import { useContent, useSettings } from '../lib/ContentContext'
import { telLink, waLink, cx } from '../lib/utils'

export default function Contact() {
  const pg = useContent('contact_page')
  const s = useSettings()
  usePageMeta('Contact Us', pg.hero_text)
  const info = [
    [MapPin, 'Address', s.address, s.map_link],
    [Phone, 'Phone', [s.phone, s.phone_alt].filter(Boolean).join(', '), telLink(s.phone)],
    [MessageCircle, 'WhatsApp', `+${s.whatsapp}`, waLink(s.whatsapp, s.whatsapp_default_message)],
    [Mail, 'Email', s.email, `mailto:${s.email}`],
    [Clock, 'Working Hours', `${s.working_hours}\n${s.working_note}`],
  ]
  return (
    <>
      <PageHero data={pg} crumbs={[{ label: 'Contact' }]} />
      <section className="bg-white">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_1.25fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold underline-gold">Our Contact Information</h2>
            <ul className="mt-7 space-y-6">
              {info.map(([I, l, v, href]) => (
                <li key={l} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-800 text-white"><I className="h-5 w-5" /></span>
                  <div>
                    <p className="font-display text-lg font-bold">{l}</p>
                    {href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="whitespace-pre-line text-sm text-gray-600 hover:text-brand-700">{v}</a> : <p className="whitespace-pre-line text-sm text-gray-600">{v}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:border-x lg:px-8">
            <h2 className="mb-6 text-2xl font-bold underline-gold">{pg.form_title}</h2>
            <EnquiryForm source="contact-page" />
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-bold underline-gold">Our Location</h2>
            <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200">
              <iframe title="Location map" src={s.map_embed_url} className="h-72 w-full lg:h-80" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <a href={s.map_link} target="_blank" rel="noreferrer" className="btn-green mt-4"><Navigation className="h-4 w-4" /> Get Directions <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
      <section className="bg-[#f5f8f5]">
        <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {(pg.highlights || []).map((b, i) => (
            <div key={i} className={cx('flex items-start gap-4', i > 0 && 'lg:border-l lg:pl-6')}>
              <Icon name={b.icon} className="h-10 w-10 shrink-0 text-brand-800" />
              <div><h4 className="font-bold">{b.title}</h4><p className="mt-1 text-sm text-gray-600">{b.text}</p></div>
            </div>
          ))}
        </div>
      </section>
      <Faq />
    </>
  )
}
