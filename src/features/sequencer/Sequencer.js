import React, { useEffect, useRef } from 'react';
import { Grid } from './components/main/Grid';
import { PastePattern } from './components/main/PastePattern';
import { SoundPanel } from './components/sound-panel/SoundPanel';
import { TransportPanel } from './components/bottom/TransportPanel';
import { UndoRedo } from './components/bottom/UndoRedo';
import { Clear } from './components/bottom/Clear';
import { LoadSaveButton } from './components/bottom/LoadSaveButton';
import { ChangeKit } from './components/bottom/ChangeKit';
import { LoadSavePattern } from './components/load/LoadSavePattern';
import { ScrollLeft, ScrollRight } from '../../components/Button';
import { KitProvider } from './providers/Kit';
import { TransportProvider } from './providers/Transport';
import { PatternRefProvider } from './providers/PatternRef';

export const SequencerPage = () => {
  console.log('rendering: SequencerPage');
  return (
    <KitProvider>
      <PatternRefProvider>
        <TransportProvider>
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
        </TransportProvider>
      </PatternRefProvider>
    </KitProvider>
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

  console.log('rendering: Bottom');
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
