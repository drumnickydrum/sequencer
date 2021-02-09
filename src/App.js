import React from 'react';
import { SamplerProvider } from './Providers/Sampler';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { Transport } from './Sections/Transport';
import { Editor } from './Sections/Editor';

export default function App() {
  return (
    <SamplerProvider>
      <PatternProvider>
        <SequencerProvider>
          <div id='app'>
            <Transport />
            <Editor />
          </div>
        </SequencerProvider>
      </PatternProvider>
    </SamplerProvider>
  );
}
