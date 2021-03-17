import React from 'react';
import { Transport } from '../Sections/Transport';
import { Grid } from '../Sections/Grid';
import { PastePattern } from '../Sections/PastePattern';
import { SoundPanel } from '../Sections/SoundPanel';
import { Clear, UndoRedo } from '../Sections/UndoRedoClear';
import { LoadSaveButton } from '../Sections/LoadSaveButton';
import { LoadSavePattern } from '../Sections/LoadSavePattern';

export const SequencerPage = () => {
  const scroll = (dir) => {
    const container = document.getElementById('bottom');
    const offset = dir === 'right' ? window.innerWidth : window.innerWidth * -1;
    const start = container.scrollLeft;
    container.scrollTo({ left: start + offset, behavior: 'smooth' });
  };

  return (
    <>
      <div id='main'>
        <Grid />
        <PastePattern />
      </div>
      <div id='sound-panel'>
        <SoundPanel />
      </div>
      <div id='bottom'>
        <Transport scroll={scroll} />
        <UndoRedo scroll={scroll} />
        <Clear scroll={scroll} />
        <LoadSaveButton scroll={scroll} />
      </div>
      <LoadSavePattern />
    </>
  );
};
