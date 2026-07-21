import { useState } from 'react'
import { motion } from 'framer-motion'
import { NAV_LINKS, WHATSAPP_LINK } from '../data/content.js'
import { WhatsAppIcon } from './Icons.jsx'

export default function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled
          ? 'bg-base/85 backdrop-blur-lg border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center px-5 md:px-8 py-4 max-w-7xl mx-auto">
        <a href="#inicio" className="font-black text-lg md:text-xl tracking-tight text-white">
          MKT <span className="text-accent">BATTISTON</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-bold text-[#052e13] hover:scale-105 hover:shadow-lg hover:shadow-whatsapp/30 transition-all"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Empezar Ahora
          </a>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menú"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-base/95 backdrop-blur-lg border-t border-white/5 px-5 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-bold text-[#052e13]"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Empezar Ahora
          </a>
        </nav>
      )}
    </motion.header>
  )
}
