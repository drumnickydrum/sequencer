import React, { useContext } from 'react';
import { Pattern } from '../Providers/Pattern';
import { SoundEdit } from './SoundEdit';
import { PitchIcon, VelocityIcon, LengthIcon } from '../icons';

export const CellEdit = ({ closeCbRef, selectedSound }) => {
  const { cellMod, setCellMod, resetCellMods } = useContext(Pattern);
  closeCbRef.current.push(() => {
    setCellMod('');
  });

  const handleCellMod = (type) => {
    const cells = document.querySelectorAll('.on');
    if (type === 'finish') {
      cells.forEach((cell) => cell.classList.remove('flashing'));
      setCellMod('');
    } else {
      cells.forEach((cell) => cell.classList.add('flashing'));
      setCellMod(type);
    }
  };

  const finish = () => handleCellMod('finish');

  return !cellMod ? (
    <div className='sound-edit'>
      <div className={`sample-edit color${selectedSound}`}>
        <div className='mod-wrapper'>
          <div onClick={() => handleCellMod('pitch')}>
            <PitchIcon />
            <p>Pitch</p>
            {cellMod === 'pitch' && 'editing'}
          </div>
          {/* <p onClick={() => resetCellMods('pitch')}>reset</p> */}
        </div>
        <div className='mod-wrapper'>
          <div onClick={() => handleCellMod('velocity')}>
            <VelocityIcon />
            <p>Velocity</p>
            {cellMod === 'velocity' && 'editing'}
          </div>
          {/* <p onClick={() => resetCellMods('velocity')}>reset</p> */}
        </div>
        <div className='mod-wrapper'>
          <div onClick={() => handleCellMod('length')}>
            <LengthIcon />
            <p>Length</p>
            {cellMod === 'length' && 'editing'}
          </div>
          {/* <p onClick={() => resetCellMods('length')}>reset</p> */}
        </div>
      </div>
    </div>
  ) : (
    <SoundEdit cellMod={cellMod} finish={finish} />
  );
};
