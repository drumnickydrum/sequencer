import React, { useEffect, useRef } from 'react';
import { Transport } from '../Sections/Transport';
import { Grid } from '../Sections/Grid';
import { PastePattern } from '../Sections/PastePattern';
import { SoundPanel } from '../Sections/SoundPanel';
import { Clear, UndoRedo } from '../Sections/UndoRedoClear';
import { LoadSaveButton } from '../Sections/LoadSaveButton';
import { LoadSavePattern } from '../Sections/LoadSavePattern';
import { ChangeKit } from '../Sections/ChangeKit';

export const SequencerPage = () => {
  const bottomRef = useRef(null);

  const scroll = (dir) => {
    const offset = dir === 'right' ? window.innerWidth : window.innerWidth * -1;
    const start = bottomRef.current.scrollLeft;
    bottomRef.current.scrollTo({ left: start + offset, behavior: 'smooth' });
  };

  useEffect(() => {
    if (bottomRef.current) {
      const width = window.innerWidth;
      bottomRef.current.scrollTo({ left: width * 2, behavior: 'smooth' });
    }
  });

  return (
    <>
      <div id='main'>
        <Grid />
        <PastePattern />
      </div>
      <div id='sound-panel'>
        <SoundPanel />
      </div>
      <div ref={bottomRef} id='bottom'>
        <ChangeKit scroll={scroll} />
        <LoadSaveButton scroll={scroll} />
        <Transport scroll={scroll} />
        <UndoRedo scroll={scroll} />
        <Clear scroll={scroll} />
      </div>
      <LoadSavePattern />
    </>
  );
};
