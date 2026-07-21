import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';

export const overlayCardSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  accent: z.string(),
});

// Worked example: a title card with a springy reveal and a 1s final hold
// (the skill's "hold the final frame ≥ 1s" rule). Replace freely — this
// file is the thing each slot rewrites. Transparent background so it can
// be rendered to alpha WebM and composited as an overlay.
export const OverlayCard: React.FC<z.infer<typeof overlayCardSchema>> = ({
  title,
  subtitle,
  accent,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const reveal = spring({frame, fps, config: {damping: 200}});
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 110,
          fontWeight: 700,
          transform: `translateY(${(1 - reveal) * 60}px)`,
          opacity: reveal,
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: accent,
          fontSize: 44,
          marginTop: 24,
          opacity: subtitleOpacity,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
