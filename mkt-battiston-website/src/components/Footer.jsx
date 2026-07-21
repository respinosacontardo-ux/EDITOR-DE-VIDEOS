import { FOOTER, WHATSAPP_LINK } from '../data/content.js'
import { WhatsAppIcon } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="snap-section border-t border-white/5 bg-base py-14">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-5">
        <div className="font-black text-xl tracking-tight text-white">
          MKT <span className="text-accent">BATTISTON</span>
        </div>
        <p className="text-sm text-gray-500">{FOOTER.tagline}</p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-whatsapp hover:underline"
        >
          <WhatsAppIcon className="w-4 h-4" />
          +54 9 385 645-6014
        </a>
        <p className="text-xs text-gray-600">{FOOTER.copyright}</p>
      </div>
    </footer>
  )
}
