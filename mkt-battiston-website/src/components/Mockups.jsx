import { motion } from 'framer-motion'
import {
  YouTubeIcon,
  TikTokIcon,
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
} from './Icons.jsx'

function Window({ children, accent, title }) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-surface/80 backdrop-blur overflow-hidden shadow-2xl"
      style={{ boxShadow: `0 0 80px -20px ${accent}55` }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 text-[10px] uppercase tracking-widest text-gray-400">{title}</span>
      </div>
      {children}
    </div>
  )
}

function PulseDot({ color = '#22c55e' }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
    </span>
  )
}

function Bar({ w, color }) {
  return <div className={`h-1.5 rounded-full ${w}`} style={{ backgroundColor: color || 'rgba(255,255,255,0.12)' }} />
}

/* ---------- YouTube: multi-account dashboard with upload queue ---------- */
export function YouTubeMockup() {
  const accounts = ['Canal Principal', 'Canal Shorts', 'Canal Marca', 'Canal Ventas']
  return (
    <Window accent="#FF0000" title="YouTube Manager">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <YouTubeIcon className="w-5 h-5 text-[#FF0000]" />
          <span className="font-semibold">4 cuentas conectadas</span>
          <PulseDot />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {accounts.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              viewport={{ once: false }}
              className="rounded-lg bg-white/5 border border-white/10 p-2.5 space-y-1.5"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-orange-400" />
                <span className="text-[10px] text-gray-200 font-medium truncate">{name}</span>
              </div>
              <Bar w="w-full" />
              <Bar w="w-2/3" />
              <div className="flex justify-between text-[9px] text-gray-400">
                <span>Subiendo…</span>
                <span className="text-green-400">Activo</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
          <div className="flex justify-between text-[10px] text-gray-300 mb-1.5">
            <span>Cola de publicación</span>
            <span className="text-red-400 font-semibold">12 videos</span>
          </div>
          <motion.div
            className="h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400"
            initial={{ width: '10%' }}
            whileInView={{ width: '78%' }}
            transition={{ duration: 2, ease: 'easeOut' }}
            viewport={{ once: false }}
          />
        </div>
      </div>
    </Window>
  )
}

/* ---------- TikTok: vertical phone with pulsing engagement ---------- */
export function TikTokMockup() {
  return (
    <div className="flex justify-center">
      <div
        className="relative w-52 md:w-60 rounded-[2.2rem] border-4 border-white/15 bg-black overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 0 90px -20px #22D3EE66' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-10 border-x border-b border-white/10" />
        <div className="aspect-[9/17] relative bg-gradient-to-b from-[#0e1b24] via-[#101828] to-[#1a0f2e] p-3 flex flex-col justify-end">
          <div className="absolute top-8 left-0 right-0 flex justify-center gap-4 text-[10px] text-gray-400">
            <span>Siguiendo</span>
            <span className="text-white font-semibold border-b border-white pb-0.5">Para Ti</span>
          </div>
          <motion.div
            className="absolute inset-x-6 top-16 bottom-24 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <TikTokIcon className="w-12 h-12 text-white/60" />
          </motion.div>
          <div className="absolute right-3 bottom-24 flex flex-col gap-4 items-center">
            {[
              { label: '128K', delay: 0 },
              { label: '4.2K', delay: 0.5 },
              { label: '891', delay: 1 },
            ].map(({ label, delay }) => (
              <motion.div
                key={label}
                className="flex flex-col items-center gap-0.5"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay }}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cyan-300 text-sm">
                  ♥
                </div>
                <span className="text-[9px] text-white">{label}</span>
              </motion.div>
            ))}
          </div>
          <div className="relative space-y-1.5 pb-3 pr-14">
            <Bar w="w-3/4" color="rgba(255,255,255,0.25)" />
            <Bar w="w-1/2" color="rgba(255,255,255,0.15)" />
            <div className="flex items-center gap-1.5 text-[9px] text-cyan-300">
              <PulseDot color="#22D3EE" />
              Auto-deslizando…
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- WhatsApp: chat bubbles sending in sequence ---------- */
export function WhatsAppMockup() {
  const messages = [
    { text: '¡Hola {nombre}! 👋 Tenemos una promo para tu negocio', out: true },
    { text: 'Enviado a 1.240 contactos ✓✓', out: true, meta: true },
    { text: '¡Me interesa! ¿Cómo funciona?', out: false },
    { text: 'Respuesta automática enviada 🤖', out: true, meta: true },
  ]
  return (
    <Window accent="#25D366" title="WhatsApp Pro — Difusión">
      <div className="p-4 bg-[#0b141a] space-y-2.5 min-h-[280px]">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <div className="w-8 h-8 rounded-full bg-whatsapp/20 flex items-center justify-center">
            <WhatsAppIcon className="w-4 h-4 text-whatsapp" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Campaña Masiva</div>
            <div className="flex items-center gap-1.5 text-[9px] text-whatsapp">
              <PulseDot color="#25D366" /> enviando en tiempo real
            </div>
          </div>
        </div>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.35, duration: 0.4 }}
            viewport={{ once: false }}
            className={`flex ${m.out ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-[11px] leading-snug ${
                m.meta
                  ? 'bg-transparent text-gray-500 italic'
                  : m.out
                    ? 'bg-[#005c4b] text-gray-100 rounded-br-sm'
                    : 'bg-[#202c33] text-gray-100 rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    </Window>
  )
}

/* ---------- Facebook: multi-window account cards managed in parallel ---------- */
export function FacebookMockup() {
  const cards = [
    { name: 'Cuenta Ventas', action: 'Publicando en 8 grupos' },
    { name: 'Cuenta Marca', action: 'Interactuando con fanpage' },
    { name: 'Cuenta Local', action: 'Enviando solicitudes' },
    { name: 'Cuenta Soporte', action: 'Respondiendo mensajes' },
  ]
  return (
    <Window accent="#1877F2" title="Facebook Multi-Cuenta">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <FacebookIcon className="w-5 h-5 text-[#4599ff]" />
          <span className="font-semibold">4 cuentas en paralelo</span>
          <PulseDot color="#4599ff" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              viewport={{ once: false }}
              className="rounded-lg bg-white/5 border border-white/10 p-2.5 space-y-1.5"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400" />
                <span className="text-[10px] text-gray-200 font-medium truncate">{c.name}</span>
              </div>
              <Bar w="w-full" />
              <div className="flex items-center gap-1 text-[9px] text-blue-300">
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
                />
                {c.action}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-gray-300">
          <span>Publicaciones hoy</span>
          <span className="font-bold text-blue-300">247</span>
        </div>
      </div>
    </Window>
  )
}

/* ---------- Instagram: grid/Reels with incrementing counters ---------- */
export function InstagramMockup() {
  return (
    <Window accent="#E1306C" title="Instagram Studio">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <InstagramIcon className="w-5 h-5 text-[#E1306C]" />
          <span className="font-semibold">@tu_negocio</span>
          <span className="ml-auto text-[10px] text-pink-300 flex items-center gap-1.5">
            <PulseDot color="#E1306C" /> IA activa
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              viewport={{ once: false }}
              className="aspect-square rounded-md bg-gradient-to-br border border-white/10"
              style={{
                backgroundImage: `linear-gradient(135deg, hsla(${300 + i * 12}, 70%, 55%, 0.35), hsla(${20 + i * 10}, 80%, 55%, 0.3))`,
              }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { n: '+2.4K', l: 'Me gusta' },
            { n: '+890', l: 'Comentarios' },
            { n: '+12K', l: 'Reels views' },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              className="rounded-lg bg-white/5 border border-white/10 py-2"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            >
              <div className="text-xs font-bold text-pink-300">{s.n}</div>
              <div className="text-[9px] text-gray-400">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Window>
  )
}

export const MOCKUPS = {
  youtube: YouTubeMockup,
  tiktok: TikTokMockup,
  whatsapp: WhatsAppMockup,
  facebook: FacebookMockup,
  instagram: InstagramMockup,
}
