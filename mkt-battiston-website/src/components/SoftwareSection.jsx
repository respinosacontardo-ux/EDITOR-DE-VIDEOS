import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { whatsappLinkFor } from '../data/content.js'
import {
  textVariants,
  listVariants,
  listItemVariants,
  visualVariants,
} from './motionVariants.js'
import { CheckIcon, ChevronIcon, WhatsAppIcon } from './Icons.jsx'
import { MOCKUPS } from './Mockups.jsx'

function StatusBadge({ accent }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-widest font-semibold border"
      style={{
        color: accent,
        borderColor: `${accent}55`,
        backgroundColor: `${accent}15`,
      }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="animate-ping absolute h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: accent }}
        />
        <span className="relative rounded-full h-2 w-2" style={{ backgroundColor: accent }} />
      </span>
      Activo
    </span>
  )
}

function ExpandableSpecs({ specs, accent }) {
  const [open, setOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState(0)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-200 hover:bg-white/5 transition-colors"
      >
        Ver especificaciones completas
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronIcon className="w-4 h-4 text-gray-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-2">
              {specs.map((group, i) => (
                <div key={group.category} className="rounded-lg border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setOpenCategory(openCategory === i ? -1 : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {group.category}
                    <motion.span
                      animate={{ rotate: openCategory === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronIcon className="w-3.5 h-3.5 text-gray-500" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openCategory === i && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 px-4 py-2 text-xs text-gray-400"
                          >
                            <CheckIcon
                              className="w-3.5 h-3.5 mt-0.5 shrink-0"
                              style={{ color: accent }}
                            />
                            {item}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SoftwareSection({ software, flip = false }) {
  const Mockup = MOCKUPS[software.visual]

  return (
    <section
      id={software.id}
      className="snap-section relative min-h-screen flex items-center overflow-hidden"
    >
      <div
        className="absolute top-1/4 w-[28rem] h-[28rem] rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{
          backgroundColor: software.accent,
          [flip ? 'left' : 'right']: '-8rem',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-28 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className={`space-y-6 ${flip ? 'md:order-2' : ''}`}
        >
          <motion.div variants={textVariants}>
            <StatusBadge accent={software.accent} />
          </motion.div>

          <motion.div variants={textVariants}>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              {software.name}
            </h2>
            <p className="text-lg text-gray-400 mt-2 font-medium">{software.tagline}</p>
          </motion.div>

          <motion.ul variants={listVariants} className="space-y-3">
            {software.bullets.map((bullet) => (
              <motion.li
                key={bullet}
                variants={listItemVariants}
                className="flex items-start gap-3 text-gray-200"
              >
                <span
                  className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${software.accent}20` }}
                >
                  <CheckIcon className="w-3 h-3" style={{ color: software.accent }} />
                </span>
                {bullet}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={textVariants}>
            <ExpandableSpecs specs={software.specs} accent={software.accent} />
          </motion.div>

          <motion.div variants={textVariants}>
            <a
              href={whatsappLinkFor(software.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3.5 text-sm font-bold text-[#052e13] hover:scale-105 hover:shadow-lg hover:shadow-whatsapp/30 transition-all"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Quiero este software
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={visualVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className={flip ? 'md:order-1' : ''}
        >
          <Mockup />
        </motion.div>
      </div>
    </section>
  )
}
