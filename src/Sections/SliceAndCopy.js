import React, { useContext } from 'react';
import { CopyIcon, SawIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const SliceAndCopy = ({ closeCbRef }) => {
  const { slicing, setSlicing, copying, setCopying } = useContext(Pattern);
  closeCbRef.current.push(
    () => {
      setSlicing(false);
    },
    () => {
      setCopying(false);
    }
  );

  const handleSlice = () => {
    const cells = document.querySelectorAll('.on');
    if (slicing) {
      cells.forEach((cell) => cell.classList.remove('flashing'));
      setSlicing(false);
    } else {
      cells.forEach((cell) => cell.classList.add('flashing'));
      setSlicing(true);
    }
  };

  const handleCopy = () => {
    setCopying((copying) => !copying);
  };

  return (
    <div className='sound-edit'>
      <div className='sound-pattern-edit'>
        {copying ? (
          <p className='instruction'>Click sound to paste copied pattern</p>
        ) : (
          <div className='sound-pattern-edit-btn' onClick={handleSlice}>
            <SawIcon addClass={slicing ? 'slicing' : ''} />
            <p>{slicing ? 'Finish' : 'Slice'}</p>
          </div>
        )}
        {slicing ? (
          <p className='instruction'>Click cell to slice in half or thirds</p>
        ) : (
          <div className='sound-pattern-edit-btn' onClick={handleCopy}>
            <CopyIcon addClass={copying ? 'copying' : ''} />
            <p>{copying ? 'Finish' : 'Copy'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
