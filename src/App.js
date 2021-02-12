import React from 'react';
import { InstrumentProvider } from './Providers/Instrument';
import { EditorProvider } from './Providers/Editor';
import { SequencerProvider } from './Providers/Sequencer';
import { SoundSelector } from './Sections/SoundSelector';
import { Grid } from './Sections/Grid';
import { Transport } from './Sections/Transport';
import { PatternProvider } from './Providers/Pattern';

export default function App() {
  return (
    <PatternProvider>
      <InstrumentProvider>
        <EditorProvider>
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
        </EditorProvider>
      </InstrumentProvider>
    </PatternProvider>
  );
}
