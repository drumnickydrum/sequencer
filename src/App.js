import React from 'react';
import { KitProvider } from './Providers/Kit';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { SoundSelector } from './Sections/SoundSelector';
import { Grid } from './Sections/Grid';
import { Clear, History } from './Sections/Edit';
import { Transport } from './Sections/Transport';

export default function App() {
  return (
    <KitProvider>
      <PatternProvider>
        <SequencerProvider>
          <div id='app'>
            <div id='address-bar' />
            <div id='top'>
              <SoundSelector />
            </div>
            <div id='middle'>
              <Grid />
            </div>
            <div id='bottom'>
              <Clear />
              <History />
              <Transport />
            </div>
            <div id='toolbar' />
          </div>
        </SequencerProvider>
      </PatternProvider>
    </KitProvider>
  );
}

window.addEventListener('orientationchange', function () {
  var originalBodyStyle = getComputedStyle(document.body).getPropertyValue(
    'display'
  );
  document.body.style.display = 'none';
  setTimeout(function () {
    document.body.style.display = originalBodyStyle;
  }, 10);
});
