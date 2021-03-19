import React, { useEffect, useRef } from 'react';
import { TransportPanel } from '../Sections/TransportPanel';
import { Grid } from '../Sections/Grid';
import { PastePattern } from '../Sections/PastePattern';
import { SoundPanel } from '../Sections/SoundPanel';
import { Clear, UndoRedo } from '../Sections/UndoRedoClear';
import { LoadSaveButton } from '../Sections/LoadSaveButton';
import { LoadSavePattern } from '../Sections/LoadSavePattern';
import { ChangeKit } from '../Sections/ChangeKit';

export const BottomScroll = React.createContext();
export const SequencerPage = () => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      const width = window.innerWidth;
      bottomRef.current.scrollTo({ left: width * 2, behavior: 'smooth' });
    }
  });

  const scroll = (dir) => {
    const offset = dir === 'right' ? window.innerWidth : window.innerWidth * -1;
    const start = bottomRef.current.scrollLeft;
    bottomRef.current.scrollTo({ left: start + offset, behavior: 'smooth' });
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
      <div ref={bottomRef} id='bottom'>
        <BottomScroll.Provider value={{ scroll }}>
          <ChangeKit />
          <LoadSaveButton />
          <TransportPanel />
          <UndoRedo />
          <Clear />
        </BottomScroll.Provider>
      </div>
      <LoadSavePattern />
    </>
  );
};
