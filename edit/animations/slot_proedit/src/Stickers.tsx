import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const ACCENT = '#2E86FF';

// Simple white stroke/fill icons, 100x100 viewBox
const ICONS: Record<string, React.ReactNode> = {
  casa: (
    <g fill="none" stroke="white" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
      <path d="M15 52 L50 20 L85 52" />
      <path d="M26 48 V85 H74 V48" />
      <rect x="43" y="62" width="14" height="23" fill="white" stroke="none" />
    </g>
  ),
  personas: (
    <g fill="white">
      <circle cx="35" cy="34" r="13" />
      <path d="M14 82 Q14 58 35 58 Q56 58 56 82 Z" />
      <circle cx="68" cy="38" r="10" />
      <path d="M54 82 Q56 62 68 62 Q84 62 84 82 Z" opacity="0.8" />
    </g>
  ),
  robot: (
    <g fill="none" stroke="white" strokeWidth={6} strokeLinecap="round">
      <rect x="22" y="34" width="56" height="44" rx="10" />
      <line x1="50" y1="34" x2="50" y2="20" />
      <circle cx="50" cy="16" r="5" fill="white" stroke="none" />
      <circle cx="38" cy="52" r="6" fill="white" stroke="none" />
      <circle cx="62" cy="52" r="6" fill="white" stroke="none" />
      <path d="M38 67 H62" />
    </g>
  ),
  avion: (
    <g fill="white">
      <path d="M12 50 L88 16 L64 84 L48 60 Z" />
      <path d="M48 60 L88 16 L52 50 Z" opacity="0.6" />
    </g>
  ),
  chat: (
    <g fill="white">
      <path d="M15 25 Q15 15 25 15 H75 Q85 15 85 25 V60 Q85 70 75 70 H45 L25 86 V70 H25 Q15 70 15 60 Z" />
      <circle cx="35" cy="43" r="5" fill={ACCENT} />
      <circle cx="50" cy="43" r="5" fill={ACCENT} />
      <circle cx="65" cy="43" r="5" fill={ACCENT} />
    </g>
  ),
  rayo: (
    <g fill="white">
      <path d="M56 8 L22 56 H44 L38 92 L76 42 H52 Z" />
    </g>
  ),
  dinero: (
    <g fill="none" stroke="white" strokeWidth={7} strokeLinecap="round">
      <circle cx="50" cy="50" r="34" />
      <path d="M62 38 Q50 30 42 38 Q34 46 46 50 Q60 54 54 63 Q46 70 38 63" />
      <line x1="50" y1="26" x2="50" y2="74" />
    </g>
  ),
};

export const Sticker: React.FC<{
  icon: keyof typeof ICONS;
  x: number; // % of width (center)
  y: number; // % of height (center)
  appearAt: number; // local frame
  hideAt?: number; // local frame (optional pop-out)
  size?: number;
  tilt?: number; // resting rotation deg
}> = ({icon, x, y, appearAt, hideAt, size = 170, tilt = -6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame: frame - appearAt, fps, config: {damping: 11, mass: 0.7}});
  const outS = hideAt
    ? spring({frame: frame - hideAt, fps, config: {damping: 200}})
    : 0;
  const s = Math.max(0, inS) * (1 - outS);
  if (s <= 0.001) return null;
  const float = Math.sin(((frame - appearAt) / fps) * Math.PI * 1.6) * 6;
  const rot = tilt + Math.sin(((frame - appearAt) / fps) * Math.PI * 1.1) * 3;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) translateY(${float}px) scale(${s}) rotate(${rot}deg)`,
        background: `linear-gradient(135deg, ${ACCENT} 0%, #1b5fd0 100%)`,
        borderRadius: 38,
        boxShadow: `0 18px 50px rgba(0,0,0,0.45), 0 0 60px ${ACCENT}44`,
        border: '4px solid rgba(255,255,255,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg viewBox="0 0 100 100" width="68%" height="68%">
        {ICONS[icon]}
      </svg>
    </div>
  );
};
