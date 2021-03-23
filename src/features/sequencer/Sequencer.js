import React, { useEffect, useRef } from 'react';
import { Grid } from './components/main/Grid';
import { PastePattern } from './components/main/PastePattern';
import { SoundPanel } from './components/sound-panel/SoundPanel';
import { TransportPanel } from './components/menu/TransportPanel';
import { UndoRedo } from './components/menu/UndoRedo';
import { Clear } from './components/menu/Clear';
import { LoadSaveButton } from './components/menu/LoadSaveButton';
import { ChangeKit } from './components/menu/ChangeKit';
import { LoadSavePattern } from './components/load/LoadSavePattern';
import { ScrollLeft, ScrollRight } from '../../components/Button';
import { KitProvider } from './providers/Kit';
import { Transport } from './components/Transport';
import { PatternRefProvider } from './providers/PatternRef';

export const SequencerPage = () => {
  console.log('rendering: SequencerPage');
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

const Menu = () => {
  const menuRef = useRef(null);
  const scrollbarRef = useRef(null);

  useEffect(() => {
    if (menuRef.current) {
      const width = scrollbarRef.current.clientWidth;
      menuRef.current.scrollTo({
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
    const start = menuRef.current.scrollLeft;
    menuRef.current.scrollTo({ left: start + offset, behavior: 'smooth' });
    scrollEnd.current = setTimeout(() => disableScroll(), 500);
  };

  const enableScroll = () => {
    rightRef.current.disabled = false;
    leftRef.current.disabled = false;
  };

  const disableScroll = () => {
    if (menuRef.current.scrollLeft <= 0) {
      leftRef.current.disabled = true;
    }
    if (
      menuRef.current.scrollLeft + scrollbarRef.current.clientWidth >=
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

  console.log('rendering: Menu');
  return (
    <div ref={menuRef} id='menu' onScroll={handleScroll}>
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
