import React from 'react';
import { KitProvider } from './Providers/Kit';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { SoundSelector } from './Sections/SoundSelector';
import { Grid } from './Sections/Grid';
import { Transport } from './Sections/Transport';

export default function App() {
  return (
    <KitProvider>
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
    </KitProvider>
  );
}
