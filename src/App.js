import React from 'react';
import { KitProvider } from './Providers/Kit';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { InfoProvider } from './Providers/Info';
import { SoundPanel } from './Sections/SoundPanel';
import { Grid } from './Sections/Grid';
import { PastePattern } from './Sections/PastePattern';
import { Edit } from './Sections/Edit';
import { Transport } from './Sections/Transport';
import { Information } from './Sections/Information';
import { UndoProvider } from './Providers/UndoProvider';

export default function App() {
  return (
    <InfoProvider>
      <KitProvider>
        <UndoProvider>
          <PatternProvider>
            <SequencerProvider>
              <div id='address-bar'></div>

              <div id='two'>
                <Grid />
                <PastePattern />
                <Information />
              </div>

              <div id='three'>
                <SoundPanel />
              </div>
              <div id='one'>
                <div className='scroll-container'>
                  <Transport />
                  {/* <Edit /> */}
                </div>
              </div>

              <div id='toolbar'></div>
            </SequencerProvider>
          </PatternProvider>
        </UndoProvider>
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
