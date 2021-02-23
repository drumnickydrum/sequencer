import React from 'react';
import { InstrumentProvider } from './Providers/Instrument';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { SoundSelector } from './Sections/SoundSelector';
import { Grid } from './Sections/Grid';
import { Transport } from './Sections/Transport';

export default function App() {
  return (
    <InstrumentProvider>
      <PatternProvider>
        <SequencerProvider>
          <div id='app'>
            <div id='top'>
              <SoundSelector />
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
    </InstrumentProvider>
  );
}
