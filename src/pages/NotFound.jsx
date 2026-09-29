import { Link } from 'react-router-dom'
import { usePageMeta } from '../components/Sections'

export default function NotFound() {
  usePageMeta('Page not found')
  return (
    <section className="grid min-h-[60vh] place-items-center bg-[#f5f8f5] px-4 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold text-brand-800">404</p>
        <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-gray-600">The page you’re looking for doesn’t exist or was moved.</p>
        <Link to="/" className="btn-gold mt-6">Back to Home</Link>
      </div>
    </section>
  )
}
