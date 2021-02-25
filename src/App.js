import React from 'react';
import { KitProvider } from './Providers/Kit';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { SoundSelector } from './Sections/SoundSelector';
import { Grid } from './Sections/Grid';
import { Edit } from './Sections/Edit';
import { Transport } from './Sections/Transport';

export default function App() {
  return (
    <KitProvider>
      <PatternProvider>
        <SequencerProvider>
          <div id='top'>
            <Grid />
          </div>
          <div id='middle'>
            <SoundSelector />
          </div>

          <div id='bottom'>
            <div id='bottom-container'>
              <Transport />
              <Edit />
            </div>
          </div>
        </SequencerProvider>
      </PatternProvider>
    </KitProvider>
  );
}

window.addEventListener('orientationchange', resize);
window.addEventListener('blur', () => {
  window.addEventListener('focus', resize);
});

function resize() {
  var originalBodyStyle = getComputedStyle(document.body).getPropertyValue(
    'display'
  );
  document.body.style.display = 'none';
  setTimeout(function () {
    document.body.style.display = originalBodyStyle;
  }, 10);
  window.removeEventListener('focus', resize);
}
