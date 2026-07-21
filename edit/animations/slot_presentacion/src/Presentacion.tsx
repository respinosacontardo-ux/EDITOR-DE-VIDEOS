import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ---------- MKT BATTISTON design tokens (from styles.css of the site) ----------
export const C = {
  bg: '#07070c',
  surface: '#131319',
  surface2: '#191921',
  border: '#232330',
  text: '#f5f5f7',
  muted: '#9a9aa8',
  orange: '#ff5a1f',
  orange2: '#ff8a3d',
  cyan: '#22d3ee',
  whatsapp: '#25d366',
};
export const FONT = 'Liberation Sans, Arial, sans-serif';
export const gradAccent = `linear-gradient(135deg, ${C.orange}, ${C.orange2})`;

// ---------- timeline (30 fps) ----------
export const DUR = 1700;
const S2 = 150, S3 = 255, S4 = 435, S5 = 1035, S6 = 1455;
const SOFT_LEN = 120;

// ---------- helpers ----------
export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {frame, fps};
};
export const pop = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 140, mass: 0.7}});
export const rise = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 120}});

// ---------- galaxy background (like the site's canvas) ----------
const mulberry = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const STARS = (() => {
  const rnd = mulberry(42);
  return Array.from({length: 130}, () => ({
    x: rnd() * 1080, y: rnd() * 1920,
    r: 0.8 + rnd() * 1.8, tw: 2 + rnd() * 4, ph: rnd() * Math.PI * 2,
    drift: 4 + rnd() * 10,
  }));
})();

export const Galaxy: React.FC = () => {
  const {frame} = useT();
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 900, height: 900, left: -250, top: -200, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.orange}22, transparent 65%)`}} />
      <div style={{position: 'absolute', width: 800, height: 800, right: -300, top: 700, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.cyan}1a, transparent 65%)`}} />
      {STARS.map((s, i) => {
        const o = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin((frame / 30) * (Math.PI * 2 / s.tw) + s.ph));
        const y = (s.y + frame / s.drift) % 1920;
        return <div key={i} style={{position: 'absolute', left: s.x, top: y, width: s.r * 2, height: s.r * 2,
          borderRadius: '50%', background: '#fff', opacity: o * 0.8}} />;
      })}
    </AbsoluteFill>
  );
};

