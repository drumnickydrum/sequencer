import React from 'react';
import { Transport } from '../Sections/Transport';
import { Grid } from '../Sections/Grid';
import { PastePattern } from '../Sections/PastePattern';
import { SoundPanel } from '../Sections/SoundPanel';
import { Clear, UndoRedo } from '../Sections/UndoRedoClear';
import { LoadSaveButton } from '../Sections/LoadSaveButton';
import { LoadSavePattern } from '../Sections/LoadSavePattern';

export const SequencerPage = () => {
  return (
    <>
      <div id='top'>
        <Grid />
        <PastePattern />
      </div>

      <div id='middle'>
        <SoundPanel />
      </div>
      <div id='bottom'>
        <Transport />
        <UndoRedo />
        <Clear />
        <LoadSaveButton />
      </div>
      <LoadSavePattern />
    </>
  );
};
