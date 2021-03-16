import React from 'react';
import { useParams } from 'react-router';
import { Transport } from '../Sections/Transport';
import { Grid } from '../Sections/Grid';
import { PastePattern } from '../Sections/PastePattern';
import { SoundPanel } from '../Sections/SoundPanel';
import { Clear, UndoRedo } from '../Sections/UndoRedoClear';
import { LoadSaveButton } from '../Sections/LoadSaveButton';
import { LoadSavePattern } from '../Sections/LoadSavePattern';

export const SequencerPage = () => {
  const { redirect } = useParams();

  return (
    <>
      <div id='transport'>
        <Transport />
      </div>
      <div id='main'>
        <Grid />
        <PastePattern />
      </div>

      <div id='sound-panel'>
        <SoundPanel />
      </div>
      <div id='bottom'>
        <UndoRedo />
        <Clear />
        <LoadSaveButton />
      </div>
      <LoadSavePattern show={redirect === 'load'} />
    </>
  );
};
