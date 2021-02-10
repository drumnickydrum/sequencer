import React from 'react';
import { SamplesProvider } from './Providers/Samples';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { Transport } from './Sections/Transport';
import { Editor } from './Sections/Editor';

export default function App() {
  return (
    <SamplesProvider>
      <PatternProvider>
        <SequencerProvider>
          <div id='app'>
            <Transport />
            <Editor />
          </div>
        </SequencerProvider>
      </PatternProvider>
    </SamplesProvider>
  );
}
