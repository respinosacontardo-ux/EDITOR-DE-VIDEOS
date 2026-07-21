import React from 'react';
import {Composition} from 'remotion';
import {Presentacion, DUR} from './Presentacion';
import {AdMeta, DUR_AD} from './AdMeta';

export const Root: React.FC = () => (
  <>
    <Composition id="Presentacion" component={Presentacion} durationInFrames={DUR} fps={30} width={1080} height={1920} />
    <Composition id="AdMeta" component={AdMeta} durationInFrames={DUR_AD} fps={30} width={1080} height={1920} />
  </>
);
