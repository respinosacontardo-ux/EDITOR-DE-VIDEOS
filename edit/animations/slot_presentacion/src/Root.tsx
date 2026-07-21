import React from 'react';
import {Composition} from 'remotion';
import {Presentacion, DUR} from './Presentacion';

export const Root: React.FC = () => (
  <>
    <Composition
      id="Presentacion"
      component={Presentacion}
      durationInFrames={DUR}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
