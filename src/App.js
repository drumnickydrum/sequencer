import React from 'react';
import { KitProvider } from './Providers/Kit';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { InfoProvider } from './Providers/Info';
import { SoundSelector } from './Sections/SoundSelector';
import { Grid } from './Sections/Grid';
import { Edit } from './Sections/Edit';
import { Transport } from './Sections/Transport';
import { Information } from './Sections/Information';

export default function App() {
  return (
    <InfoProvider>
      <KitProvider>
        <PatternProvider>
          <SequencerProvider>
            <div id='address-bar'></div>
            <div id='top'>
              <Grid />
              <Information />
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
            <div id='toolbar'></div>
          </SequencerProvider>
        </PatternProvider>
      </KitProvider>
    </InfoProvider>
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
