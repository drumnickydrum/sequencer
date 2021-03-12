import React from 'react';
import { Transport } from '../Sections/Transport';
import { Grid } from '../Sections/Grid';
import { Information } from '../Sections/Information';
import { PastePattern } from '../Sections/PastePattern';
import { SoundPanel } from '../Sections/SoundPanel';
import { Clear, UndoRedo } from '../Sections/UndoRedoClear';

export const SequencerPage = () => {
  return (
    <>
      <div id='top'>
        <Grid />
        <PastePattern />
        <Information />
      </div>

      <div id='middle'>
        <SoundPanel />
      </div>
      <div id='bottom'>
        <div className='scroll-container'>
          <Transport />
          <UndoRedo />
          <Clear />
        </div>
      </div>
    </>
  );
};