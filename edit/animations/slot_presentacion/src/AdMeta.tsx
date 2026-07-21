import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
} from 'remotion';
import {C, FONT, gradAccent, Galaxy, LogoMark, Wordmark, Badge, PIcon, pop, rise, useT} from './Presentacion';
import wordsA from './wordsA.json';

// ---------- timeline (30 fps) ----------
export const DUR_AD = 1160;
const FB = 337;   // cut to real screen recording ("Mirá, así es como funciona")
const FS = 667;   // suite de softwares
const FC = 860;   // CTA ("Dejame un mensaje")
const FO = 994;   // voice ends → brand outro

type W = {cs: number; ce: number; w: string};
const WORDS = wordsA as W[];

// ---------- caption chunks (≤2 words, break at punctuation) ----------
const CHUNKS: W[][] = (() => {
  const out: W[][] = [];
  let cur: W[] = [];
  for (const w of WORDS) {
    cur.push(w);
    const endP = /[.?!:,]$/.test(w.w);
    if (cur.length >= 2 || endP) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
})();
const KEY = new Set(['AUTOMÁTICO', 'CLIENTES', 'LICENCIA', 'SOFTWARE', 'HERRAMIENTA', '2.000', '3.000', 'MENSAJE', 'MARKETING']);
const disp = (w: string) => {
  const m: Record<string, string> = {'dos mil': '2.000', 'tres mil': '3.000'};
  const base = m[w] ?? w;
  return base.toUpperCase();
};
const clean = (w: string) => disp(w).replace(/[.,:]$/, '');

const Captions: React.FC = () => {
  const {frame} = useT();
  if (frame >= FO) return null;
  const chunk = CHUNKS.find((ch) => frame >= ch[0].cs && frame < (ch[ch.length - 1].ce + 6));
  if (!chunk) return null;
  const aIdx = Math.max(0, chunk.findIndex((w, i) => frame >= w.cs && (i === chunk.length - 1 || frame < chunk[i + 1].cs)));
  const inO = interpolate(frame, [chunk[0].cs, chunk[0].cs + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1560, display: 'flex',
      justifyContent: 'center', opacity: inO}}>
      <div style={{display: 'flex', gap: 46, alignItems: 'baseline'}}>
        {chunk.map((w, i) => {
          const active = i === aIdx;
          const kw = KEY.has(clean(w.w));
          const grow = active ? interpolate(frame, [w.cs, w.cs + 3], [1.0, 1.16], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
          return (
            <span key={i} style={{fontFamily: FONT, fontWeight: 800, fontSize: 82,
              color: active ? C.orange2 : kw ? C.cyan : '#fff',
              transform: `scale(${grow})`, display: 'inline-block',
              textShadow: '0 4px 18px rgba(0,0,0,.95), 0 0 3px rgba(0,0,0,.9)',
              letterSpacing: 0.5}}>
              {disp(w.w)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const TopBrand: React.FC = () => (
  <div style={{position: 'absolute', top: 70, left: 0, right: 0, display: 'flex',
    justifyContent: 'center', alignItems: 'center', gap: 20}}>
    <LogoMark size={54} />
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.text}}>
      MKT <span style={{background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>BATTISTON</span>
    </div>
  </div>
);

// ---------- section 1: talking head ----------
const SecA: React.FC = () => {
  const {frame, fps} = useT();
  const inS = pop(frame, fps, 2);
  let punch = 0;
  for (const p of [146, 274]) if (frame >= p) punch += 0.06 * Math.exp(-(frame - p) / 7);
  const oOut = interpolate(frame, [FB - 8, FB], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', opacity: oOut}}>
      <div style={{marginTop: 200, width: 980, height: 1290, borderRadius: 36, overflow: 'hidden',
        border: `2px solid ${C.border}`, boxShadow: '0 40px 80px -40px rgba(0,0,0,.9)',
        transform: `scale(${(0.94 + 0.06 * inS) * (1 + punch)})`, opacity: inS}}>
        <Sequence from={6} layout="none">
          <OffthreadVideo muted src={staticFile('vidA30.mp4')} trimBefore={6}
            style={{width: 980, height: 1290, objectFit: 'cover'}} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ---------- section 2: real product screen recording ----------
const Chip: React.FC<{children: React.ReactNode; delay: number; x: number; y: number}> = ({children, delay, x, y}) => {
  const {frame, fps} = useT();
  const s = pop(frame, fps, delay);
  if (s <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`,
      display: 'flex', alignItems: 'center', gap: 14, background: '#0c0f14ee',
      border: `1.5px solid ${C.border}`, borderRadius: 999, padding: '18px 32px'}}>
      <svg viewBox="0 0 24 24" width={34} height={34}>
        <circle cx="12" cy="12" r="11" fill={`${C.whatsapp}33`} />
        <path d="M7 12.5l3.2 3.2L17 9" stroke={C.whatsapp} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 32, color: '#fff'}}>{children}</span>
    </div>
  );
};

const SecB: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - FB;
  const inS = pop(f, fps, 0);
  const oOut = interpolate(frame, [FS - 8, FS], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const panX = interpolate(frame, [FB, FS], [0, -420], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const zoomV = interpolate(frame, [FB, FS], [1.06, 1.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // counter: 2.000 → 3.000 landing on "tres mil" (frame 607)
  const val = Math.round(interpolate(frame, [594, 607], [2000, 3000], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - (1 - t) ** 3,
  }));
  const landPulse = frame >= 607 ? 1 + 0.1 * Math.exp(-(frame - 607) / 6) : 1;
  const cIn = pop(f, fps, 560 - FB);
  return (
    <AbsoluteFill style={{opacity: Math.min(inS, oOut) as number}}>
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center',
        fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.text, opacity: rise(f, fps, 4)}}>
        El software <span style={{color: C.cyan}}>real</span>, funcionando
      </div>
      <div style={{position: 'absolute', top: 320, left: 40, width: 1000, borderRadius: 30,
        padding: 8, background: gradAccent, boxShadow: `0 0 80px ${C.orange}44`,
        transform: `scale(${0.92 + 0.08 * inS}) rotate(${-1.2 + 0.4 * Math.sin(f / 45)}deg)`}}>
        <div style={{borderRadius: 24, overflow: 'hidden', width: 984, height: 620, background: '#000'}}>
          <Sequence from={FB} layout="none">
            <OffthreadVideo muted src={staticFile('demoB.mp4')}
              style={{width: 1500, height: 844, transform: `translateX(${panX}px) scale(${zoomV})`,
                transformOrigin: 'top left'}} />
          </Sequence>
        </div>
      </div>
      <Chip delay={FB - FB + 22} x={90} y={1010}>Perfiles trabajando solos</Chip>
      <Chip delay={FB - FB + 95} x={430} y={1120}>Mensajes enviados en automático</Chip>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex',
        justifyContent: 'center', transform: `scale(${cIn * landPulse})`, opacity: cIn}}>
        <div style={{background: '#0c0f14ee', border: `1.5px solid ${C.border}`, borderRadius: 28,
          padding: '30px 60px', textAlign: 'center'}}>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 96,
            background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>
            {val.toLocaleString('es-AR')}
          </div>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.muted, marginTop: 4}}>
            PERSONAS INTERESADAS POR DÍA
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- section 3: suite for businesses ----------
const NAMES = ['Software de Instagram', 'Software de Facebook', 'WhatsApp Pro', 'TikPro', 'Software de YouTube'];
const KEYS = ['ig', 'fb', 'wa', 'tk', 'yt'];
const GRADS = [
  'linear-gradient(135deg,#f472b6,#a855f7)',
  'linear-gradient(135deg,#3b82f6,#1e3a8a)',
  'linear-gradient(135deg,#34d399,#065f46)',
  'linear-gradient(135deg,#22d3ee,#0e2a3a)',
  'linear-gradient(135deg,#ef4444,#7f1d1d)',
];
const SecS: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - FS;
  const oOut = interpolate(frame, [FC - 8, FC], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', opacity: oOut}}>
      <div style={{marginTop: 230, textAlign: 'center', opacity: rise(f, fps, 2)}}>
        <div style={{fontFamily: FONT, fontSize: 34, fontWeight: 800, color: C.orange2,
          textTransform: 'uppercase', letterSpacing: 4}}>Para empresas y negocios</div>
        <div style={{fontFamily: FONT, fontSize: 62, fontWeight: 800, color: C.text, marginTop: 12}}>
          5 softwares de <span style={{background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>automatización</span>
        </div>
      </div>
      <div style={{marginTop: 60, width: 880}}>
        {NAMES.map((n, i) => {
          const s = pop(f, fps, 14 + i * 9);
          return (
            <div key={n} style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 26,
              background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 22,
              padding: '20px 34px', opacity: s,
              transform: `translateX(${(1 - s) * 200}px)`}}>
              <div style={{width: 92, height: 92, borderRadius: 20, background: GRADS[i],
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <div style={{transform: 'scale(0.42)', width: 150, height: 150, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'}}><PIcon k={KEYS[i]} /></div>
              </div>
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.text}}>{n}</div>
              <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: FONT, fontSize: 26, color: C.muted}}>
                <div style={{width: 12, height: 12, borderRadius: 6, background: C.whatsapp,
                  boxShadow: `0 0 10px ${C.whatsapp}`}} />
                Activo
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- section 4: CTA + outro ----------
const WaButton: React.FC<{scale: number}> = ({scale}) => (
  <div style={{transform: `scale(${scale})`, display: 'flex', alignItems: 'center', gap: 20,
    background: C.whatsapp, padding: '28px 52px', borderRadius: 999,
    boxShadow: `0 0 70px ${C.whatsapp}66`}}>
    <svg viewBox="0 0 24 24" width={48} height={48}>
      <path fill="#062b16" d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
      <path fill="#062b16" d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 40, color: '#04220f'}}>
      Quiero hablar con un asesor
    </div>
  </div>
);

const SecC: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - FC;
  const oOut = interpolate(frame, [FO - 8, FO], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 1 + 0.03 * Math.sin(f / 5);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: oOut}}>
      <div style={{width: 900, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 92,
        lineHeight: 1.1, color: C.text, transform: `scale(${pop(f, fps, 4)})`}}>
        DEJAME UN <span style={{background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>MENSAJE</span>
      </div>
      <div style={{marginTop: 40, fontFamily: FONT, fontSize: 40, color: C.muted, opacity: rise(f, fps, 16)}}>
        y te enseño cómo instalarlo en tu negocio
      </div>
      <div style={{marginTop: 70, opacity: rise(f, fps, 26)}}>
        <WaButton scale={pop(f, fps, 26) * pulse} />
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const {frame, fps} = useT();
  const f = frame - FO;
  const pulse = 1 + 0.03 * Math.sin(f / 6);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${pop(f, fps, 2)})`}}><LogoMark size={130} /></div>
      <div style={{marginTop: 44, opacity: rise(f, fps, 10)}}><Wordmark size={82} /></div>
      <div style={{marginTop: 34, transform: `scale(${pop(f, fps, 18)})`}}>
        <Badge>Únicos en Latinoamérica</Badge>
      </div>
      <div style={{marginTop: 56, width: 880, textAlign: 'center', fontFamily: FONT, fontWeight: 800,
        fontSize: 58, color: C.text, opacity: rise(f, fps, 24)}}>
        Automatizá tus redes sociales <span style={{background: gradAccent, WebkitBackgroundClip: 'text', color: 'transparent'}}>hoy</span>
      </div>
      <div style={{marginTop: 60, opacity: rise(f, fps, 34)}}>
        <WaButton scale={pop(f, fps, 34) * pulse} />
      </div>
      <div style={{marginTop: 38, fontFamily: FONT, fontSize: 34, color: C.cyan, fontWeight: 800,
        opacity: rise(f, fps, 46)}}>
        wa.me/54&thinsp;9&thinsp;385&thinsp;645&thinsp;6014
      </div>
    </AbsoluteFill>
  );
};

// ---------- root ----------
export const AdMeta: React.FC = () => {
  const {frame} = useT();
  return (
    <AbsoluteFill>
      <Galaxy />
      {frame < FB && <SecA />}
      {frame >= FB && frame < FS && <SecB />}
      {frame >= FS && frame < FC && <SecS />}
      {frame >= FC && frame < FO && <SecC />}
      {frame >= FO && <Outro />}
      {frame < FB && <TopBrand />}
      <Captions />
      <Sequence from={6} layout="none">
        <Audio src={staticFile('vozA.wav')} trimBefore={6} />
      </Sequence>
      <Audio src={staticFile('bed.wav')} volume={(f) => (f < FO ? 0.15 : 0.55)} />
      {[FB, FS, FC, FO].map((t) => (
        <Sequence key={t} from={t - 4} durationInFrames={26}>
          <Audio src={staticFile('whoosh.wav')} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
