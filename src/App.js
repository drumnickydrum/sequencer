import React from 'react';
import { SamplerProvider } from './Providers/Sampler';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { Transport } from './Sections/Transport';
import { Grid } from './Sections/Grid';
import { Instruments } from './Sections/Instruments';

export default function App() {
  return (
    <SamplerProvider>
      <PatternProvider>
        <SequencerProvider>
          <div id='app'>
            <div id='top'>
              <Transport />
            </div>
            <Grid />
            <div id='bottom'>
              <Instruments />
            </div>
          </div>
        </SequencerProvider>
      </PatternProvider>
    </SamplerProvider>
  );
}
