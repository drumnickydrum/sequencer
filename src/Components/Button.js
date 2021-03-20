import React, { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { pressDown, pressUp } from '../utils/press';

export const Button = ({
  fwdRef,
  id,
  classes,
  disabled = false,
  onClick,
  children,
}) => {
  const ref = useRef(null);
  return (
    <button
      ref={fwdRef || ref}
      id={id}
      className={classes + ' btn'}
      disabled={disabled}
      onTouchStart={() => pressDown(ref)}
      onTouchEnd={() => pressUp(ref)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const useScrollBtns = (elemRef, scrollbarRef, scroll, numChildren) => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const handleScroll = (dir) => {
    if (dir === 'left') {
      if (elemRef.current.scrollLeft - scrollbarRef.current.clientWidth <= 0) {
        if (leftRef.current) {
          leftRef.current.disabled = true;
        }
      } else {
        if (rightRef.current) {
          rightRef.current.disabled = false;
        }
      }
    } else {
      if (
        elemRef.current.scrollLeft + scrollbarRef.current.clientWidth >=
        (numChildren - 1) * scrollbarRef.current.clientWidth
      ) {
        if (rightRef.current) {
          rightRef.current.disabled = true;
        }
      }
      if (leftRef.current) {
        leftRef.current.disabled = false;
      }
    }
    scroll(dir);
  };

  const ScrollLeft = () => {
    return (
      <Button
        fwdRef={leftRef}
        classes='scroll-left'
        onClick={() => handleScroll('left')}
      >
        <div className=''>
          <ChevronLeftIcon />
        </div>
      </Button>
    );
  };
  const ScrollRight = () => {
    return (
      <Button
        fwdRef={rightRef}
        classes='scroll-right'
        onClick={() => handleScroll('right')}
      >
        <div className=''>
          <ChevronRightIcon />
        </div>
      </Button>
    );
  };

  return { ScrollLeft, ScrollRight };
};