// ---------- shared atoms ----------
export const LogoMark: React.FC<{size?: number}> = ({size = 64}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.28, background: gradAccent,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 0 ${size * 0.6}px ${C.orange}66`}}>
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62}>
      <path fill="#fff" d="M12 3a1 1 0 0 1 1 1v1.06a7.5 7.5 0 0 1 6.44 6.44H20.5a1 1 0 1 1 0 2h-1.06a7.5 7.5 0 0 1-6.44 6.44V21a1 1 0 1 1-2 0v-1.06A7.5 7.5 0 0 1 4.56 13.5H3.5a1 1 0 1 1 0-2h1.06A7.5 7.5 0 0 1 11 5.06V4a1 1 0 0 1 1-1zm0 4.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm0 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
    </svg>
  </div>
);

export const Wordmark: React.FC<{size?: number}> = ({size = 84}) => (
  <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: -1, color: C.text}}>
    MKT{' '}
    <span style={{background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>BATTISTON</span>
  </div>
);

export const Badge: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 30px',
    borderRadius: 999, border: `1.5px solid ${C.border}`, background: '#13131988',
    fontFamily: FONT, fontSize: 30, color: C.muted}}>
    <div style={{width: 14, height: 14, borderRadius: 7, background: C.whatsapp,
      boxShadow: `0 0 12px ${C.whatsapp}`}} />
    {children}
  </div>
);

// ---------- S1: intro ----------
const Intro: React.FC = () => {
  const {frame, fps} = useT();
  const out = interpolate(frame, [S2 - 18, S2], [0, -120], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const oOut = interpolate(frame, [S2 - 15, S2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: oOut, transform: `translateY(${out}px)`}}>
      <div style={{transform: `scale(${pop(frame, fps, 5)})`}}><LogoMark size={170} /></div>
      <div style={{marginTop: 55, opacity: rise(frame, fps, 15), transform: `translateY(${(1 - rise(frame, fps, 15)) * 60}px)`}}>
        <Wordmark size={104} />
      </div>
      <div style={{marginTop: 42, transform: `scale(${pop(frame, fps, 32)})`}}>
        <Badge>Únicos en Latinoamérica</Badge>
      </div>
      <div style={{marginTop: 48, width: 860, textAlign: 'center', fontFamily: FONT, fontSize: 44,
        lineHeight: 1.35, color: C.text, opacity: rise(frame, fps, 48),
        transform: `translateY(${(1 - rise(frame, fps, 48)) * 40}px)`}}>
        Software de automatización con{' '}
        <span style={{color: C.cyan, fontWeight: 800}}>Inteligencia Artificial</span>{' '}
        para redes sociales
      </div>
    </AbsoluteFill>
  );
};

// ---------- S2: stats ----------
const STATS = [
  {v: '24/7', l: 'Operación'},
  {v: '100%', l: 'Automatizado'},
  {v: '5+', l: 'Softwares'},
];
const Stats: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - S2;
  const oOut = interpolate(f, [S3 - S2 - 12, S3 - S2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: oOut}}>
      <div style={{display: 'flex', gap: 46}}>
        {STATS.map((s, i) => (
          <div key={s.l} style={{width: 300, padding: '54px 0', textAlign: 'center',
            background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 24,
            transform: `scale(${pop(f, fps, 6 + i * 9)})`}}>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 78,
              background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>{s.v}</div>
            <div style={{fontFamily: FONT, fontSize: 32, color: C.muted, marginTop: 10}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop: 70, width: 880, textAlign: 'center', fontFamily: FONT, fontSize: 42,
        lineHeight: 1.4, color: C.text, opacity: rise(f, fps, 26)}}>
        Como tener un <span style={{color: C.orange2, fontWeight: 800}}>equipo de marketing completo</span>{' '}
        trabajando para tu negocio
      </div>
    </AbsoluteFill>
  );
};

// ---------- S3: ventajas ----------
const ADV = [
  {stat: '10x', sub: 'más rápido', title: 'Ahorra Tiempo'},
  {stat: '80%', sub: 'menos costo', title: 'Ahorra Dinero'},
  {stat: '100%', sub: 'automatizado', title: 'Presencia 24/7'},
  {stat: 'N°1', sub: 'en Latinoamérica', title: 'Únicos en LATAM'},
];
const Ventajas: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - S3;
  const oOut = interpolate(f, [S4 - S3 - 12, S4 - S3], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: oOut}}>
      <div style={{fontFamily: FONT, fontSize: 34, color: C.orange2, fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: 4, opacity: rise(f, fps, 2)}}>Por qué elegirnos</div>
      <div style={{fontFamily: FONT, fontSize: 64, fontWeight: 800, color: C.text, marginTop: 16,
        marginBottom: 60, opacity: rise(f, fps, 6)}}>
        Ventajas de MKT <span style={{background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>BATTISTON</span>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, width: 900}}>
        {ADV.map((a, i) => {
          const s = pop(f, fps, 14 + i * 10);
          return (
            <div key={a.title} style={{background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 24, padding: '44px 40px',
              transform: `translateY(${(1 - s) * 90}px) scale(${0.9 + 0.1 * s})`, opacity: s}}>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.orange}}>
                {a.stat}{' '}<span style={{fontSize: 30, color: C.muted, fontWeight: 400}}>{a.sub}</span>
              </div>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.text, marginTop: 12}}>{a.title}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- S4: softwares ----------
export const PIcon: React.FC<{k: string}> = ({k}) => {
  const sw = {strokeWidth: 1.6, stroke: '#fff', fill: 'none' as const};
  return (
    <svg viewBox="0 0 24 24" width={150} height={150}>
      {k === 'yt' && <>
        <path d="M9 8l7 4-7 4V8z" fill="#fff" />
        <rect x="2" y="5" width="20" height="14" rx="4" {...sw} />
      </>}
      {k === 'tk' && <path fill="#fff" d="M14 3v9.5a2.5 2.5 0 1 1-2-2.45V8a4.5 4.5 0 1 0 4 4.47V8.5a5.5 5.5 0 0 0 3 .9V7.4A3.5 3.5 0 0 1 15.5 3H14z" />}
      {k === 'wa' && <>
        <path fill="#fff" d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
        <path fill="#fff" d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
      </>}
      {k === 'fb' && <path fill="#fff" d="M14 9h2.5V6h-2.5c-1.9 0-3.5 1.6-3.5 3.5V11H8.5v3H10.5V21h3V14h2.4l.6-3H13.5V9.5c0-.3.2-.5.5-.5z" />}
      {k === 'ig' && <>
        <rect x="3" y="3" width="18" height="18" rx="5" {...sw} />
        <circle cx="12" cy="12" r="4.2" {...sw} />
        <circle cx="17.2" cy="6.8" r="1.1" fill="#fff" />
      </>}
    </svg>
  );
};

export const SOFT = [
  {k: 'ig', name: 'Software de Instagram', tag: 'Dominá Instagram con IA',
    grad: 'linear-gradient(135deg,#f472b6,#a855f7)',
    feats: ['Gestión automática de cuentas', 'Publicación automática en el perfil', 'Interacción con feed, Reels y DMs']},
  {k: 'fb', name: 'Software de Facebook', tag: 'Automatización inteligente para Facebook',
    grad: 'linear-gradient(135deg,#3b82f6,#1e3a8a)',
    feats: ['Gestión automática de cuentas', 'Publicación en perfil y grupos', 'Interacción con newsfeed y fanpages']},
  {k: 'wa', name: 'WhatsApp Pro', tag: 'Marketing automatizado en WhatsApp',
    grad: 'linear-gradient(135deg,#34d399,#065f46)',
    feats: ['Envío masivo de mensajes', 'Gestión de grupos y comunidades', 'Canales de difusión con administración']},
  {k: 'tk', name: 'TikPro', tag: 'Automatización profesional para TikTok',
    grad: 'linear-gradient(135deg,#22d3ee,#0e2a3a)',
    feats: ['Gestión masiva de cuentas TikTok', 'Auto-deslizar, ver y comentar', 'Funciones virales y seeding']},
  {k: 'yt', name: 'Software de YouTube', tag: 'Automatización completa para YouTube',
    grad: 'linear-gradient(135deg,#ef4444,#7f1d1d)',
    feats: ['Múltiples cuentas en una interfaz', 'Publicación automática de videos', 'Siembra de vistas y comentarios']},
];

const SoftCard: React.FC<{s: typeof SOFT[0]; f: number; fps: number}> = ({s, f, fps}) => {
  const inS = pop(f, fps, 0);
  const oOut = interpolate(f, [SOFT_LEN - 10, SOFT_LEN], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const xOut = interpolate(f, [SOFT_LEN - 10, SOFT_LEN], [0, -160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{width: 880, borderRadius: 28, overflow: 'hidden', background: C.surface,
      border: `1.5px solid ${C.border}`, opacity: Math.min(inS, oOut) as number,
      transform: `translateX(${(1 - inS) * 260 + xOut}px) scale(${0.94 + 0.06 * inS})`,
      boxShadow: '0 30px 60px -30px rgba(0,0,0,.8)'}}>
      <div style={{height: 340, background: s.grad, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${pop(f, fps, 6)})`}}><PIcon k={s.k} /></div>
        <div style={{position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 10,
          background: '#0009', padding: '10px 22px', borderRadius: 999, fontFamily: FONT, fontSize: 26, color: '#fff'}}>
          <div style={{width: 12, height: 12, borderRadius: 6, background: C.whatsapp, boxShadow: `0 0 10px ${C.whatsapp}`}} />
          Activo
        </div>
      </div>
      <div style={{padding: '44px 48px 50px'}}>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.text}}>{s.name}</div>
        <div style={{fontFamily: FONT, fontSize: 34, color: C.orange2, marginTop: 10}}>{s.tag}</div>
        <div style={{marginTop: 30}}>
          {s.feats.map((ft, i) => {
            const fs = rise(f, fps, 16 + i * 8);
            return (
              <div key={ft} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 18,
                opacity: fs, transform: `translateX(${(1 - fs) * 60}px)`}}>
                <svg viewBox="0 0 24 24" width={34} height={34}>
                  <circle cx="12" cy="12" r="11" fill={`${C.orange}33`} />
                  <path d="M7 12.5l3.2 3.2L17 9" stroke={C.orange2} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{fontFamily: FONT, fontSize: 34, color: C.text}}>{ft}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Softwares: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - S4;
  const idx = Math.min(SOFT.length - 1, Math.floor(f / SOFT_LEN));
  const fLocal = f - idx * SOFT_LEN;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', top: 130, textAlign: 'center', width: '100%'}}>
        <div style={{fontFamily: FONT, fontSize: 32, color: C.orange2, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: 4}}>Nuestros softwares</div>
        <div style={{fontFamily: FONT, fontSize: 58, fontWeight: 800, color: C.text, marginTop: 10}}>
          Suite de <span style={{background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>Automatización</span>
        </div>
        <div style={{display: 'flex', gap: 14, justifyContent: 'center', marginTop: 26}}>
          {SOFT.map((_, i) => (
            <div key={i} style={{width: i === idx ? 46 : 14, height: 14, borderRadius: 7,
              background: i === idx ? C.orange : C.border, transition: 'none'}} />
          ))}
        </div>
      </div>
      <div style={{marginTop: 120}}>
        <SoftCard s={SOFT[idx]} f={fLocal} fps={fps} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- S5: demo video ----------
const Demo: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - S5;
  const inS = pop(f, fps, 2);
  const oOut = interpolate(f, [S6 - S5 - 12, S6 - S5], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: oOut}}>
      <div style={{position: 'absolute', top: 150, textAlign: 'center', width: '100%',
        opacity: rise(f, fps, 4)}}>
        <div style={{fontFamily: FONT, fontSize: 58, fontWeight: 800, color: C.text}}>
          Mirá cómo <span style={{color: C.cyan}}>funciona</span>
        </div>
      </div>
      <div style={{marginTop: 40, borderRadius: 44, padding: 10, background: gradAccent,
        boxShadow: `0 0 90px ${C.orange}55`, transform: `scale(${0.9 + 0.1 * inS})`, opacity: inS}}>
        <div style={{borderRadius: 36, overflow: 'hidden', width: 760, height: 1240, background: '#000'}}>
          <Sequence from={S5} layout="none">
            <OffthreadVideo
              src={staticFile('demo30.mp4')}
              trimBefore={Math.round(8.6 * 30)}
              trimAfter={Math.round(22.4 * 30)}
              style={{width: 760, height: 1240, objectFit: 'cover'}}
            />
          </Sequence>
        </div>
      </div>
      <div style={{marginTop: 44, fontFamily: FONT, fontSize: 40, fontWeight: 800, color: C.text,
        opacity: rise(f, fps, 20)}}>
        De <span style={{color: C.orange2}}>1.000 a 3.000 mensajes</span> por día, en automático
      </div>
    </AbsoluteFill>
  );
};

