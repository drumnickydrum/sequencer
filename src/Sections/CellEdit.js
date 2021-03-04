import React, { useContext } from 'react';
import { Pattern } from '../Providers/Pattern';

export const CellEdit = ({ closeCbRef, selectedSound }) => {
  const { cellMod, setCellMod, resetCellMods } = useContext(Pattern);
  closeCbRef.current.push(() => {
    setCellMod('');
  });

  const handleCellMod = (type) => {
    const cells = document.querySelectorAll('.on');
    if (type === 'cancel') {
      cells.forEach((cell) => cell.classList.remove('flashing'));
      setCellMod('');
    } else {
      cells.forEach((cell) => cell.classList.add('flashing'));
      setCellMod(type);
    }
  };

  return (
    <div className='sound-edit'>
      <div className={`sample-edit color${selectedSound}`}>
        <div onClick={() => handleCellMod('cancel')}>cancel</div>
        <div className='cell-mod-wrapper'>
          <div onClick={() => handleCellMod('pitch')}>
            <p>pitch</p>
            {cellMod === 'pitch' && 'editing'}
          </div>
          <p onClick={() => resetCellMods('pitch')}>reset</p>
        </div>
        <div className='cell-mod-wrapper'>
          <div onClick={() => handleCellMod('velocity')}>
            <p>velocity</p>
            {cellMod === 'velocity' && 'editing'}
          </div>
          <p onClick={() => resetCellMods('velocity')}>reset</p>
        </div>
        <div className='cell-mod-wrapper'>
          <div onClick={() => handleCellMod('length')}>
            <p>length</p>
            {cellMod === 'length' && 'editing'}
          </div>
          <p onClick={() => resetCellMods('length')}>reset</p>
        </div>
      </div>
    </div>
  );
};
