import React, { useEffect, useRef } from 'react';
import { TransportPanel } from '../Sections/TransportPanel';
import { Grid } from '../features/sequencer/Grid';
import { PastePattern } from '../Sections/PastePattern';
import { SoundPanel } from '../Sections/SoundPanel';
import { Clear, UndoRedo } from '../Sections/UndoRedoClear';
import { LoadSaveButton } from '../Sections/LoadSaveButton';
import { LoadSavePattern } from '../Sections/LoadSavePattern';
import { ChangeKit } from '../Sections/ChangeKit';
import { ScrollLeft, ScrollRight } from '../Components/Button';

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
      bottomRef.current.scrollTo({
        left: width * 2,
        behavior: 'smooth',
      });
    }
    console.log('rendering bottom');
  });

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const scrollEnd = useRef(null);

  const scroll = (dir) => {
    enableScroll();
    clearTimeout(scrollEnd.current);
    const offset =
      dir === 'right'
        ? scrollbarRef.current.clientWidth
        : scrollbarRef.current.clientWidth * -1;
    const start = bottomRef.current.scrollLeft;
    bottomRef.current.scrollTo({ left: start + offset, behavior: 'smooth' });
    scrollEnd.current = setTimeout(() => disableScroll(), 500);
  };

  const enableScroll = () => {
    rightRef.current.disabled = false;
    leftRef.current.disabled = false;
  };

  const disableScroll = () => {
    if (bottomRef.current.scrollLeft <= 0) {
      leftRef.current.disabled = true;
    }
    if (
      bottomRef.current.scrollLeft + scrollbarRef.current.clientWidth >=
      5 * scrollbarRef.current.clientWidth
    ) {
      rightRef.current.disabled = true;
    }
  };

  const handleScroll = () => {
    enableScroll();
    clearTimeout(scrollEnd.current);
    scrollEnd.current = setTimeout(() => disableScroll(), 100);
  };

  return (
    <div ref={bottomRef} id='bottom' onScroll={handleScroll}>
      <ChangeKit />
      <LoadSaveButton />
      <TransportPanel />
      <UndoRedo />
      <Clear />
      <div ref={scrollbarRef} className='scrollbar'>
        <ScrollLeft fwdRef={leftRef} onClick={() => scroll('left')} />
        <ScrollRight fwdRef={rightRef} onClick={() => scroll('right')} />
      </div>
    </div>
  );
};
