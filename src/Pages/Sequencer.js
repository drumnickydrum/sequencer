import React, { useEffect, useRef } from 'react';
import { TransportPanel } from '../Sections/TransportPanel';
import { Grid } from '../Sections/Grid';
import { PastePattern } from '../Sections/PastePattern';
import { SoundPanel } from '../Sections/SoundPanel';
import { Clear, UndoRedo } from '../Sections/UndoRedoClear';
import { LoadSaveButton } from '../Sections/LoadSaveButton';
import { LoadSavePattern } from '../Sections/LoadSavePattern';
import { ChangeKit } from '../Sections/ChangeKit';
import { useScrollBtns } from '../Components/Button';

export const SequencerPage = () => {
  return (
    <>
      <div id='sequencer'>
        <div id='main'>
          <Grid />
          <PastePattern />
        </div>
        <div id='sound-panel'>
          <SoundPanel />
        </div>
        <Bottom />
      </div>
      <LoadSavePattern />
    </>
  );
};

const Bottom = () => {
  const bottomRef = useRef(null);
  const scrollbarRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      const width = scrollbarRef.current.clientWidth;
      bottomRef.current.scrollTo({ left: width * 2, behavior: 'smooth' });
    }
    console.log('rendering bottom');
  });

  const scroll = (dir) => {
    const offset =
      dir === 'right'
        ? scrollbarRef.current.clientWidth
        : scrollbarRef.current.clientWidth * -1;
    const start = bottomRef.current.scrollLeft;
    bottomRef.current.scrollTo({ left: start + offset, behavior: 'smooth' });
  };

  const { ScrollLeft, ScrollRight } = useScrollBtns(
    bottomRef,
    scrollbarRef,
    scroll,
    5
  );

  return (
    <div ref={bottomRef} id='bottom'>
      <ChangeKit />
      <LoadSaveButton />
      <TransportPanel />
      <UndoRedo />
      <Clear />
      <div ref={scrollbarRef} className='scrollbar'>
        <ScrollLeft />
        <ScrollRight />
      </div>
    </div>
  );
};
