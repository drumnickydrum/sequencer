import React from 'react';
import { SamplesProvider } from './Providers/Samples';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { Transport } from './Sections/Transport';
import { Grid } from './Sections/Grid';

export default function App() {
  return (
    <SamplesProvider>
      <PatternProvider>
        <SequencerProvider>
          <div id='app'>
            <div id='top'></div>
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
