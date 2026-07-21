import { motion } from 'framer-motion'
import { VENTAJAS } from '../data/content.js'
import { textVariants, listVariants } from './motionVariants.js'
import { ClockIcon, CoinIcon, InfinityIcon, TrophyIcon } from './Icons.jsx'

const ICONS = {
  clock: ClockIcon,
  coin: CoinIcon,
  infinity: InfinityIcon,
  trophy: TrophyIcon,
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function VentajasSection() {
  return (
    <section
      id="ventajas"
      className="snap-section relative min-h-screen flex items-center bg-surface/40"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] rounded-full bg-accent/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-28 w-full">
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="text-center space-y-4 mb-14"
        >
          <motion.span
            variants={textVariants}
            className="inline-block rounded-full px-4 py-1.5 bg-accent/10 border border-accent/30 text-accent text-xs uppercase tracking-widest font-semibold"
          >
            {VENTAJAS.eyebrow}
          </motion.span>
          <motion.h2
            variants={textVariants}
            className="text-4xl md:text-5xl font-black tracking-tight text-white"
          >
            {VENTAJAS.heading}
          </motion.h2>
          <motion.p variants={textVariants} className="text-gray-400 max-w-2xl mx-auto">
            {VENTAJAS.subtext}
          </motion.p>
        </motion.div>

        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {VENTAJAS.cards.map((card) => {
            const Icon = ICONS[card.icon]
            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                whileHover={{ scale: 1.04, y: -4 }}
                className="rounded-2xl p-6 bg-white/5 border border-white/10 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-xs uppercase tracking-widest text-accent2 font-semibold mb-2">
                  {card.kicker}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
