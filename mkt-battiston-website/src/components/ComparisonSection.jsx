import { motion } from 'framer-motion'
import { COMPARISON, SOFTWARES } from '../data/content.js'
import { textVariants, listVariants } from './motionVariants.js'
import { PLATFORM_ICONS } from './Icons.jsx'

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const accentById = Object.fromEntries(SOFTWARES.map((s) => [s.id, s.accent]))

export default function ComparisonSection() {
  return (
    <section
      id="comparativa"
      className="snap-section relative min-h-screen flex items-center bg-surface/40"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[36rem] h-[16rem] rounded-full bg-accent2/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-28 w-full">
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="text-center space-y-4 mb-12"
        >
          <motion.span
            variants={textVariants}
            className="inline-block rounded-full px-4 py-1.5 bg-accent/10 border border-accent/30 text-accent text-xs uppercase tracking-widest font-semibold"
          >
            {COMPARISON.eyebrow}
          </motion.span>
          <motion.h2
            variants={textVariants}
            className="text-4xl md:text-5xl font-black tracking-tight text-white"
          >
            {COMPARISON.heading}
          </motion.h2>
          <motion.p variants={textVariants} className="text-gray-400">
            {COMPARISON.subtext}
          </motion.p>
        </motion.div>

        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="w-full overflow-x-auto rounded-xl border border-white/10"
        >
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-white/5 text-xs uppercase tracking-widest text-gray-400">
                <th className="px-5 py-4 font-semibold">Software</th>
                <th className="px-5 py-4 font-semibold">Red social</th>
                <th className="px-5 py-4 font-semibold">Ideal para</th>
                <th className="px-5 py-4 font-semibold">Foco principal</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.map((row, i) => {
                const Icon = PLATFORM_ICONS[row.id]
                const accent = accentById[row.id]
                return (
                  <motion.tr
                    key={row.id}
                    variants={rowVariants}
                    className={`border-t border-white/5 hover:bg-accent/5 transition-colors cursor-pointer ${
                      i % 2 === 1 ? 'bg-white/[0.02]' : ''
                    }`}
                    onClick={() => {
                      document.getElementById(row.id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <td className="px-5 py-4">
                      <a
                        href={`#${row.id}`}
                        className="flex items-center gap-3 font-semibold text-white hover:text-accent transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${accent}20`, color: accent }}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                        </span>
                        {row.software}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{row.red}</td>
                    <td className="px-5 py-4 text-gray-400">{row.ideal}</td>
                    <td className="px-5 py-4 text-gray-400">{row.foco}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
