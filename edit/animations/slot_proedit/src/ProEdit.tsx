import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const ACCENT = '#2E86FF';
const FONT = "'Liberation Sans', 'DejaVu Sans', Arial, sans-serif";

// Timeline (30fps):
//  S1 HOOK     f0-199    v3 [0.30-6.95]  fullscreen + top chip
//  S2 DEMO     f200-415  v3 [6.95-14.15] video-in-card + title + checks
//  S3 BENEFIT  f416-637  v1 [8.96-16.36] fullscreen -> mini + counter -> fullscreen
//  S4 CTA      f638-791  v3 [23.42-28.56] fullscreen + bottom pill
//  S5 CARD     f792-896  end card
const S1_DUR = 200;
const S2_DUR = 216;
const S3_DUR = 222;
const S4_DUR = 154;
const S5_DUR = 105;

const vol = (dur: number) => (f: number) =>
  interpolate(f, [0, 2, dur - 2, dur], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const ZoomIn: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 6], [1.06, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

// ---------- S1: hook, fullscreen, small chip at very top (clear of the face)
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chipIn = spring({frame: frame - 20, fps, config: {damping: 14}});
  return (
    <ZoomIn>
      <OffthreadVideo
        src={staticFile('v3.mp4')}
        startFrom={9}
        endAt={9 + S1_DUR}
        volume={vol(S1_DUR)}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <div
        style={{
          position: 'absolute',
          top: '4.2%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.max(0, chipIn),
          transform: `translateY(${(1 - chipIn) * -40}px)`,
        }}
      >
        <div
          style={{
            background: 'rgba(10,10,12,0.72)',
            border: `3px solid ${ACCENT}`,
            color: 'white',
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: 2,
            padding: '16px 44px',
            borderRadius: 60,
          }}
        >
          EMPLEADO AUTOMÁTICO
        </div>
      </div>
    </ZoomIn>
  );
};

// ---------- S2: demo shrinks into a floating card, checks animate below
const CHECKS = ['Trabaja 24/7 por ti', 'Contacta clientes solo', '100% automático'];
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shrink = interpolate(frame, [0, 12], [1, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const scale = 1 - (1 - 0.74) * (1 - shrink);
  const ty = (1 - shrink) * -13;
  const titleIn = spring({frame: frame - 10, fps, config: {damping: 14}});
  return (
    <AbsoluteFill
      style={{background: 'radial-gradient(120% 90% at 50% 30%, #16181d 0%, #0a0a0c 70%)'}}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateY(${ty}%)`,
          borderRadius: 44 * (1 - shrink),
          overflow: 'hidden',
          boxShadow: `0 30px 90px rgba(0,0,0,${0.65 * (1 - shrink)})`,
        }}
      >
        <OffthreadVideo
          src={staticFile('v3.mp4')}
          startFrom={208}
          endAt={208 + S2_DUR}
          volume={vol(S2_DUR)}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: '4.5%',
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 58,
          color: 'white',
          letterSpacing: 1,
          opacity: Math.max(0, titleIn),
          transform: `translateY(${(1 - titleIn) * -50}px)`,
        }}
      >
        MI <span style={{color: ACCENT}}>EMPLEADO DIGITAL</span>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '3.5%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        {CHECKS.map((c, i) => {
          const p = spring({frame: frame - (48 + i * 55), fps, config: {damping: 13}});
          return (
            <div
              key={c}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                background: 'rgba(20,22,28,0.85)',
                borderRadius: 20,
                padding: '14px 36px',
                opacity: Math.max(0, p),
                transform: `translateX(${(1 - p) * 120}px)`,
                fontFamily: FONT,
                fontSize: 40,
                fontWeight: 700,
                color: 'white',
              }}
            >
              <span
                style={{
                  color: 'white',
                  background: ACCENT,
                  borderRadius: '50%',
                  width: 52,
                  height: 52,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                }}
              >
                ✓
              </span>
              {c}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- S3: fullscreen -> miniature + animated counter -> fullscreen
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const toMini = interpolate(frame, [28, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const backFull = interpolate(frame, [150, 164], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const mini = toMini * (1 - backFull);
  const scale = 1 - 0.38 * mini;
  const ty = mini * -21;
  const count = Math.round(
    interpolate(frame, [36, 88], [1000, 3000], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    })
  );
  const counterVis = mini;
  const pulse = 1 + 0.015 * Math.sin((frame / fps) * Math.PI * 2.4);
  return (
    <ZoomIn>
      <AbsoluteFill
        style={{background: 'radial-gradient(120% 90% at 50% 30%, #16181d 0%, #0a0a0c 70%)'}}
      >
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) translateY(${ty}%)`,
            borderRadius: 44 * mini,
            overflow: 'hidden',
            boxShadow: `0 30px 90px rgba(0,0,0,${0.65 * mini})`,
          }}
        >
          <OffthreadVideo
            src={staticFile('v1.mp4')}
            startFrom={269}
            endAt={269 + S3_DUR}
            volume={vol(S3_DUR)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            bottom: '6%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            opacity: counterVis,
            fontFamily: FONT,
          }}
        >
          <div
            style={{
              fontSize: 150,
              fontWeight: 800,
              color: ACCENT,
              transform: `scale(${pulse})`,
              textShadow: `0 0 80px ${ACCENT}66`,
            }}
          >
            {count.toLocaleString('es')}
          </div>
          <div style={{fontSize: 46, fontWeight: 800, color: 'white', letterSpacing: 3}}>
            MENSAJES POR DÍA
          </div>
          <div style={{fontSize: 34, fontWeight: 600, color: '#9aa3ad'}}>
            a personas interesadas en tu negocio
          </div>
        </div>
      </AbsoluteFill>
    </ZoomIn>
  );
};

