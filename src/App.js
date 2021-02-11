import React from 'react';
import { SamplesProvider } from './Providers/Samples';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { Instrument } from './Sections/Instrument';
import { Grid } from './Sections/Grid';
import { Transport } from './Sections/Transport';

export default function App() {
  return (
    <SamplesProvider>
      <PatternProvider>
        <SequencerProvider>
          <div id='app'>
            <div id='top'>
              <Instrument />
            </div>
            <div id='middle'>
              <Grid />
            </div>
            <div id='bottom'>
              <Transport />
            </div>
          </div>
        </SequencerProvider>
      </PatternProvider>
    </SamplesProvider>
  );
}
