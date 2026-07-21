import { motion } from 'framer-motion'
import { FINAL_CTA, WHATSAPP_LINK } from '../data/content.js'
import { textVariants, listVariants } from './motionVariants.js'
import { WhatsAppIcon } from './Icons.jsx'

export default function FinalCTASection() {
  return (
    <section
      id="contacto"
      className="snap-section relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Glowing orb behind CTA */}
      <motion.div
        className="absolute w-[34rem] h-[34rem] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(34,211,238,0.12) 45%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-8 py-28"
      >
        <motion.h2
          variants={textVariants}
          className="text-4xl md:text-6xl font-black tracking-tight text-white text-glow"
        >
          {FINAL_CTA.heading}
        </motion.h2>
        <motion.p variants={textVariants} className="text-lg text-gray-400 max-w-xl mx-auto">
          {FINAL_CTA.subtext}
        </motion.p>
        <motion.div variants={textVariants}>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-whatsapp px-10 py-5 text-base md:text-lg font-bold text-[#052e13] hover:scale-105 transition-all shadow-xl shadow-whatsapp/25 hover:shadow-whatsapp/40"
          >
            <WhatsAppIcon className="w-6 h-6" />
            {FINAL_CTA.button}
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
