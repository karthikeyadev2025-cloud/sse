import { useEffect, useRef, useState } from 'react'

// Animates "100+" → counts 0..100 then shows the suffix. Non-numeric values ("Pan-India") show as-is.
export default function CountUp({ value, duration = 1600 }) {
  const m = String(value ?? '').match(/^(\D*)(\d[\d,]*)(.*)$/)
  const target = m ? Number(m[2].replace(/,/g, '')) : 0
  const [n, setN] = useState(target)
  const ref = useRef(null)
  useEffect(() => {
    if (!m) return
    const el = ref.current
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setN(target); return }
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration)
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target]) // eslint-disable-line
  if (!m) return <span>{value}</span>
  return <span ref={ref}>{m[1]}{n.toLocaleString('en-IN')}{m[3]}</span>
}
