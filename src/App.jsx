import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ContentProvider } from './lib/ContentContext'
import { QuoteProvider } from './components/QuoteModal'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Industries from './pages/Industries'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Gallery from './pages/Gallery'
import Clients from './pages/Clients'
import Team from './pages/Team'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const AdminApp = lazy(() => import('./admin/AdminApp'))

function ScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) { const el = document.getElementById(hash.slice(1)); if (el) { el.scrollIntoView(); return } }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <ToastProvider>
      <ContentProvider>
        <ScrollTop />
        <Routes>
          <Route path="/admin/*" element={<Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-gray-500">Loading admin…</div>}><AdminApp /></Suspense>} />
          <Route element={<QuoteProvider><Layout /></QuoteProvider>}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="industries" element={<Industries />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="clients" element={<Clients />} />
            <Route path="team" element={<Team />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ContentProvider>
    </ToastProvider>
  )
}
