import {Composition} from 'remotion';
import {OverlayCard, overlayCardSchema} from './OverlayCard';

// One composition per animation slot. Adjust durationInFrames/fps/size to
// match the EDL overlay spec, then edit OverlayCard (or add new comps).
export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="OverlayCard"
        component={OverlayCard}
        schema={overlayCardSchema}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'NINETY PERCENT',
          subtitle: 'of what a web agent does is wasted',
          accent: '#FF5A00',
        }}
      />
    </>
  );
};
