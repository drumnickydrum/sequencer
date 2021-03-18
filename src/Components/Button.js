import React, { useContext, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { pressDown, pressUp } from '../utils/press';
import { BottomScroll } from '../Pages/Sequencer';

export const Button = ({
  id,
  classes,
  onClick,
  disabled = false,
  children,
}) => {
  const ref = useRef(null);
  return (
    <button
      ref={ref}
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

export const NavLeft = () => {
  const { scroll } = useContext(BottomScroll);
  return (
    <Button classes='nav-left' onClick={() => scroll('left')}>
      <div className=''>
        <ChevronLeftIcon />
      </div>
    </Button>
  );
};

export const NavRight = () => {
  const { scroll } = useContext(BottomScroll);
  return (
    <Button classes='nav-right' onClick={() => scroll('right')}>
      <div className=''>
        <ChevronRightIcon />
      </div>
    </Button>
  );
};