// ---------- S4: CTA speech fullscreen + pulsing bottom pill
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pillIn = spring({frame: frame - 40, fps, config: {damping: 13}});
  const pulse = 1 + 0.03 * Math.sin((frame / fps) * Math.PI * 2.2);
  return (
    <ZoomIn>
      <OffthreadVideo
        src={staticFile('v3.mp4')}
        startFrom={703}
        endAt={703 + S4_DUR}
        volume={vol(S4_DUR)}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.max(0, pillIn),
          transform: `translateY(${(1 - pillIn) * 60}px)`,
        }}
      >
        <div
          style={{
            background: ACCENT,
            color: 'white',
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 46,
            padding: '20px 60px',
            borderRadius: 60,
            transform: `scale(${pulse})`,
            boxShadow: `0 0 70px ${ACCENT}55`,
          }}
        >
          ESCRÍBEME “INFO” ↓
        </div>
      </div>
    </ZoomIn>
  );
};

// ---------- S5: end card (same design as campaign card)
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleIn = spring({frame, fps, config: {damping: 14, mass: 0.8}});
  const pillIn = spring({frame: frame - 18, fps, config: {damping: 13, mass: 0.7}});
  const bgIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = frame > 45 ? 1 + 0.02 * Math.sin(((frame - 45) / fps) * Math.PI * 2.2) : 1;
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(120% 90% at 50% 30%, #16181d 0%, #0a0a0c 70%)',
        opacity: bgIn,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        gap: 70,
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 92,
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.15,
          transform: `translateY(${(1 - titleIn) * 90}px) scale(${0.92 + titleIn * 0.08})`,
          opacity: titleIn,
        }}
      >
        ¿QUIERES ESTE
        <br />
        SISTEMA PARA
        <br />
        TU NEGOCIO?
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 34,
          transform: `translateY(${(1 - pillIn) * 70}px)`,
          opacity: Math.max(0, pillIn),
        }}
      >
        <div style={{color: '#9aa3ad', fontSize: 40, fontWeight: 600}}>
          Envíame un mensaje con la palabra
        </div>
        <div
          style={{
            background: ACCENT,
            color: 'white',
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: 6,
            padding: '26px 90px',
            borderRadius: 24,
            transform: `scale(${pulse})`,
            boxShadow: `0 0 90px ${ACCENT}55`,
          }}
        >
          INFO
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ProEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#0a0a0c'}}>
      <Sequence durationInFrames={S1_DUR}>
        <S1 />
      </Sequence>
      <Sequence from={S1_DUR} durationInFrames={S2_DUR}>
        <S2 />
      </Sequence>
      <Sequence from={S1_DUR + S2_DUR} durationInFrames={S3_DUR}>
        <S3 />
      </Sequence>
      <Sequence from={S1_DUR + S2_DUR + S3_DUR} durationInFrames={S4_DUR}>
        <S4 />
      </Sequence>
      <Sequence from={S1_DUR + S2_DUR + S3_DUR + S4_DUR} durationInFrames={S5_DUR}>
        <S5 />
      </Sequence>
    </AbsoluteFill>
  );
};
