import {Composition} from 'remotion';
import {ProEdit} from './ProEdit';

export const Root: React.FC = () => {
  return (
    <Composition
      id="ProEdit"
      component={ProEdit}
      durationInFrames={897}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
