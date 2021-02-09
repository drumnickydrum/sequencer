import React from 'react';
import { SamplersProvider } from './Providers/Samplers';
import { SequencerProvider } from './Providers/Sequencer';
import { Transport } from './Sections/Transport';
import { Grid } from './Sections/Grid';
import { Instruments } from './Sections/Instruments';

export default function App() {
  return (
    <SamplersProvider>
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
    </SamplersProvider>
  );
}
