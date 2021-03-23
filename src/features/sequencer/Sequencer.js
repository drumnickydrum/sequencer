import React from 'react';
import { Grid } from './components/main/Grid';
import { PastePattern } from './components/main/PastePattern';
import { SoundPanel } from './components/sound-panel/SoundPanel';
import { LoadSavePattern } from './components/load/LoadSavePattern';
import { Menu } from './components/Menu';
import { KitProvider } from './providers/Kit';
import { Transport } from './components/Transport';
import { PatternRefProvider } from './providers/PatternRef';

export const SequencerPage = () => {
  // console.log('rendering: SequencerPage');
  return (
    <KitProvider>
      <PatternRefProvider>
        <div id='sequencer'>
          <div id='main'>
            <Grid />
            <PastePattern />
          </div>
          <div id='sound-panel'>
            <SoundPanel />
          </div>
          <Menu />
        </div>
        <LoadSavePattern />
        <Transport />
      </PatternRefProvider>
    </KitProvider>
  );
};
