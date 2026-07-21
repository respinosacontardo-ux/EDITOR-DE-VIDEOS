import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { HERO, WHATSAPP_LINK } from '../data/content.js'
import { textVariants, listVariants } from './motionVariants.js'
import { WhatsAppIcon } from './Icons.jsx'

function Counter({ value, suffix, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame
    const duration = 1400
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="text-3xl md:text-4xl font-black text-white">
        {display}
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">{label}</div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="snap-section relative min-h-screen flex items-center overflow-hidden grid-bg"
    >
      {/* Background glows */}
      <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-accent/20 blur-[140px] animate-pulse-glow pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-accent2/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center w-full">
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="space-y-6"
        >
          <motion.span
            variants={textVariants}
            className="inline-block rounded-full px-4 py-1.5 bg-accent/10 border border-accent/30 text-accent text-xs uppercase tracking-widest font-semibold"
          >
            {HERO.eyebrow}
          </motion.span>

          <motion.h1
            variants={textVariants}
            className="text-5xl md:text-7xl font-black tracking-tight text-white text-glow"
          >
            MKT <span className="text-accent">BATTISTON</span>
          </motion.h1>

          <motion.h2
            variants={textVariants}
            className="text-xl md:text-2xl font-medium text-gray-200"
          >
            {HERO.subheadline}
          </motion.h2>

          <motion.p variants={textVariants} className="text-gray-400 max-w-xl leading-relaxed">
            {HERO.body}
          </motion.p>

          <motion.div variants={textVariants} className="flex flex-wrap gap-4 pt-2">
            <a
              href="#youtube"
              className="rounded-full border border-accent px-7 py-3.5 text-sm font-bold text-accent hover:bg-accent hover:text-white transition-all hover:scale-105"
            >
              Ver Nuestros Softwares
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3.5 text-sm font-bold text-[#052e13] hover:scale-105 hover:shadow-lg hover:shadow-whatsapp/30 transition-all"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Contactar por WhatsApp
            </a>
          </motion.div>

          <motion.div
            variants={textVariants}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg"
          >
            {HERO.stats.map((stat) => (
              <Counter key={stat.label} {...stat} />
            ))}
          </motion.div>
        </motion.div>

        {/* Abstract AI automation visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          viewport={{ once: false, amount: 0.3 }}
          className="hidden lg:flex justify-center relative"
        >
          <div className="relative w-full max-w-md animate-float">
            <div className="rounded-2xl border border-white/10 bg-surface/60 backdrop-blur p-5 shadow-2xl shadow-accent/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gray-400">Panel de Automatización</span>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-60" />
                    <span className="relative rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  EN VIVO
                </span>
              </div>
              {[
                { label: 'Instagram', pct: 92, color: '#E1306C' },
                { label: 'Facebook', pct: 87, color: '#1877F2' },
                { label: 'WhatsApp', pct: 95, color: '#25D366' },
                { label: 'TikTok', pct: 78, color: '#22D3EE' },
                { label: 'YouTube', pct: 84, color: '#FF0000' },
              ].map((row, i) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-300">
                    <span>{row.label}</span>
                    <span style={{ color: row.color }}>{row.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: row.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.pct}%` }}
                      transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: 'easeOut' }}
                      viewport={{ once: false }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-[11px]">
                <span className="text-gray-300">Acciones automatizadas hoy</span>
                <span className="font-bold text-accent">14.382</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