// ---------- S6: CTA ----------
const CTA: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - S6;
  const pulse = 1 + 0.03 * Math.sin(f / 6);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${pop(f, fps, 2)})`}}><LogoMark size={120} /></div>
      <div style={{marginTop: 44, opacity: rise(f, fps, 10)}}><Wordmark size={76} /></div>
      <div style={{marginTop: 60, width: 900, textAlign: 'center', fontFamily: FONT, fontWeight: 800,
        fontSize: 74, lineHeight: 1.15, color: C.text, opacity: rise(f, fps, 18),
        transform: `translateY(${(1 - rise(f, fps, 18)) * 50}px)`}}>
        Automatizá tus redes sociales <span style={{background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>hoy</span>
      </div>
      <div style={{marginTop: 40, width: 820, textAlign: 'center', fontFamily: FONT, fontSize: 38,
        color: C.muted, opacity: rise(f, fps, 28)}}>
        Contanos qué negocio tenés y te ayudamos a elegir el software ideal, sin compromiso.
      </div>
      <div style={{marginTop: 64, transform: `scale(${(pop(f, fps, 38) * pulse)})`,
        display: 'flex', alignItems: 'center', gap: 22, background: C.whatsapp,
        padding: '30px 56px', borderRadius: 999, boxShadow: `0 0 70px ${C.whatsapp}66`}}>
        <svg viewBox="0 0 24 24" width={52} height={52}>
          <path fill="#062b16" d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
          <path fill="#062b16" d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
        </svg>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: '#04220f'}}>
          Quiero hablar con un asesor
        </div>
      </div>
      <div style={{marginTop: 40, fontFamily: FONT, fontSize: 36, color: C.cyan, fontWeight: 800,
        opacity: rise(f, fps, 55)}}>
        wa.me/54&thinsp;9&thinsp;385&thinsp;645&thinsp;6014
      </div>
    </AbsoluteFill>
  );
};

// ---------- root composition ----------
export const Presentacion: React.FC = () => {
  const {frame} = useT();
  const WHOOSH = [S2, S3, S4, S4 + SOFT_LEN, S4 + SOFT_LEN * 2, S4 + SOFT_LEN * 3, S4 + SOFT_LEN * 4, S5, S6];
  return (
    <AbsoluteFill>
      <Galaxy />
      {frame < S2 && <Intro />}
      {frame >= S2 && frame < S3 && <Stats />}
      {frame >= S3 && frame < S4 && <Ventajas />}
      {frame >= S4 && frame < S5 && <Softwares />}
      {frame >= S5 && frame < S6 && <Demo />}
      {frame >= S6 && <CTA />}
      <Audio src={staticFile('bed.wav')} volume={(f) => (f > S5 - 5 && f < S6 ? 0.35 : 1)} />
      {WHOOSH.map((t) => (
        <Sequence key={t} from={t - 4} durationInFrames={26}>
          <Audio src={staticFile('whoosh.wav')} volume={0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
